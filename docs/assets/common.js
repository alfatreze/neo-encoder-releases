const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const PAL=['--c1','--c2','--c3','--c4','--c5','--c6','--c7','--c8'];
const col=i=>`var(${PAL[i%PAL.length]})`;
const pct=(x,d=1)=>x==null||isNaN(x)?'–':(x*100).toFixed(d)+'%';
const num=(x,d=0)=>x==null||isNaN(x)?'–':Number(x).toLocaleString('en',{maximumFractionDigits:d,minimumFractionDigits:d});
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Plain-language names. Technical identifiers stay in small notes.
const QUALITY={'ssim>=0.995':{name:'Visually lossless',short:'Visually lossless',tech:'NEO SSIM ≥ 0.995',score:99.5},
  'ssim>=0.98':{name:'High quality',short:'High quality',tech:'NEO SSIM ≥ 0.98',score:98},
  'ssim>=0.95':{name:'Good for web',short:'Good for web',tech:'NEO SSIM ≥ 0.95',score:95}};
const QLABEL=Object.fromEntries(Object.entries(QUALITY).map(([k,v])=>[k,v.name]));
const ELABEL={fast:'Fast',balanced:'Balanced',max:'Thorough'};
const EHINT={fast:'quick settings: up to about 3× the time of the fastest',balanced:'a sensible middle: up to about 15× the fastest',max:'no time limit: tries everything'};
const STAGE={pngquant:'Palette reduction',oxipng:'OxiPNG repack',zopfli:'Zopfli squeeze',mozjpeg:'MozJPEG','jpeg-lossless':'Lossless JPEG repack'};
const chainName=c=>String(c).split('+').map(s=>STAGE[s]||s).join(' → ');
const cache={};
async function data(n){return cache[n]??=await fetch('data/'+n+'.json').then(r=>{if(!r.ok)throw new Error(n);return r.json()}).catch(()=>null)}
function chrome(page){
  const pages=[['index.html','Overview'],['rankings.html','Rankings'],['explore.html','Explore'],['methodology.html','Methodology']];
  document.body.insertAdjacentHTML('afterbegin',`<header class="top"><div class="wrap"><a class="brand" href="index.html"><b>N</b>NEO Compressor <span class="muted" style="font-weight:500">Results</span></a><nav>${pages.map(([h,t])=>`<a href="${h}"${h===page?' aria-current="page"':''}>${t}</a>`).join('')}</nav></div></header><div id="banner"></div>`);
  document.body.insertAdjacentHTML('beforeend','<div id="tip"></div>');
  data('meta').then(m=>{if(!m)return;
    if(m.status!=='complete')$('#banner').innerHTML=`<div class="banner"><div class="wrap"><b>Work in progress.</b> ${num(m.rows)} of ${num(m.total)} test runs are finished, so numbers may still move. Updated ${esc(m.generated.slice(0,10))}.</div></div>`;
    const f=$('#foot');if(f)f.innerHTML=`Results run <code>${esc(m.run)}</code> · ${esc(m.generated.replace('T',' ').slice(0,16))} UTC · ${m.status==='complete'?'complete':'partial'}`;});
}
function tip(el,html){const t=$('#tip');
  el.addEventListener('mousemove',e=>{t.innerHTML=html;t.style.display='block';t.style.left=Math.min(e.clientX+12,innerWidth-330)+'px';t.style.top=(e.clientY+12)+'px'});
  el.addEventListener('mouseleave',()=>t.style.display='none')}
function bars(host,rows,{max=1,fmt=pct,label=150,h=16}={}){
  host.innerHTML=rows.map(r=>`<div style="display:grid;grid-template-columns:${label}px 1fr 58px;gap:10px;align-items:center;margin:7px 0;font-size:14px"><span>${esc(r.label)}${r.sub?`<div class="note">${esc(r.sub)}</div>`:''}</span><span style="background:color-mix(in srgb,var(--ink) 7%,transparent);border-radius:99px;height:${h}px;display:block;overflow:hidden"><span style="display:block;height:${h}px;border-radius:99px;width:${Math.max(1,Math.min(100,r.v/max*100))}%;background:${r.color||'linear-gradient(90deg,var(--accent),var(--accent2))'}"></span></span><b style="text-align:right">${fmt(r.v)}</b></div>`).join('')}
function scatter(host,pts,{xl,yl,xmin,xmax,ymin,ymax,onhover,xd=0,yd=0}){
  const W=760,H=380,m={l:54,r:14,t:10,b:44},iw=W-m.l-m.r,ih=H-m.t-m.b;
  const X=v=>m.l+(v-xmin)/(xmax-xmin)*iw,Y=v=>m.t+(1-(v-ymin)/(ymax-ymin))*ih;
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(yl)} versus ${esc(xl)}">`;
  for(let i=0;i<=5;i++){const xv=xmin+(xmax-xmin)*i/5,yv=ymin+(ymax-ymin)*i/5;
    s+=`<line class="grid" x1="${X(xv)}" x2="${X(xv)}" y1="${m.t}" y2="${m.t+ih}"/><text x="${X(xv)}" y="${H-26}" text-anchor="middle">${xv.toFixed(xd)}</text>`;
    s+=`<line class="grid" y1="${Y(yv)}" y2="${Y(yv)}" x1="${m.l}" x2="${m.l+iw}"/><text x="${m.l-6}" y="${Y(yv)+4}" text-anchor="end">${yv.toFixed(yd)}</text>`}
  s+=`<text x="${m.l+iw/2}" y="${H-6}" text-anchor="middle">${esc(xl)}</text><text transform="translate(12 ${m.t+ih/2}) rotate(-90)" text-anchor="middle">${esc(yl)}</text>`;
  const fr=pts.filter(p=>p.f).sort((a,b)=>a.x-b.x);
  s+=`<polyline fill="none" stroke="var(--ink)" stroke-width="1.3" stroke-dasharray="4 3" points="${fr.map(p=>X(p.x)+','+Y(p.y)).join(' ')}"/>`;
  pts.forEach((p,i)=>{if(p.x<xmin||p.x>xmax||p.y<ymin||p.y>ymax)return;
    s+=`<circle data-i="${i}" cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.f?5:2.8}" fill="${p.c}" fill-opacity="${p.f?1:.42}" ${p.f?'stroke="var(--panel)" stroke-width="1.5"':''}/>`});
  host.innerHTML=s+'</svg>';
  $$('circle',host).forEach(c=>tip(c,onhover(pts[+c.dataset.i])));
}
