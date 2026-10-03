const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SHIFTS=[{id:"day",name:"Day Shift",time:"07:00 – 19:00"},{id:"night",name:"Night Shift",time:"19:00 – 07:00"}];
const KEY="shiftPlannerSettings";
const daysList=document.getElementById("daysList"),rate=document.getElementById("hourlyRate");
const shiftCount=document.getElementById("shiftCount"),hoursEl=document.getElementById("totalHours"),gross=document.getElementById("grossPay");
const weekly=document.getElementById("weeklyPay"),fourWeek=document.getElementById("fourWeekPay"),monthly=document.getElementById("monthlyPay"),annual=document.getElementById("annualPay"),breakdown=document.getElementById("breakdown");

function money(n){return new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"}).format(n)}
function build(){
 daysList.innerHTML=DAYS.map((day,i)=>`<div class="day-row"><div class="day-name">${day}</div>${SHIFTS.map(s=>`<div class="shift-option"><input type="checkbox" id="${s.id}-${i}" data-day="${day}" data-shift="${s.id}"><label for="${s.id}-${i}"><span class="shift-title">${s.name}</span><span class="shift-time">${s.time}</span></label></div>`).join("")}</div>`).join("");
 daysList.querySelectorAll("input").forEach(x=>x.addEventListener("change",update));
}
function selected(){return [...daysList.querySelectorAll("input:checked")].map(x=>{const s=SHIFTS.find(y=>y.id===x.dataset.shift);return{day:x.dataset.day,...s,hours:12}})}
function save(){localStorage.setItem(KEY,JSON.stringify({shifts:selected().map(x=>({day:x.day,shift:x.id})),rate:rate.value}))}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(!s)return;daysList.querySelectorAll("input").forEach(x=>x.checked=Array.isArray(s.shifts)&&s.shifts.some(y=>y.day===x.dataset.day&&y.shift===x.dataset.shift));if(s.rate!==undefined)rate.value=s.rate}catch(e){}}
function update(){
 const list=selected(), count=list.length, hours=count*12, r=Math.max(0,Number(rate.value)||0), pay=hours*r;
 shiftCount.textContent=count;hoursEl.textContent=hours;gross.textContent=money(pay);weekly.textContent=money(pay);fourWeek.textContent=money(pay*4);monthly.textContent=money(pay*52/12);annual.textContent=money(pay*52);
 if(!list.length){breakdown.className="breakdown empty";breakdown.textContent="No shifts selected."}else{breakdown.className="breakdown";breakdown.innerHTML=list.map(x=>`<div class="breakdown-row"><span>${x.day}</span><span class="shift-badge">${x.name}</span><strong>${x.time} · 12 hours</strong></div>`).join("")}
 save();
}
build();load();rate.addEventListener("input",update);document.getElementById("resetBtn").addEventListener("click",()=>{daysList.querySelectorAll("input").forEach(x=>x.checked=false);rate.value=14;update()});update();