/* main.js */
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let statsData=null;

async function init(){
  let data;
  try{ const r=await fetch('data/index.json'); data=await r.json(); }
  catch(e){ console.error(e); return; }
  const {stats,categories}=data;
  statsData=stats;
  animateNum('statTotal',stats.total);
  animateNum('statEasy',stats.easy);
  animateNum('statMedium',stats.medium);
  animateNum('statHard',stats.hard);
  renderHeatmap(stats.daily||{});
  renderDiffChart(stats);
  renderCatChart(stats.by_category||{});
  renderRecent(categories);
}

function animateNum(id,target){
  const el=document.getElementById(id);
  if(!el||target===undefined)return;
  let cur=0; const step=Math.ceil(target/30);
  const t=setInterval(()=>{ cur=Math.min(cur+step,target); el.textContent=cur; if(cur>=target)clearInterval(t); },30);
}

function fmtDate(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function renderHeatmap(daily){
  const grid=document.getElementById('heatmapGrid');
  const monthsEl=document.getElementById('heatmapMonths');
  if(!grid)return;
  const today=new Date(); today.setHours(0,0,0,0);
  const start=new Date(today); start.setDate(today.getDate()-364); start.setDate(start.getDate()-start.getDay());
  const cells=[]; const cur=new Date(start);
  const monthPos=[];
  while(cur<=today){
    const week=[];
    for(let d=0;d<7;d++){
      if(cur>today){week.push(null);cur.setDate(cur.getDate()+1);continue;}
      if(d===0) monthPos.push({month:cur.getMonth(),col:cells.length});
      week.push({date:fmtDate(cur),count:daily[fmtDate(cur)]||0});
      cur.setDate(cur.getDate()+1);
    }
    cells.push(week);
  }
  if(monthsEl){
    const numWeeks = cells.length;
    monthsEl.style.gridTemplateColumns=`repeat(${numWeeks},1fr)`;
    const seen=new Set();
    monthsEl.innerHTML=monthPos.filter(m=>{if(seen.has(m.month))return false;seen.add(m.month);return true;})
      .map(m=>`<span style="grid-column:${m.col+1}">${MONTHS[m.month]}</span>`).join('');
  }

  // Dynamic cell size: fill the heatmap-wrap width
  const wrap = document.querySelector('.heatmap-wrap');
  const dayLabels = document.querySelector('.heatmap-days');
  const numWeeks = cells.length;
  let cellSize = 11;
  const gapSize = window.innerWidth <= 768 ? 2 : 3;
  if(wrap && dayLabels){
    const avail = wrap.clientWidth - dayLabels.offsetWidth - 12; // 12 = gap
    cellSize = Math.max(10, Math.floor((avail - (numWeeks-1)*gapSize) / numWeeks));
  }
  grid.style.gridTemplateRows=`repeat(7,${cellSize}px)`;
  grid.style.gridAutoColumns=`${cellSize}px`;
  grid.style.gap=`${gapSize}px`;
  if(dayLabels){
    dayLabels.style.gridTemplateRows=`repeat(7,${cellSize}px)`;
    dayLabels.style.gap=`${gapSize}px`;
  }

  // Week-major order: for each week, emit 7 day cells
  // grid-auto-flow:column fills column-by-column → each group of 7 = one week column ✓
  let html='';
  for(let w=0;w<cells.length;w++) for(let d=0;d<7;d++){
    const c=cells[w]?.[d];
    if(!c){html+=`<div class="heat-cell" style="background:transparent"></div>`;continue;}
    const lv=c.count===0?'lv0':c.count===1?'lv1':c.count===2?'lv2':c.count===3?'lv3':'lv4';
    html+=`<div class="heat-cell ${lv}" title="${c.date}: ${c.count} 題"></div>`;
  }
  grid.innerHTML=html;

  // Auto-scroll to far-right on mobile so latest activity is immediately visible
  setTimeout(() => {
    const scrollContainer = document.getElementById('heatmapScrollWrap');
    if (scrollContainer) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth;
    }
  }, 50);
}

function renderDiffChart(stats){
  const ctx=document.getElementById('diffChart'); if(!ctx)return;
  new Chart(ctx,{type:'doughnut',data:{
    labels:['Easy','Medium','Hard'],
    datasets:[{data:[stats.easy,stats.medium,stats.hard],
      backgroundColor:['rgba(72,187,120,.8)','rgba(246,173,85,.8)','rgba(252,129,129,.8)'],
      borderColor:['#48bb78','#f6ad55','#fc8181'],borderWidth:2,hoverOffset:10}]
  },options:{
    responsive:true,maintainAspectRatio:false,cutout:'68%',
    plugins:{
      legend:{position:'bottom',labels:{color:'#7a8ba8',font:{size:11},padding:14,usePointStyle:true}},
      tooltip:{callbacks:{label:c=>` ${c.label}: ${c.raw} 題`}}
    }
  }});
}

function renderCatChart(byCat){
  const ctx=document.getElementById('catChart'); if(!ctx)return;
  const labels=Object.keys(byCat); const values=Object.values(byCat);
  new Chart(ctx,{type:'bar',data:{
    labels,datasets:[{data:values,
      backgroundColor:'rgba(99,179,237,.25)',borderColor:'#63b3ed',
      borderWidth:2,borderRadius:6,hoverBackgroundColor:'rgba(99,179,237,.45)'}]
  },options:{
    responsive:true,maintainAspectRatio:false,indexAxis:'y',
    plugins:{legend:{display:false}},
    scales:{
      x:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#7a8ba8',stepSize:1},beginAtZero:true},
      y:{grid:{display:false},ticks:{color:'#7a8ba8',font:{size:11}}}
    }
  }});
}

function renderRecent(categories){
  const el=document.getElementById('recentList'); if(!el)return;
  const all=[];
  for(const cat of categories) for(const p of cat.problems) all.push({...p,category:cat.name,slug:cat.slug});
  all.sort((a,b)=>b.id-a.id);
  el.innerHTML=all.slice(0,10).map(p=>`
    <a class="recent-item" href="solutions.html#${p.slug}-${p.id}">
      <span class="badge badge-${p.difficulty}">${p.difficulty}</span>
      <span style="color:var(--txt2);font-size:.78rem;min-width:36px">#${p.id}</span>
      <span class="recent-title">${p.title}</span>
      <span class="recent-cat">${p.category}</span>
    </a>`).join('');
}

init();

let resizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{
    if(statsData&&statsData.daily) renderHeatmap(statsData.daily);
  },150);
});
