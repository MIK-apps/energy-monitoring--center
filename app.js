const sources=[
 ["АЕЦ Козлодуй", "#1d7fd3"],["Кондензационни ТЕЦ","#e47a21"],["Топлофикационни ТЕЦ","#d95b32"],
 ["Заводски ТЕЦ","#a96b3f"],["ВЕЦ","#358bd1"],["Малки ВЕЦ","#4fa7e8"],["ВяЕЦ","#24c7bd"],
 ["ФЕЦ","#e7b21f"],["Био ЕЦ","#69a94b"],["ССЕЕ","#9b59b6"],["Помпи ПАВЕЦ","#8d989d"]
];
const srcBox=document.getElementById("sources");
const srcEls=[];
sources.forEach((s,i)=>{
 const row=document.createElement("div"); row.className="source-row";
 row.innerHTML=`<i class="source-accent" style="background:${s[1]}"></i><span class="source-name">${s[0]}</span><span class="source-value" id="src${i}">0 MW</span>`;
 srcBox.appendChild(row); srcEls.push(row.querySelector(".source-value"));
});
function makeTicks(id,count=11){
 const g=document.getElementById(id);
 for(let i=0;i<count;i++){
   const a=(-72+i*14.4)*Math.PI/180, cx=130,cy=145,r1=79,r2=89;
   const x1=cx+Math.cos(a)*r1,y1=cy+Math.sin(a)*r1,x2=cx+Math.cos(a)*r2,y2=cy+Math.sin(a)*r2;
   const l=document.createElementNS("http://www.w3.org/2000/svg","line");
   l.setAttribute("x1",x1);l.setAttribute("y1",y1);l.setAttribute("x2",x2);l.setAttribute("y2",y2);g.appendChild(l);
 }
}
makeTicks("ticksTotal");makeTicks("ticksNpp");
function setNeedle(id,value,max){
 const pct=Math.max(0,Math.min(1,value/max));
 const angle=-72+pct*144;
 document.getElementById(id).style.transform=`rotate(${angle+90}deg)`;
}
function update(){
 const vals=[rnd(950,1150),rnd(600,900),rnd(150,350),rnd(40,130),rnd(30,180),rnd(10,70),rnd(20,180),rnd(250,900),rnd(10,60),rnd(0,80),rnd(-250,250)];
 vals.forEach((v,i)=>srcEls[i].textContent=`${v.toLocaleString("bg-BG")} MW`);
 const b5=rnd(1000,1050),b6=rnd(980,1030),npp=b5+b6;
 const total=vals.slice(0,10).reduce((a,b)=>a+b,0);
 document.getElementById("b5").textContent=`${b5} MW`;
 document.getElementById("b6").textContent=`${b6} MW`;
 document.getElementById("nppTotal").textContent=`${npp} MW`;
 document.getElementById("nppMW").textContent=`${npp} MW`;
 document.getElementById("totalMW").textContent=`${total.toLocaleString("bg-BG")} MW`;
 setNeedle("needleTotal",total,10000);setNeedle("needleNpp",npp,2000);
}
function rnd(a,b){return Math.round(a+Math.random()*(b-a))}
function clock(){
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
update();clock();setInterval(update,1000);setInterval(clock,1000);
