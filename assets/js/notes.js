/* notes.js — accordion sidebar + full-text search */
const NOTE_ICONS = {
  'patterns':'📐','data-structures':'🗂️','algorithms':'⚡','tips':'💡','problem-types':'📋'
};
function getIcon(slug){ return NOTE_ICONS[slug]||'📄'; }

let allCategories = [];
const contentCache = {};

async function init(){
  let data;
  try{ const r=await fetch('/api/index'); data=await r.json(); }
  catch(e){ document.getElementById('notesList').innerHTML=`<div style="padding:16px;color:var(--hard)">載入失敗</div>`; return; }

  allCategories = data.notes; // now array of {name,icon,slug,notes:[]}
  const total = allCategories.reduce((s,c)=>s+c.notes.length,0);
  document.getElementById('noteTotal').textContent = `${total} 篇`;

  buildSidebar(allCategories);
  setupSearch();

  // Load first note
  if(allCategories.length && allCategories[0].notes.length){
    loadNote(allCategories[0].notes[0], allCategories[0]);
    // Open first category
    const first=document.querySelector('.cat-section');
    if(first){ first.classList.add('open'); first.querySelector('.cat-toggle').classList.add('open'); }
  }
}

function buildSidebar(cats, highlight=''){
  const nav=document.getElementById('notesList');
  nav.innerHTML='';
  if(!cats.length){ nav.innerHTML=`<div style="padding:16px;color:var(--txt2);font-size:.82rem">無符合結果</div>`; return; }

  for(const cat of cats){
    if(!cat.notes.length) continue;
    const section=document.createElement('div'); section.className='cat-section'; section.dataset.slug=cat.slug;
    const toggle=document.createElement('button'); toggle.className='cat-toggle';
    toggle.innerHTML=`<span class="cat-icon">${cat.icon||getIcon(cat.slug)}</span><span>${cat.name}</span><span class="cat-count">${cat.notes.length}</span><span class="cat-chevron">▶</span>`;
    toggle.addEventListener('click',()=>{ section.classList.toggle('open'); toggle.classList.toggle('open'); });

    const list=document.createElement('div'); list.className='cat-problems';
    for(const note of cat.notes){
      const item=document.createElement('div'); item.className='prob-item'; item.dataset.file=note.file;
      const titleHtml=highlight ? highlightText(note.title, highlight) : note.title;
      item.innerHTML=`<span style="font-size:.9rem;flex-shrink:0">${getIcon(cat.slug)}</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${titleHtml}</span>`;
      item.addEventListener('click',()=>{
        loadNote(note,cat);
        if(window.innerWidth<=768){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('open'); }
      });
      list.appendChild(item);
    }
    section.appendChild(toggle); section.appendChild(list);
    nav.appendChild(section);
  }
}

function highlightText(text, query){
  const re = new RegExp(`(${escapeRe(query)})`, 'gi');
  return text.replace(re,'<mark style="background:rgba(99,179,237,.3);color:var(--accent);border-radius:2px">$1</mark>');
}
function escapeRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

// ── Search ──────────────────────────────────────────
let searchTimer;
function setupSearch(){
  const input=document.getElementById('noteSearch'); if(!input)return;
  input.addEventListener('input',()=>{
    clearTimeout(searchTimer);
    const q=input.value.trim();
    if(!q){ showSidebar(); return; }
    searchTimer=setTimeout(()=>doSearch(q),250);
  });
}

function showSidebar(){ buildSidebar(allCategories); }

async function doSearch(q){
  const ql=q.toLowerCase();
  const matchCats=[];

  for(const cat of allCategories){
    const matchNotes=[];
    for(const note of cat.notes){
      const titleMatch=note.title.toLowerCase().includes(ql);
      // Peek preview (from server)
      const previewMatch=note.preview && note.preview.toLowerCase().includes(ql);
      // Try cached content
      const content=contentCache[note.file]||'';
      const contentMatch=content.toLowerCase().includes(ql);

      if(titleMatch||previewMatch||contentMatch){
        matchNotes.push(note);
      }
    }
    if(matchNotes.length) matchCats.push({...cat, notes:matchNotes});
  }

  buildSidebar(matchCats, q);
  // Open all cats in search results
  document.querySelectorAll('.cat-section').forEach(s=>{ s.classList.add('open'); s.querySelector('.cat-toggle')?.classList.add('open'); });
}

// ── Load Note ────────────────────────────────────────
function markActive(file){
  document.querySelectorAll('.prob-item').forEach(el=>{ el.classList.toggle('active', el.dataset.file===file); });
}

async function loadNote(note, cat){
  // Switch views
  document.getElementById('notePlaceholder').style.display='none';
  document.getElementById('searchResults').style.display='none';
  const view=document.getElementById('noteView');
  view.style.display='flex'; view.style.flexDirection='column'; view.style.height='100%';

  // Banner
  document.getElementById('bannerIcon').textContent=cat.icon||getIcon(cat.slug);
  document.getElementById('bannerTitle').textContent=note.title;
  document.getElementById('bannerMeta').innerHTML=`<span class="note-meta-chip">${cat.name}</span><span class="note-meta-chip">${note.slug}</span>`;

  // Article loader
  const article=document.getElementById('noteArticle');
  article.innerHTML=`<div style="display:flex;justify-content:center;padding:60px"><div class="loader"></div></div>`;
  document.getElementById('noteToc').style.display='none';
  markActive(note.file);

  // Fetch
  let content=contentCache[note.file];
  if(!content){
    try{
      const r=await fetch('/'+note.file);
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      content=await r.text();
      contentCache[note.file]=content;
    }catch(e){ article.innerHTML=`<div style="color:var(--hard);padding:20px">載入失敗: ${e.message}</div>`; return; }
  }

  // Render
  if(window.marked){ marked.setOptions({gfm:true,breaks:true}); article.innerHTML=marked.parse(content); }
  else article.innerHTML=`<pre style="white-space:pre-wrap">${content.replace(/</g,'&lt;')}</pre>`;

  article.classList.add('fade-in');
  if(window.Prism) setTimeout(()=>Prism.highlightAll(),0);

  buildToc(article);
  document.querySelector('.note-body-row')?.scrollTo(0,0);
}

function buildToc(article){
  const toc=document.getElementById('noteToc');
  const tocList=document.getElementById('tocList');
  const headings=article.querySelectorAll('h2,h3');
  if(headings.length<2){ toc.style.display='none'; return; }
  toc.style.display='block';
  tocList.innerHTML='';
  headings.forEach((h,i)=>{
    h.id=`hn-${i}`;
    const li=document.createElement('li');
    li.className=`note-toc-item ${h.tagName==='H3'?'h3':''}`;
    li.textContent=h.textContent;
    li.addEventListener('click',()=>{ h.scrollIntoView({behavior:'smooth',block:'start'}); document.querySelectorAll('.note-toc-item').forEach(x=>x.classList.remove('active')); li.classList.add('active'); });
    tocList.appendChild(li);
  });
  // Scroll spy
  const bodyRow=document.querySelector('.note-body-row');
  if(bodyRow){
    const handler=()=>{
      const items=tocList.querySelectorAll('.note-toc-item');
      let active=0;
      headings.forEach((h,i)=>{ if(h.getBoundingClientRect().top<120) active=i; });
      items.forEach((li,i)=>li.classList.toggle('active',i===active));
    };
    bodyRow.removeEventListener('scroll',bodyRow._spy);
    bodyRow._spy=handler;
    bodyRow.addEventListener('scroll',handler,{passive:true});
  }
}

init();
