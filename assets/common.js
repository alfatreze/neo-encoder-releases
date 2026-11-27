const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const PAL=['--c1','--c2','--c3','--c4','--c5','--c6','--c7','--c8'];
const col=i=>`var(${PAL[i%PAL.length]})`;
const pct=(x,d=1)=>x==null||isNaN(x)?'–':(x*100).toFixed(d)+'%';
const num=(x,d=0)=>x==null||isNaN(x)?'–':Number(x).toLocaleString('en',{maximumFractionDigits:d,minimumFractionDigits:d});
const kb=n=>n==null||isNaN(n)?'–':n>=1048576?(n/1048576).toFixed(2)+' MB':(n/1024).toFixed(n>=102400?0:1)+' KB';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const s2Label=s=>s==null||isNaN(s)?'':s>=99.9?'pixel-identical':s>=90?'visually lossless':s>=80?'high quality':s>=70?'good for web':s>=50?'extreme web':'below extreme bar';
const NORTH_LABELS={app:'ImageOptim', 'neo-lossy':'NEO (matching)', 'neo-lossless':'NEO (lossless)', 'neo-smart-same':'NEO Smart (same format)', 'neo-smart-auto':'NEO Smart (best format)'};

// Primary SSIMULACRA2 v2.1 quality targets (including Strict Lossless and Extreme S2 >= 50).
const QUALITY={
  's2=100':{name:'Strict lossless',short:'Lossless',tech:'Pixel-identical (S2 = 100)',score:100},
  's2>=90':{name:'Visually lossless',short:'Visually lossless',tech:'SSIMULACRA2 ≥ 90',score:90},
  's2>=80':{name:'High quality',short:'High quality',tech:'SSIMULACRA2 ≥ 80',score:80},
  's2>=70':{name:'Good for web',short:'Good for web',tech:'SSIMULACRA2 ≥ 70',score:70},
  's2>=50':{name:'Extreme (S2 ≥ 50)',short:'Extreme',tech:'SSIMULACRA2 ≥ 50',score:50}
};
const QLABEL=Object.fromEntries(Object.entries(QUALITY).map(([k,v])=>[k,v.name]));
const WEB_FORMATS=['png','jpeg','webp','avif'];
const ALL_FORMATS=['png','jpeg','webp','avif','jxl'];
const FMT_LABEL={png:'PNG',jpeg:'JPEG',webp:'WebP',avif:'AVIF',jxl:'JPEG XL (JXL)'};
const ELABEL={fast:'Fast',balanced:'Balanced',max:'Thorough'};
const EHINT={fast:'quick search budget',balanced:'default production budget',max:'full search + ECT/Zopfli squeeze'};
const fmtSec=x=>x==null||isNaN(x)?'–':x<1?Math.round(x*1000)+' ms':x<10?x.toFixed(1)+' s':Math.round(x)+' s';
const effortSub=r=>{const t=r?.time;return t&&t.sec_per_mp_median!=null?`typically ${fmtSec(t.sec_per_mp_median)}/MP, p90 ${fmtSec(t.sec_per_mp_p90)}/MP`:EHINT[r?.effort]||''};
const relSec=(rel,fastest)=>rel==null||fastest==null?'–':'≈ '+fmtSec(rel*fastest)+'/MP';
const STAGE={
  pngquant:'Palette (pngquant)',
  quantette:'Oklab palette (quantette)',
  posterize:'RGBA posterize',
  denoise:'Edge-preserving denoise',
  oxipng:'OxiPNG repack',
  ect:'ECT -9 squeeze',
  zopfli:'Zopfli squeeze',
  cjpegli:'cjpegli (XYB/4:2:0)',
  mozjpeg:'MozJPEG',
  'jpeg-lossless':'Lossless JPEG repack',
  webp:'WebP (libwebp)',
  avif:'AVIF (libaom)',
  jxl:'JPEG XL (libjxl)'
};
const chainName=c=>String(c).split('+').map(s=>STAGE[s]||s).join(' → ');
const cache={};
async function data(n){return cache[n]??=await fetch('data/'+n+'.json').then(r=>{if(!r.ok)throw new Error(n);return r.json()}).catch(()=>null)}
function chrome(page){
  const pages=[['index.html','Overview'],['rankings.html','Formats & Rankings'],['explore.html','Explore'],['gated.html','Complex Networks'],['methodology.html','Methodology']];
  document.body.insertAdjacentHTML('afterbegin',`<header class="top"><div class="wrap"><a class="brand" href="index.html"><b>N</b>NEO Compressor <span class="muted" style="font-weight:500">SSIMULACRA2 Research</span></a><nav>${pages.map(([h,t])=>`<a href="${h}"${h===page?' aria-current="page"':''}>${t}</a>`).join('')}</nav></div></header><div id="banner"></div>`);
  document.body.insertAdjacentHTML('beforeend','<div id="tip"></div>');
  data('meta').then(m=>{if(!m)return;
    if(m.status!=='complete')$('#banner').innerHTML=`<div class="banner"><div class="wrap"><b>Work in progress.</b> ${num(m.evaluated??m.rows)} images evaluated so far. Updated ${esc(m.generated.slice(0,10))}.</div></div>`;
    const f=$('#foot');if(f)f.innerHTML=`Dataset <code>${esc(m.run)}</code> (Data v${m.dataVersion||7}) · ${num(m.evaluated||0)} images across ${m.categories||12} categories · Alpha-aware SSIMULACRA2 v2.1 · ${esc(m.generated.replace('T',' ').slice(0,16))} UTC`;});
}
function tip(el,html){const t=$('#tip');
  el.addEventListener('mousemove',e=>{t.innerHTML=html;t.style.display='block';t.style.left=Math.min(e.clientX+12,innerWidth-330)+'px';t.style.top=(e.clientY+12)+'px'});
  el.addEventListener('mouseleave',()=>t.style.display='none')}
