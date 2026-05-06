/* solutions.js */
let indexData=null,activeItem=null;

async function init(){
  try{ const r=await fetch('/api/index'); indexData=await r.json(); }
  catch(e){ document.getElementById('sidebarNav').innerHTML=`<div style="padding:16px;color:var(--hard);font-size:.8rem">載入失敗</div>`; return; }
  buildSidebar();
  setupSearch();
  const hash=location.hash.slice(1);
  if(hash){ const m=hash.match(/(\d+)$/); if(m){ const id=parseInt(m[1]); for(const cat of indexData.categories){ const p=cat.problems.find(x=>x.id===id); if(p){loadProblem(p,cat);break;} } } }
}

function buildSidebar(filter=''){
  const nav=document.getElementById('sidebarNav'); nav.innerHTML='';
  const fl=filter.toLowerCase();
  for(const cat of indexData.categories){
    const probs=filter ? cat.problems.filter(p=>String(p.id).includes(filter)||p.title.toLowerCase().includes(fl)||p.difficulty.includes(fl)) : cat.problems;
    if(filter&&!probs.length) continue;
    const section=document.createElement('div'); section.className='cat-section'; section.dataset.slug=cat.slug;
    const toggle=document.createElement('button'); toggle.className='cat-toggle'+(filter?' open':'');
    toggle.innerHTML=`<span class="cat-icon">${cat.icon}</span><span>${cat.name}</span><span class="cat-count">${cat.problems.length}</span><span class="cat-chevron">▶</span>`;
    toggle.addEventListener('click',()=>{ section.classList.toggle('open'); toggle.classList.toggle('open'); });
    const list=document.createElement('div'); list.className='cat-problems';
    for(const prob of probs){
      const item=document.createElement('div'); item.className='prob-item'; item.dataset.id=prob.id;
      item.innerHTML=`<span class="prob-dot ${prob.difficulty}"></span><span class="prob-num">${prob.id}</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${prob.title}</span>`;
      item.addEventListener('click',()=>{ loadProblem(prob,cat); if(window.innerWidth<=768){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('open'); } });
      list.appendChild(item);
    }
    section.appendChild(toggle); section.appendChild(list);
    if(filter) section.classList.add('open');
    nav.appendChild(section);
  }
}

function setupSearch(){
  const input=document.getElementById('probSearch'); if(!input)return;
  let timer;
  input.addEventListener('input',()=>{ clearTimeout(timer); timer=setTimeout(()=>buildSidebar(input.value.trim()),200); });
}

