const sources=[
 ["АЕЦ Козлодуй",5,"#1d7fd3"],
 ["Кондензационни ТЕЦ",6,"#e47a21"],
 ["Топлофикационни ТЕЦ",9,"#d95b32"],
 ["Заводски ТЕЦ",11,"#a96b3f"],
 ["ВЕЦ",7,"#358bd1"],
 ["Малки ВЕЦ",10,"#4fa7e8"],
 ["ВяЕЦ",13,"#24c7bd"],
 ["ФЕЦ",8,"#e7b21f"],
 ["Био ЕЦ",12,"#69a94b"],
 ["ССЕЕ","ssee","#9b59b6"],
 ["Помпи ПАВЕЦ","pumps","#8d989d"]
];
const body=document.getElementById("sourcesBody");
sources.forEach((s,i)=>{const r=document.createElement("div");r.className="source-row";r.innerHTML=`<i class="source-accent" style="background:${s[2]}"></i><span class="source-name">${s[0]}</span><span class="source-value" id="src${i}">— MW</span>`;body.appendChild(r)});

function rnd(min,max){return Math.round(min+Math.random()*(max-min))}
function updateDemo(){
  const vals=[rnd(950,1150),rnd(600,900),rnd(150,350),rnd(40,130),rnd(30,180),rnd(10,70),rnd(20,180),rnd(250,900),rnd(10,60),rnd(0,80),rnd(-250,250)];
  vals.forEach((v,i)=>document.getElementById("src"+i).textContent=`${v} MW`);
  const b5=rnd(1000,1050),b6=rnd(980,1030);
  document.getElementById("b5").textContent=`${b5} MW`;
  document.getElementById("b6").textContent=`${b6} MW`;
  document.getElementById("total").textContent=`${b5+b6} MW`;
  document.getElementById("nppUpdate").textContent="LIVE DEMO • "+new Date().toLocaleTimeString("bg-BG");
  drawFlows();
}
function drawFlows(){
 const m=document.getElementById("flowMap");m.innerHTML="";
 const nodes=[["РОМЪНИЯ","export",8,14],["СЪРБИЯ","export",8,43],["БЪЛГАРИЯ","main",45,43],["СЕВЕРНА МАКЕДОНИЯ","import",68,14],["ГЪРЦИЯ","import",68,67],["ТУРЦИЯ","export",8,72]];
 nodes.forEach(n=>{const d=document.createElement("div");d.className="flow-node";d.style.left=n[2]+"%";d.style.top=n[3]+"%";d.innerHTML=`<b>${n[0]}</b><strong>${rnd(-500,700)} MW</strong>`;m.appendChild(d)});
}
function tickClock(){
 const d=new Date();
 document.getElementById("clock").textContent=d.toLocaleTimeString("bg-BG",{hour12:false,timeZone:"Europe/Sofia"});
 document.getElementById("date").textContent=d.toLocaleDateString("bg-BG",{timeZone:"Europe/Sofia"});
}
let lang="BG";
document.getElementById("langBtn").onclick=()=>{
 lang=lang==="BG"?"EN":"BG";
 document.getElementById("langBtn").textContent=lang==="BG"?"EN":"BG";
 document.querySelectorAll("[data-bg]").forEach(e=>e.textContent=e.dataset[lang.toLowerCase()]);
};
tickClock();updateDemo();setInterval(tickClock,1000);setInterval(updateDemo,1000);
