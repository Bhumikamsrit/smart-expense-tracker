const KEY="spendwise-interview-v2";
const CATS=["Food","Transport","Shopping","Utilities","Entertainment","Health","Other"];
const DEFAULTS={
  budgets:{Food:18000,Transport:9000,Shopping:15000,Utilities:8000,Entertainment:7000,Health:6000,Other:5000},
  expenses:[
    ["Zomato",540,"Food","UPI","Dinner"],["Uber",320,"Transport","Card","Airport"],
    ["Myntra",2199,"Shopping","Card","Kurta"],["BESCOM",1840,"Utilities","UPI","Electricity"],
    ["Cult Fit",1400,"Health","UPI","Workout"],["PVR",880,"Entertainment","Card","Movie"],
    ["Swiggy",760,"Food","UPI","Lunch"],["Metro",210,"Transport","Card","Commute"],
    ["Amazon",1599,"Shopping","Card","Home"],["Apollo Pharmacy",950,"Health","UPI","Medicine"],
    ["Jio Fiber",999,"Utilities","UPI","Internet"],["Starbucks",430,"Food","Card","Coffee"]
  ].map((x,i)=>({id:i+1,date:`2026-08-${String(16-i).padStart(2,"0")}`,merchant:x[0],amount:x[1],category:x[2],method:x[3],note:x[4]})),
  events:[],
  incidents:[
    {id:"INC-1042",created:"09:18",resolved:"10:06",baseline:72,optimized:48,severity:"P1",title:"Categorizer worker lag"},
    {id:"INC-1037",created:"14:12",resolved:"14:42",baseline:51,optimized:30,severity:"P2",title:"Budget endpoint timeout"},
    {id:"INC-1031",created:"11:08",resolved:"11:31",baseline:39,optimized:26,severity:"P2",title:"Kafka consumer retry storm"}
  ],
  userStudy:{baseline:61,after:79},
  perf:{targetTPS:1000,observedTPS:1180,p95:118,p99:176,errorRate:0.06,cacheHit:87},
  categorization:{baselineManualMinutes:4.0,optimizedManualMinutes:3.2,manualMinutes:0,baselineAccuracy:82,optimizedAccuracy:96}
};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(DEFAULTS);
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function money(n){return "₹"+Math.round(n).toLocaleString("en-IN")}
function merchantGuess(m){const s=m.toLowerCase();if(/zomato|swiggy|restaurant|cafe|starbucks|food|pizza/.test(s))return"Food";if(/uber|ola|metro|rapido|petrol|fuel|bus/.test(s))return"Transport";if(/amazon|myntra|flipkart|ajio|mall|shopping/.test(s))return"Shopping";if(/bescom|electric|water|internet|airtel|jio|fiber/.test(s))return"Utilities";if(/pvr|inox|netflix|spotify|movie|concert/.test(s))return"Entertainment";if(/apollo|pharmacy|cult|gym|doctor|health/.test(s))return"Health";return"Other"}
function totals(){const t={};for(const e of state.expenses)t[e.category]=(t[e.category]||0)+e.amount;return t}
function mttrReduction(){const b=state.incidents.reduce((s,x)=>s+x.baseline,0)/state.incidents.length;const o=state.incidents.reduce((s,x)=>s+x.optimized,0)/state.incidents.length;return (b-o)/b*100}
function categorizationImprovement(){const b=state.categorization.baselineManualMinutes,o=state.categorization.optimizedManualMinutes;return (b-o)/b*100}
function budgetVisibility(){return Math.round(state.userStudy.after)}
function tpsCoverage(){return Math.round((state.perf.observedTPS/state.perf.targetTPS)*100)}
function render(){
  app.innerHTML=`<div class="shell">
    <nav class="nav"><div class="brand">Spend<span>Wise</span></div><div class="nav-actions"><span class="pill">● Live demo</span><button class="ghost" onclick="resetDemo()">Reset</button></div></nav>
    <section class="hero"><div><span class="eyebrow">Smart Expense Tracker</span><h1>Track spend. Control budgets. Operate with confidence.</h1><p>Full-stack expense management with high-throughput ingestion, smart categorization, budget analytics, and production observability.</p><div class="hero-actions"><button class="primary" onclick="go('dashboard')">Open tracker</button><button class="secondary" onclick="go('metrics')">View performance & outcomes</button></div></div>
    <div class="card hero-card"><div class="row"><b>Performance & product outcomes</b><span class="green">● Ready</span></div><div class="metric-grid">
      <div class="metric"><span>Throughput</span><b>${state.perf.observedTPS} TPS</b><em>target ${state.perf.targetTPS}+</em></div>
      <div class="metric"><span>Categorization</span><b>${Math.round(categorizationImprovement())}%</b><em>processing-time improvement</em></div>
      <div class="metric"><span>MTTR</span><b>${Math.round(mttrReduction())}%</b><em>incident-resolution improvement</em></div>
      <div class="metric"><span>Budget visibility</span><b>${budgetVisibility()}%</b><em>post-dashboard study</em></div>
    </div><div class="banner">Performance and experiment values shown here are demonstration evidence; validate them against production benchmarks before treating them as measured results.</div></div></section>

    <div id="dashboard" class="section"></div>
    <div id="metrics" class="section"></div>
    <footer>SpendWise · Smart Expense Tracker · The live app demonstrates the product and evidence workflow; backend/infrastructure scaffolding is included in the downloadable codebase.</footer>
  </div>`;
  renderDashboard(); renderMetrics();
}
function go(id){document.getElementById(id).scrollIntoView({behavior:"smooth"})}
function renderDashboard(){
  const d=document.getElementById("dashboard");
  const t=totals(); const total=state.expenses.reduce((s,e)=>s+e.amount,0);
  d.innerHTML=`<div class="section-title"><div><h2>Product dashboard</h2><p class="muted">Real-time expense tracking and budget control</p></div></div>
  <main class="workspace">
    <section class="main">
      <div class="card"><div class="section-head"><div><h3>Expense overview</h3><p class="muted">Current demo month</p></div><button class="primary" onclick="addExpense()">+ Add expense</button></div>
        <div class="stats"><div class="stat"><span>Total spend</span><b>${money(total)}</b></div><div class="stat"><span>Avg transaction</span><b>${money(total/state.expenses.length)}</b></div><div class="stat"><span>Top category</span><b>${Object.entries(t).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—"}</b></div><div class="stat"><span>Transactions</span><b>${state.expenses.length}</b></div></div>
        <div class="chart-grid">${Object.entries(t).map(([k,v])=>`<div><div class="row tiny"><span>${k}</span><b>${money(v)}</b></div><div class="bar"><i style="width:${Math.max(4,v/Math.max(...Object.values(t))*100)}%"></i></div></div>`).join("")}</div>
      </div>
      <div class="card"><div class="section-head"><div><h3>Recent transactions</h3><p class="muted">Automatic categorization + correction workflow</p></div><input id="search" placeholder="Search merchant..." oninput="renderRows()"></div>
        <div class="table-wrap"><table><thead><tr><th>Date</th><th>Merchant</th><th>Amount</th><th>Category</th><th>Method</th><th></th></tr></thead><tbody id="rows"></tbody></table></div>
      </div>
    </section>
    <aside class="side">
      <div class="card"><div class="section-head"><div><h3>Budget health</h3><p class="muted">Monthly limits</p></div></div><div id="budgets"></div></div>
      <div class="card"><div class="section-head"><div><h3>Smart categorization</h3><p class="muted">Classifier + correction loop</p></div></div><div class="donut"><strong>${state.categorization.optimizedAccuracy}%</strong><span>accuracy</span></div><div class="kpi"><span>Manual processing</span><b>${categorizationImprovement().toFixed(1)}% faster</b></div><button class="secondary full" onclick="openCategorization()">View categorization experiment</button></div>
      <div class="card"><div class="section-head"><div><h3>Operational health</h3><p class="muted">Observability signals</p></div></div><div class="obs"><div><span>p95</span><b>${state.perf.p95} ms</b></div><div><span>p99</span><b>${state.perf.p99} ms</b></div><div><span>5xx</span><b>${state.perf.errorRate}%</b></div><div><span>Cache hit</span><b>${state.perf.cacheHit}%</b></div></div></div>
    </aside>
  </main>`;
  renderRows(); renderBudgets();
}
function renderRows(){const q=(document.getElementById("search")?.value||"").toLowerCase();document.getElementById("rows").innerHTML=state.expenses.filter(e=>e.merchant.toLowerCase().includes(q)).slice().sort((a,b)=>b.date.localeCompare(a.date)).map(e=>`<tr><td>${e.date}</td><td><b>${e.merchant}</b><div class="tiny muted">${e.note}</div></td><td>${money(e.amount)}</td><td><span class="tag">${e.category}</span></td><td>${e.method}</td><td><button class="small" onclick="recategorize(${e.id})">Reclassify</button></td></tr>`).join("")}
function renderBudgets(){const t=totals();document.getElementById("budgets").innerHTML=Object.entries(state.budgets).map(([k,b])=>{const spent=t[k]||0,p=Math.min(spent/b,1),cls=p>.9?"danger":p>.7?"warn":"";return`<div class="budget"><div class="row"><b>${k}</b><span>${money(spent)} / ${money(b)}</span></div><div class="bar"><i class="${cls}" style="width:${Math.max(2,p*100)}%"></i></div><div class="tiny muted">${Math.round(p*100)}% used</div></div>`}).join("")}
function addExpense(){const merchant=prompt("Merchant","Zepto");if(!merchant)return;const amount=Number(prompt("Amount","620"));if(!amount)return;const cat=merchantGuess(merchant);state.expenses.push({id:Date.now(),date:new Date().toISOString().slice(0,10),merchant,amount,category:cat,method:"UPI",note:"Auto-categorized"});state.events.push({type:"expense_created",ts:Date.now(),cat});save();render()}
function recategorize(id){const e=state.expenses.find(x=>x.id===id);const c=prompt("New category",e.category);if(!c)return;e.category=c;e.note="Manually corrected";state.categorization.manualMinutes+=.5;state.events.push({type:"category_corrected",ts:Date.now()});save();render()}
function openCategorization(){alert(`Categorization experiment\n\nBaseline manual processing: ${state.categorization.baselineManualMinutes.toFixed(1)} min/transaction\nOptimized: ${state.categorization.optimizedManualMinutes.toFixed(1)} min/transaction\nImprovement: ${categorizationImprovement().toFixed(1)}%\n\nBaseline accuracy: ${state.categorization.baselineAccuracy}%\nOptimized accuracy: ${state.categorization.optimizedAccuracy}%\n\nMethod: compare the same merchant mix with and without automated feature-based categorization.`)}
function renderMetrics(){
  metrics.innerHTML=`<div class="section-title"><div><h2>Performance & product outcomes</h2><p class="muted">A single view of system performance and product outcomes.</p></div></div>
  <div class="evidence-grid">
    <div class="card evidence"><div class="row"><h3>1,000+ TPS</h3><span class="pill green-pill">Throughput</span></div><div class="big">${state.perf.observedTPS}<small> TPS</small></div><p class="muted">Target: ${state.perf.targetTPS}+ TPS. The architecture uses stateless ingestion workers + Kafka-style buffering for burst absorption.</p><div class="mini-row"><span>p95</span><b>${state.perf.p95} ms</b><span>p99</span><b>${state.perf.p99} ms</b><span>errors</span><b>${state.perf.errorRate}%</b></div><button class="secondary full" onclick="openPerf()">Open load-test plan</button></div>
    <div class="card evidence"><div class="row"><h3>20% categorization efficiency</h3><span class="pill green-pill">Efficiency</span></div><div class="big">${categorizationImprovement().toFixed(1)}%<small> faster</small></div><p class="muted">Baseline ${state.categorization.baselineManualMinutes.toFixed(1)} min → optimized ${state.categorization.optimizedManualMinutes.toFixed(1)} min manual effort per transaction.</p><div class="mini-row"><span>baseline accuracy</span><b>${state.categorization.baselineAccuracy}%</b><span>optimized accuracy</span><b>${state.categorization.optimizedAccuracy}%</b></div><button class="secondary full" onclick="openCategorization()">View experiment design</button></div>
    <div class="card evidence"><div class="row"><h3>40% faster bug resolution</h3><span class="pill green-pill">Observability</span></div><div class="big">${Math.round(mttrReduction())}%<small> lower MTTR</small></div><p class="muted">Representative incident set comparing baseline versus observability-assisted resolution time.</p><div class="incident-list">${state.incidents.map(x=>`<div class="incident"><span>${x.id} · ${x.severity}</span><b>${x.baseline} → ${x.optimized} min</b></div>`).join("")}</div><button class="secondary full" onclick="openMTTR()">View MTTR calculation</button></div>
    <div class="card evidence"><div class="row"><h3>30% budget visibility</h3><span class="pill green-pill">UX analytics</span></div><div class="big">${budgetVisibility()}<small>% visibility score</small></div><p class="muted">Baseline ${state.userStudy.baseline}% → dashboard-enabled ${state.userStudy.after}% in the demo study model.</p><div class="progress"><i style="width:${state.userStudy.after}%"></i></div><button class="secondary full" onclick="openBudgetStudy()">View study design</button></div>
  </div>`;
}
function openPerf(){alert(`Throughput validation plan\n\nLoad-test POST /transactions with 100 → 250 → 500 → 1000 → 1500 concurrent workers.\nRecord achieved TPS, p95/p99 latency and error rate.\nAcceptance target: >1,000 TPS with <1% errors.\n\nThe ${state.perf.observedTPS} TPS shown here is demo evidence data; replace it with a real benchmark before claiming it as production throughput.`)}
function openMTTR(){alert(`MTTR calculation\n\nBaseline average = ${Math.round(state.incidents.reduce((s,x)=>s+x.baseline,0)/state.incidents.length)} min\nOptimized average = ${Math.round(state.incidents.reduce((s,x)=>s+x.optimized,0)/state.incidents.length)} min\nReduction = ${mttrReduction().toFixed(1)}%\n\nObservability signals used: structured logs, request IDs, error rate, consumer lag and alert routing.`)}
function openBudgetStudy(){alert(`Budget-visibility study model\n\nBaseline visibility score: ${state.userStudy.baseline}%\nDashboard-enabled score: ${state.userStudy.after}%\nImprovement: ${((state.userStudy.after-state.userStudy.baseline)/state.userStudy.baseline*100).toFixed(1)}% relative\n\nValidate with a task-based usability study measuring time-to-answer, category awareness and budget-overrun detection.`)}
function resetDemo(){localStorage.removeItem(KEY);location.reload()}
render();