// ── Slug helper (matches server-side titleToSlug) ──
function toSlug(title){ return title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

async function loadProblem(prob,cat){
  if(activeItem) activeItem.classList.remove('active');
  document.querySelectorAll('.prob-item').forEach(el=>{ if(parseInt(el.dataset.id)===prob.id){ el.classList.add('active'); activeItem=el; } });
  history.replaceState(null,'',`#${cat.slug}-${prob.id}`);
  const main=document.getElementById('mainContent');
  const slug=toSlug(prob.title);
  main.innerHTML=`
    <div class="prob-header fade-in">
      <div class="prob-meta">
        <span style="color:var(--txt2);font-size:.82rem;font-weight:600"># ${prob.id}</span>
        <span class="badge badge-${prob.difficulty}">${prob.difficulty}</span>
        <span class="tag-chip">${cat.icon} ${cat.name}</span>
        <a href="https://leetcode.com/problems/${slug}/" target="_blank" class="lc-ext-link">LC ↗</a>
      </div>
      <div class="prob-title">${prob.title}</div>
    </div>
    <div class="solutions-split fade-in">
      <div class="split-left">
        <div id="descPanel" class="desc-panel">
          <div class="desc-panel-header" onclick="toggleDesc()">
            <span class="desc-panel-label">📋 題目描述</span>
            <div id="descTags" style="display:flex;gap:6px;flex-wrap:wrap;flex:1;padding:0 10px"></div>
            <button class="desc-toggle-btn" id="descToggleBtn">收起 ▲</button>
          </div>
          <div class="desc-body" id="descBody">
            <div style="display:flex;justify-content:center;padding:32px"><div class="loader"></div></div>
          </div>
        </div>
      </div>
      <div class="split-right">
        ${prob.solutions.length>1?renderTabs(prob.solutions):''}
        <div id="codeArea"><div style="display:flex;justify-content:center;padding:60px"><div class="loader"></div></div></div>
      </div>
    </div>
  `;
  main.querySelectorAll('.sol-tab').forEach((tab,i)=>{
    tab.addEventListener('click',()=>{ main.querySelectorAll('.sol-tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active'); loadCode(prob.solutions[i].file); });
  });
  // Load code + description in parallel (description doesn't block code)
  loadCode(prob.solutions[0].file);
  loadDesc(prob.id, slug);
}

function toggleDesc(){
  const body=document.getElementById('descBody');
  const btn=document.getElementById('descToggleBtn');
  const open=body.style.display!=='none';
  body.style.display=open?'none':'';
  btn.textContent=open?'展開 ▼':'收起 ▲';
}

async function loadDesc(id, slug){
  const body=document.getElementById('descBody');
  const tagsEl=document.getElementById('descTags');
  if(!body||!tagsEl) return;
  try{
    const r=await fetch(`/api/problem/${id}`);
    if(!r.ok) throw new Error(`${r.status}`);
    const q=await r.json();
    // Tags
    if(q.topicTags?.length){
      tagsEl.innerHTML=q.topicTags.map(t=>`<span class="tag-chip">${t.name}</span>`).join('');
    }
    // Description
    if(q.content){
      // Sanitize LC HTML: strip scripts/styles, then inject
      const tmp=document.createElement('div');
      tmp.innerHTML=q.content;
      tmp.querySelectorAll('script,style').forEach(el=>el.remove());
      body.innerHTML=`<div class="lc-content">${tmp.innerHTML}</div>`;
    } else if(q.fileComment){
      body.innerHTML=`<pre class="file-comment">${esc(q.fileComment)}</pre>`;
    } else {
      body.innerHTML=`<div class="desc-empty">暫無描述。<a href="https://leetcode.com/problems/${slug}/" target="_blank" class="lc-ext-link">LeetCode ↗</a></div>`;
    }
  }catch(e){
    body.innerHTML=`<div class="desc-empty">載入失敗，請<a href="https://leetcode.com/problems/${slug}/" target="_blank" class="lc-ext-link">前往 LeetCode 查看 ↗</a></div>`;
  }
}

function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderTabs(sols){
  return `<div class="sol-tabs">${sols.map((s,i)=>`<button class="sol-tab${i===0?' active':''}">${s.label}</button>`).join('')}</div>`;
}

async function loadCode(filePath){
  const area=document.getElementById('codeArea'); if(!area)return;
  area.innerHTML=`<div style="display:flex;justify-content:center;padding:60px"><div class="loader"></div></div>`;
  try{
    const r=await fetch('/'+filePath);
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const code=await r.text();
    renderCode(code,filePath);
  }catch(e){ area.innerHTML=`<div class="card" style="padding:20px;color:var(--hard)">載入失敗: ${e.message}</div>`; }
}

function renderCode(code,filePath){
  const area=document.getElementById('codeArea'); if(!area)return;
  const fname=filePath.split('/').pop();
  const escaped=esc(code);
  area.innerHTML=`
    <div class="code-wrapper fade-in">
      <div class="code-header">
        <div class="code-dots"><div class="code-dot"></div><div class="code-dot"></div><div class="code-dot"></div></div>
        <span class="code-lang-label">Python 3 · ${fname}</span>
        <button class="copy-btn" onclick="copyCode(this)">複製</button>
      </div>
      <pre class="language-python"><code class="language-python">${escaped}</code></pre>
    </div>`;
  if(window.Prism) Prism.highlightAll();
}

function copyCode(btn){
  const code=btn.closest('.code-wrapper').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(()=>{ btn.textContent='✓ 已複製'; btn.classList.add('copied'); setTimeout(()=>{ btn.textContent='複製'; btn.classList.remove('copied'); },2000); });
}

init();