function bars(host,rows,{max=1,fmt=pct,label=150,h=16}={}){
  host.innerHTML=rows.map(r=>`<div style="display:grid;grid-template-columns:${label}px 1fr 64px;gap:10px;align-items:center;margin:7px 0;font-size:14px"><span>${esc(r.label)}${r.sub?`<div class="note">${esc(r.sub)}</div>`:''}</span><span style="background:color-mix(in srgb,var(--ink) 7%,transparent);border-radius:99px;height:${h}px;display:block;overflow:hidden"><span style="display:block;height:${h}px;border-radius:99px;width:${Math.max(1,Math.min(100,r.v/max*100))}%;background:${r.color||'linear-gradient(90deg,var(--accent),var(--accent2))'}"></span></span><b style="text-align:right">${fmt(r.v)}</b></div>`).join('')}
function scatter(host,pts,{xl,yl,xmin,xmax,ymin,ymax,onhover,xd=0,yd=0}){
  const W=760,H=380,m={l:54,r:14,t:10,b:44},iw=W-m.l-m.r,ih=H-m.t-m.b;
  const X=v=>m.l+(v-xmin)/(xmax-xmin)*iw,Y=v=>m.t+(1-(v-ymin)/(ymax-ymin))*ih;
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(yl)} versus ${esc(xl)}">`;
  for(let i=0;i<=5;i++){const xv=xmin+(xmax-xmin)*i/5,yv=ymin+(ymax-ymin)*i/5;
    s+=`<line class="grid" x1="${X(xv)}" x2="${X(xv)}" y1="${m.t}" y2="${m.t+ih}"/><text x="${X(xv)}" y="${H-26}" text-anchor="middle">${xv.toFixed(xd)}</text>`;
    s+=`<line class="grid" y1="${Y(yv)}" y2="${Y(yv)}" x1="${m.l}" x2="${m.l+iw}"/><text x="${m.l-6}" y="${Y(yv)+4}" text-anchor="end">${yv.toFixed(yd)}</text>`}
  s+=`<text x="${m.l+iw/2}" y="${H-6}" text-anchor="middle">${esc(xl)}</text><text transform="translate(12 ${m.t+ih/2}) rotate(-90)" text-anchor="middle">${esc(yl)}</text>`;
  const fr=pts.filter(p=>p.f).sort((a,b)=>a.x-b.x);
  if(fr.length>1)s+=`<polyline fill="none" stroke="var(--ink)" stroke-width="1.3" stroke-dasharray="4 3" points="${fr.map(p=>X(p.x)+','+Y(p.y)).join(' ')}"/>`;
  pts.forEach((p,i)=>{if(p.x<xmin||p.x>xmax||p.y<ymin||p.y>ymax)return;
    s+=`<circle data-i="${i}" cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.f?5.2:3.2}" fill="${p.c}" fill-opacity="${p.f?1:.62}" ${p.f?'stroke="var(--panel)" stroke-width="1.5"':''}/>`});
  host.innerHTML=s+'</svg>';
  $$('circle',host).forEach(c=>tip(c,onhover(pts[+c.dataset.i])));
}
