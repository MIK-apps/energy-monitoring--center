const API="https://api.energy-charts.info/price?bzn=BG";
let pts=[];

const $=id=>document.getElementById(id);

function clock(){
  const d=new Date();
  if($("time"))
    $("time").textContent=d.toLocaleTimeString("bg-BG",{hour:"2-digit",minute:"2-digit"});
  if($("date"))
    $("date").textContent=d.toLocaleDateString("bg-BG");
}

function setSystem(status){
  if($("systemState")) $("systemState").textContent=status;

  if($("systemDot")){
    $("systemDot").classList.toggle("bad",status==="OFFLINE");
  }
}

function setIbex(status,message=""){
  if($("sourceStatus")){
    $("sourceStatus").textContent=
      message || (status==="ONLINE" ? "LIVE · Energy-Charts · BG" : "Data connection unavailable");
    
    const dot=$("sourceStatus").previousElementSibling;
    if(dot){
      dot.style.background=status==="ONLINE" ? "#2bd47f" : "#ff4d4d";
    }
  }
}

function tabs(){
  document.querySelectorAll(".tabs button").forEach(b=>{
    b.onclick=()=>{
      document.querySelectorAll(".tabs button")
        .forEach(x=>x.classList.remove("active"));

      document.querySelectorAll(".page")
        .forEach(x=>x.classList.remove("active"));

      b.classList.add("active");

      const page=$(b.dataset.page);
      if(page) page.classList.add("active");

      draw();
    };
  });
}

async function load(){
  // Самото приложение е ONLINE независимо от IBEX
  setSystem("ONLINE");

  setIbex("CONNECTING","CONNECTING · Energy-Charts");

  try{
    const r=await fetch(API,{cache:"no-store"});

    if(!r.ok)
      throw Error("HTTP "+r.status);

    const j=await r.json();

    if(!Array.isArray(j.unix_seconds) ||
       !Array.isArray(j.price)){
      throw Error("Invalid API response");
    }

    const day=new Date().toLocaleDateString(
      "en-CA",
      {timeZone:"Europe/Sofia"}
    );

    pts=j.unix_seconds
      .map((t,i)=>({
        ts:+t,
        price:+j.price[i]
      }))
      .filter(x=>
        Number.isFinite(x.price) &&
        new Date(x.ts*1000)
          .toLocaleDateString(
            "en-CA",
            {timeZone:"Europe/Sofia"}
          )===day
      );

    if(!pts.length)
      throw Error("No data for today");

    render();

    setIbex("ONLINE");

  }catch(e){

    console.error("IBEX:",e);

    setIbex(
      "OFFLINE",
      "OFFLINE · "+e.message
    );
  }
}

function getCurrentIndex(){

  if(!pts.length) return -1;

  const now=Date.now();

  let index=-1;

  for(let i=0;i<pts.length;i++){

    const start=pts[i].ts*1000;
    const end=start+15*60*1000;

    if(now>=start && now<end){
      index=i;
      break;
    }
  }

  return index;
}

function render(){

  if(!pts.length) return;

  const v=pts.map(x=>x.price);

  const mn=Math.min(...v);
  const mx=Math.max(...v);
  const av=v.reduce((a,b)=>a+b,0)/v.length;

  const idx=getCurrentIndex();
  const cur=idx>=0 ? pts[idx] : null;

  if($("cur"))
    $("cur").textContent=cur ? cur.price.toFixed(2) : "—";

  if($("min"))
    $("min").textContent=mn.toFixed(2);

  if($("avg"))
    $("avg").textContent=av.toFixed(2);

  if($("max"))
    $("max").textContent=mx.toFixed(2);

  if($("ovPrice"))
    $("ovPrice").textContent=cur ? cur.price.toFixed(2) : "—";

  if($("ovBig"))
    $("ovBig").innerHTML=
      (cur ? cur.price.toFixed(2) : "—")+
      ' <small>€/MWh</small>';

  const b=$("prices");

  if(b){

    b.innerHTML="";

    pts.forEach((p,i)=>{

      const d=new Date(p.ts*1000);

      const a=d.toLocaleTimeString(
        "bg-BG",
        {
          timeZone:"Europe/Sofia",
          hour:"2-digit",
          minute:"2-digit"
        }
      );

      const e=new Date(
        p.ts*1000+900000
      ).toLocaleTimeString(
        "bg-BG",
        {
          timeZone:"Europe/Sofia",
          hour:"2-digit",
          minute:"2-digit"
        }
      );

      const tr=document.createElement("tr");

      if(i===idx)
        tr.className="current";

      tr.innerHTML=
        `<td>${a}–${e}</td>`+
        `<td><b>${p.price.toFixed(2)}</b></td>`+
        `<td>${i===idx?'<span class="dot"></span>NOW':""}</td>`;

      b.appendChild(tr);

    });
  }

  draw();
}

function draw(){

  ["chart","miniChart"].forEach(id=>{

    const c=$(id);

    if(!c) return;

    const r=c.getBoundingClientRect();
    const d=window.devicePixelRatio||1;

    c.width=r.width*d;
    c.height=r.height*d;

    const x=c.getContext("2d");

    x.setTransform(1,0,0,1,0,0);
    x.scale(d,d);
    x.clearRect(0,0,r.width,r.height);

    if(!pts.length) return;

    const v=pts.map(q=>q.price);

    const lo=Math.min(...v);
    const hi=Math.max(...v);
    const range=hi-lo||1;

    const p={
      l:35,
      r:8,
      t:10,
      b:20
    };

    const w=r.width-p.l-p.r;
    const h=r.height-p.t-p.b;

    x.strokeStyle="#18354a";
    x.lineWidth=1;

    for(let i=0;i<5;i++){

      const y=p.t+h*i/4;

      x.beginPath();
      x.moveTo(p.l,y);
      x.lineTo(r.width-p.r,y);
      x.stroke();
    }

    x.beginPath();

    pts.forEach((q,i)=>{

      const xx=
        p.l+
        (pts.length>1
          ? w*i/(pts.length-1)
          : 0);

      const yy=
        p.t+
        h*(hi-q.price)/range;

      if(i)
        x.lineTo(xx,yy);
      else
        x.moveTo(xx,yy);
    });

    x.strokeStyle="#2aaaff";
    x.lineWidth=2;
    x.stroke();
  });
}

clock();
tabs();
load();

setInterval(clock,1000);

setInterval(
  load,
  15*60*1000
);

window.addEventListener(
  "resize",
  draw
);

if("serviceWorker" in navigator){

  navigator.serviceWorker.register(
    "service-worker.js"
  ).catch(e=>console.error(e));
}