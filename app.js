

/* NM Print ERP — app.js v6.0 Final */
'use strict';
var GAS_URL = 'https://script.google.com/macros/s/AKfycbwyoea7hhlN3feL6ydKND1SoTDiNgsWhstImhV1jgw5c1o0YBoUYyLKODVkmmS1ATw1-g/exec';
var LS = 'nm_v6';
var _U = null, _T = null, _D = {}, _V = 'home', _ci = 0, _fab = null;
var _jFlt = 'all', _jSrc = '', _jMod = 'kanban';

function _ok() { return GAS_URL && GAS_URL.indexOf('YOUR_GAS') < 0 && GAS_URL.indexOf('https') === 0; }

/* ── API (JSONP) ── */
function _api(act, d, ok, err) {
  if (!_ok()) {
    if (act === 'login') { ok && ok({ success: false, error: 'GAS URL configure karo (app.js line 3)' }); return; }
    if (act === 'getAllData') { ok && ok({ success: true, data: { jobs:[], parties:[], machines:[], stock:[], invoices:[], payments:[], expenses:[], qc:[], downtime:[], plates:[], users:[], dispatch:[] } }); return; }
    ok && ok({ success: false, error: 'GAS not connected' }); return;
  }
  var cb = '_cb' + (++_ci);
  var to = setTimeout(function(){ try{delete window[cb];}catch(e){} err?err({message:'Timeout'}):_t('Request timeout'); }, 22000);
  window[cb] = function(r){
    clearTimeout(to); try{delete window[cb];}catch(e){}
    var s=document.getElementById('_s'+cb); if(s)s.remove();
    if(r&&r.success===false&&r.error==='NOT_AUTHENTICATED'){_out();return;}
    ok&&ok(r);
  };
  var url = GAS_URL+'?callback='+cb+'&payload='+encodeURIComponent(JSON.stringify({action:act,data:d||{},token:_T||''}));
  var s=document.createElement('script'); s.id='_s'+cb; s.src=url;
  s.onerror=function(){clearTimeout(to); err?err({message:'Network error'}):_t('Network error');};
  document.head.appendChild(s);
}

/* ── SESSION ── */
function _sv(){try{localStorage.setItem(LS,JSON.stringify({t:_T,u:_U}));}catch(e){}}
function _ld(){try{var s=localStorage.getItem(LS);if(!s)return false;var p=JSON.parse(s);if(!p||!p.t||!p.u)return false;_T=p.t;_U=p.u;return true;}catch(e){return false;}}
function _cl(){try{localStorage.removeItem(LS);}catch(e){} _T=null;_U=null;_D={};}

/* ── INIT ── */
window.addEventListener('DOMContentLoaded', function(){
  var sl=el('sLogin'), sh=el('appShell');
  if(sl)sl.style.display='flex';
  if(sh){sh.style.display='none';sh.classList.remove('on');}
  if(_ld()){_boot();return;}
  ef('lPass',function(e){e.addEventListener('keydown',function(ev){if(ev.key==='Enter')_login();});});
  ef('lEmail',function(e){e.addEventListener('keydown',function(ev){if(ev.key==='Enter'){var lp=el('lPass');if(lp)lp.focus();}});});
});

/* ── LOGIN ── */
function _login(){
  var em=gv('lEmail').toLowerCase(), pw=gv('lPass');
  var errEl=el('lErr'), btn=el('lBtn');
  if(errEl)errEl.textContent='';
  if(!em||!pw){if(errEl)errEl.textContent='Email aur password enter karo';return;}
  if(btn){btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';btn.disabled=true;}
  _api('login',{email:em,password:pw},function(r){
    if(btn){btn.innerHTML='<i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In';btn.disabled=false;}
    if(!r||!r.success){if(errEl)errEl.textContent=(r&&r.error)||'Login failed';return;}
    _T=r.token;_U=r.user;_sv();_boot();
  },function(e){
    if(btn){btn.innerHTML='<i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In';btn.disabled=false;}
    if(errEl)errEl.textContent=(e&&e.message)||'Connection error';
  });
}

/* ── BOOT ── */
function _boot(){
  var sl=el('sLogin'),sh=el('appShell');
  if(sl)sl.style.display='none';
  if(sh){sh.style.display='block';sh.classList.add('on');}
  es('sbAv',(_U.name||'?')[0].toUpperCase());
  es('tbAv',(_U.name||'?')[0].toUpperCase());
  es('sbNm',_U.name||'--');
  es('sbRl',_rl(_U.role));
  es('tbRole',_rl(_U.role));
  _buildNav();
  try{if(localStorage.getItem('nm_sc')==='1'){var sb=el('sb');if(sb)sb.classList.add('col');document.body.classList.add('sc');}}catch(e){}
  _skel();
  _api('getAllData',{},function(r){_D=r.data||{};_go('home');},function(){_D={};_go('home');_t('Data load failed');});
}
function _out(){
  _cl();
  var sl=el('sLogin'),sh=el('appShell');
  if(sh){sh.style.display='none';sh.classList.remove('on');}
  if(sl)sl.style.display='flex';
  ef('lEmail',function(e){e.value='';});ef('lPass',function(e){e.value='';});ef('lErr',function(e){e.textContent='';});
  _sbClose();
}
function _rl(r){return({admin:'Admin',supervisor:'Supervisor',operator:'Operator',cutting:'Cutting',viewer:'Viewer'})[r]||r||'Staff';}

/* ── HELPERS ── */
function el(id){return document.getElementById(id);}
function ef(id,fn){var e=el(id);if(e)fn(e);}
function es(id,v){ef(id,function(e){e.textContent=v;});}
function gv(id){var e=el(id);return e?(e.value||'').trim():'';}
function _html(h){var c=el('content');if(c)c.innerHTML=h;}
function _n(v){var x=parseFloat(v);return isNaN(x)?0:x;}
function _f(n){return Number(n).toLocaleString('en-IN',{maximumFractionDigits:0});}
function _e(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function _x(s){var t=String(s||'');return t.replace(/&/g,'&amp;').split("'").join('&apos;');}
function _today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function _t(msg,dur){ef('toast',function(t){t.textContent=msg;t.classList.add('on');setTimeout(function(){t.classList.remove('on');},dur||2600);});}
function _skel(){
  _html('<div class="sk" style="height:100px;border-radius:14px;margin-bottom:14px"></div>'
    +'<div class="kpi-row">'+Array(4).fill('<div class="kpi"><div class="sk" style="height:40px;width:40px;border-radius:11px;margin-bottom:10px"></div><div class="sk" style="height:22px;width:50px;border-radius:5px;margin-bottom:6px"></div><div class="sk" style="height:10px;width:70px;border-radius:4px"></div></div>').join('')+'</div>'
    +'<div class="sk" style="height:86px;border-radius:14px;margin-bottom:10px"></div>'
    +'<div class="sk" style="height:86px;border-radius:14px"></div>');
}

/* -- NAV CONFIG -- */
var NAV={
  admin:[{g:"Main"},{id:"home",ic:"fa-house",lb:"Dashboard"},{id:"jobs",ic:"fa-clipboard-list",lb:"All Jobs"},{id:"parties",ic:"fa-building-user",lb:"Parties"},{id:"stock",ic:"fa-boxes-stacked",lb:"Stock Register"},{g:"Finance"},{id:"invoices",ic:"fa-file-invoice",lb:"Invoices"},{id:"payments",ic:"fa-indian-rupee-sign",lb:"Payments"},{id:"expenses",ic:"fa-receipt",lb:"Expenses"},{g:"Factory"},{id:"machines",ic:"fa-gears",lb:"Machines"},{id:"qc",ic:"fa-magnifying-glass-chart",lb:"Quality Control"},{id:"downtime",ic:"fa-triangle-exclamation",lb:"Downtime"},{id:"dispatch",ic:"fa-truck",lb:"Dispatch"},{id:"plates",ic:"fa-layer-group",lb:"Plates"},{g:"Reports"},{id:"reports",ic:"fa-chart-bar",lb:"Analytics"},{id:"joblog",ic:"fa-scroll",lb:"Job Log"},{id:"staff",ic:"fa-id-badge",lb:"Staff"},{id:"settings",ic:"fa-gear",lb:"Settings"}],
  supervisor:[{g:"Main"},{id:"home",ic:"fa-house",lb:"Dashboard"},{id:"jobs",ic:"fa-clipboard-list",lb:"All Jobs"},{id:"dispatch",ic:"fa-truck",lb:"Dispatch"},{g:"Factory"},{id:"qc",ic:"fa-magnifying-glass-chart",lb:"QC"},{id:"downtime",ic:"fa-triangle-exclamation",lb:"Downtime"},{id:"machines",ic:"fa-gears",lb:"Machines"},{id:"stock",ic:"fa-boxes-stacked",lb:"Stock"},{id:"expenses",ic:"fa-receipt",lb:"Expenses"},{id:"joblog",ic:"fa-scroll",lb:"Job Log"},{id:"settings",ic:"fa-gear",lb:"Settings"}],
  operator:[{g:"My Work"},{id:"home",ic:"fa-house",lb:"My Jobs"},{id:"history",ic:"fa-clock-rotate-left",lb:"History"},{g:"Report"},{id:"downtime",ic:"fa-triangle-exclamation",lb:"Problem"},{id:"settings",ic:"fa-gear",lb:"Settings"}],
  cutting:[{g:"My Work"},{id:"home",ic:"fa-house",lb:"Cut Queue"},{id:"history",ic:"fa-clock-rotate-left",lb:"History"},{g:"Report"},{id:"downtime",ic:"fa-triangle-exclamation",lb:"Problem"},{id:"settings",ic:"fa-gear",lb:"Settings"}],
  viewer:[{g:"Overview"},{id:"home",ic:"fa-house",lb:"Summary"},{id:"jobs",ic:"fa-clipboard-list",lb:"All Jobs"},{id:"invoices",ic:"fa-file-invoice",lb:"Revenue"},{id:"parties",ic:"fa-building-user",lb:"Parties"},{id:"reports",ic:"fa-chart-bar",lb:"Reports"},{id:"settings",ic:"fa-gear",lb:"Settings"}]
};
var BNAV={
  admin:[["home","fa-house","Home"],["jobs","fa-clipboard-list","Jobs"],["invoices","fa-file-invoice","Bills"],["reports","fa-chart-bar","Reports"]],
  supervisor:[["home","fa-house","Home"],["jobs","fa-clipboard-list","Jobs"],["dispatch","fa-truck","Dispatch"],["qc","fa-magnifying-glass-chart","QC"]],
  operator:[["home","fa-house","My Jobs"],["history","fa-clock-rotate-left","History"],["downtime","fa-triangle-exclamation","Problem"],["settings","fa-gear","Settings"]],
  cutting:[["home","fa-house","Cut Jobs"],["history","fa-clock-rotate-left","History"],["downtime","fa-triangle-exclamation","Problem"],["settings","fa-gear","Settings"]],
  viewer:[["home","fa-house","Summary"],["jobs","fa-clipboard-list","Jobs"],["invoices","fa-file-invoice","Revenue"],["reports","fa-chart-bar","Reports"]]
};
var ACC={
  home:["admin","supervisor","operator","cutting","viewer"],jobs:["admin","supervisor","operator","viewer"],history:["admin","supervisor","operator","cutting","viewer"],
  parties:["admin","supervisor","viewer"],stock:["admin","supervisor"],invoices:["admin","viewer"],payments:["admin"],expenses:["admin","supervisor"],
  machines:["admin","supervisor"],qc:["admin","supervisor"],downtime:["admin","supervisor","operator","cutting"],dispatch:["admin","supervisor"],
  reports:["admin","supervisor","viewer"],staff:["admin"],plates:["admin","supervisor"],settings:["admin","supervisor","operator","cutting","viewer"],joblog:["admin","supervisor","viewer"]
};
function _buildNav(){
  var role=_U?_U.role:"viewer", items=NAV[role]||NAV.viewer, bnavs=BNAV[role]||BNAV.viewer;
  var sbEl=el("sbNav"), bnEl=el("bnav");
  if(sbEl)sbEl.innerHTML=items.map(function(it){
    if(it.g)return "<div class=\"sb-grp\">"+it.g+"</div>";
    return "<div class=\"sb-itm\" id=\"si_"+it.id+"\" onclick=\"_lv('"+it.id+"');_sbClose()\"><i class=\"fa-solid "+it.ic+"\"></i><span class=\"sb-itm-tx\">"+it.lb+"</span><span class=\"sb-tip\">"+it.lb+"</span></div>";
  }).join("");
  if(bnEl)bnEl.innerHTML=bnavs.map(function(it){
    return "<div class=\"bn-itm\" id=\"bi_"+it[0]+"\" onclick=\"_lv('"+it[0]+"')\"><i class=\"fa-solid "+it[1]+"\"></i>"+it[2]+"</div>";
  }).join("");
}
function _act(v){
  document.querySelectorAll(".sb-itm").forEach(function(e){e.classList.remove("on");});
  document.querySelectorAll(".bn-itm").forEach(function(e){e.classList.remove("on");});
  var si=el("si_"+v),bi=el("bi_"+v);
  if(si)si.classList.add("on"); if(bi)bi.classList.add("on");
}
function _sbOpen(){ef("sb",function(e){e.classList.add("open");});ef("sbOv",function(e){e.classList.add("on");});}
function _sbClose(){ef("sb",function(e){e.classList.remove("open");});ef("sbOv",function(e){e.classList.remove("on");});}
function _sbToggle(){
  var sc=document.body.classList.toggle("sc");
  ef("sb",function(e){e.classList.toggle("col",sc);});
  try{localStorage.setItem("nm_sc",sc?"1":"");}catch(e){}
}
/* -- ROUTER -- */
var TITLES={home:"Dashboard",jobs:"All Jobs",history:"History",parties:"Parties",stock:"Stock Register",invoices:"Invoices",payments:"Payments",expenses:"Expenses",machines:"Machines",qc:"Quality Control",downtime:"Downtime Log",dispatch:"Dispatch Queue",reports:"Analytics",staff:"Staff",plates:"Plates",settings:"Settings",joblog:"Job Log"};
function _go(v){
  if(_U&&ACC[v]&&ACC[v].indexOf(_U.role)<0){_t("Access denied");return;}
  _V=v; _act(v); _fab=null; ef("fab",function(e){e.classList.remove("on");});
  var t=TITLES[v]||v;
  if(_U){if(_U.role==="operator"&&v==="home")t="My Jobs";if(_U.role==="cutting"&&v==="home")t="Cut Queue";if(_U.role==="viewer"&&v==="home")t="Summary";}
  es("tbTitle",t);
  try{({home:_vHome,jobs:_vJobs,history:_vHist,parties:_vParties,stock:_vStock,invoices:_vInvoices,payments:_vPayments,expenses:_vExpenses,machines:_vMachines,qc:_vQC,downtime:_vDowntime,dispatch:_vDispatch,reports:_vReports,staff:_vStaff,plates:_vPlates,settings:_vSettings,joblog:_vJobLog}[v]||_vHome)();}
  catch(err){console.error("View error",v,err);_html("<div class=\"al danger\"><i class=\"fa-solid fa-circle-exclamation\"></i><div><b>Error:</b> "+_e(err.message)+"</div></div>");}
}
function _lv(v){_go(v);}
function _refresh(){
  ef("rIco",function(i){i.classList.add("fa-spin");});
  _api("getAllData",{},function(r){_D=r.data||{};_go(_V);ef("rIco",function(i){i.classList.remove("fa-spin");});_t("Refreshed");},
    function(){ef("rIco",function(i){i.classList.remove("fa-spin");});_t("Refresh failed");});
}
function _fabClick(){if(_fab)_fab();}
/* -- COMPONENTS -- */
function _kpi(label,val,icon,c,b,sub){
  return "<div class=\"kpi\" style=\"--kc:"+c+";--kb:"+b+"\"><div class=\"kpi-ic\" style=\"background:"+b+";color:"+c+"\"><i class=\"fa-solid "+icon+"\"></i></div><div class=\"kpi-v\">"+val+"</div><div class=\"kpi-l\">"+label+"</div>"+(sub?"<div class=\"kpi-s\">"+sub+"</div>":"")+"</div>";
}
function _tile(icon,c,b,nm,sb2,fn,bdg){
  return "<div class=\"qt\" style=\"--tc:"+c+";--tb:"+b+"\" onclick=\""+fn+"\">"+(bdg?"<div class=\"qt-bdg\">"+bdg+"</div>":"")+"<div class=\"qt-ic\" style=\"background:"+b+";color:"+c+"\"><i class=\"fa-solid "+icon+"\"></i></div><div class=\"qt-nm\">"+nm+"</div><div class=\"qt-sb\">"+sb2+"</div></div>";
}
function _stBadge(s){return "<span class=\"badge "+({Pending:"bx","In Progress":"bb","Done - Dispatch Pending":"bt",Complete:"bg"}[s]||"bx")+"\">"+_e(s)+"</span>";}
function _cBadge(s){return s==="Done"?"bg":s==="In Progress"?"bb":"bx";}
function _pBadge(s){return s==="Done"?"bg":s==="In Progress"?"bv":"bx";}
function _priC(p){return{1:"#EA4335",2:"#F97316",3:"#4285F4",4:"#34A853",5:"#9CA3AF"}[Math.min(5,Math.max(1,parseInt(p)||3))]||"#4285F4";}

function _jCard(j,showAct){
  var id=j["Job ID"]||"",nm=j["Job Name / Description"]||"--",pt=j["Party Name"]||"--",mc=j["Machine Assigned"]||"--";
  var pri=parseInt(j["Priority"]||j["Priority (1-5)"]||3)||3;
  var cs=j["Cut Status"]||"Pending",ps=j["Print Status"]||"Pending",ds=j["Dispatch Status"]||"Pending",js2=j["Job Status"]||"Pending";
  var dl=(j["Delay Flag"]==="DELAYED"||j["Delay Flag (Formula)"]==="DELAYED");
  var role=_U?_U.role:"viewer", ac=_priC(pri), xid=id.replace(/"/g,"&quot;");
  var h="<div class=\"jc\" onclick=\"_mJD('"+xid+"')\"><div class=\"jc-acc\" style=\"background:"+ac+"\"></div>"
    +"<div class=\"jc-bd\"><div class=\"jc-top\"><div style=\"flex:1;min-width:0\">"
    +"<div class=\"jc-id\">"+_e(id)+" &middot; P"+pri+(dl?" <span style=\"color:#EA4335\">&#9888; DELAYED</span>":"")+' &middot; '+_e(mc)+"</div>"
    +"<div class=\"jc-nm\">"+_e(nm)+"</div>"
    +"<div class=\"jc-pt\"><i class=\"fa-solid fa-building-user\" style=\"color:#94A3B8;font-size:9px\"></i>"+_e(pt)+"</div></div>"
    +"<div style=\"flex-shrink:0;margin-left:8px\">"+_stBadge(js2)+"</div></div>"
    +"<div class=\"jc-tags\">"
    +"<span class=\"badge "+_cBadge(cs)+"\">&#9986; "+cs+"</span>"
    +"<span class=\"badge "+_pBadge(ps)+"\">&#128424; "+ps+"</span>"
    +(j["Promised Date"]?"<span class=\"badge bx\"><i class=\"fa-regular fa-calendar\" style=\"font-size:9px\"></i> "+j["Promised Date"]+"</span>":"")
    +"</div></div>";
  if(showAct){
    h+="<div class=\"jc-act\">";
    if((role==="cutting"||role==="admin"||role==="supervisor")&&cs!=="Done")h+="<button class=\"btn btn-sm btnO\" onclick=\"event.stopPropagation();_mCut('"+xid+"')\"><i class=\"fa-solid fa-scissors\"></i> Cut</button>";
    if((role==="operator"||role==="admin"||role==="supervisor")&&cs==="Done"&&ps!=="Done")h+="<button class=\"btn btn-sm btnB\" onclick=\"event.stopPropagation();_mPrint('"+xid+"')\"><i class=\"fa-solid fa-print\"></i> Print</button>";
    if((role==="admin"||role==="supervisor")&&ps==="Done"&&ds==="Pending")h+="<button class=\"btn btn-sm btnT\" onclick=\"event.stopPropagation();_mDisp('"+xid+"')\"><i class=\"fa-solid fa-truck\"></i> Dispatch</button>";
    if(role==="admin"&&ds==="Done"&&!j["Billed (Y/N)"])h+="<button class=\"btn btn-sm btnG\" onclick=\"event.stopPropagation();_mInv('"+xid+"')\"><i class=\"fa-solid fa-file-invoice\"></i> Invoice</button>";
    if((role==="admin"||role==="supervisor")&&ps==="Done"&&!j["QC Done (Y/N)"])h+="<button class=\"btn btn-sm btnV\" onclick=\"event.stopPropagation();_mQCJ('"+xid+"')\"><i class=\"fa-solid fa-search\"></i> QC</button>";
    h+="</div>";
  }
  return h+"</div>";
}
function _kbCard(j){
  var pri=parseInt(j["Priority"]||j["Priority (1-5)"]||3)||3, ac=_priC(pri);
  var xid=(j["Job ID"]||"").replace(/"/g,"&quot;");
  var dl=(j["Delay Flag"]==="DELAYED"||j["Delay Flag (Formula)"]==="DELAYED");
  return "<div class=\"kb-card\" onclick=\"_mJD('"+xid+"')\" style=\"border-left:3px solid "+ac+"\">"
    +"<div class=\"kb-card-id\">"+_e(j["Job ID"]||"--")+" &middot; P"+pri+(dl?" &#9888;":"")+"</div>"
    +"<div class=\"kb-card-nm\">"+_e(j["Job Name / Description"]||"--")+"</div>"
    +"<div class=\"kb-card-pt\"><i class=\"fa-solid fa-building-user\" style=\"font-size:9px;color:#94A3B8\"></i>"+_e(j["Party Name"]||"--")
    +(j["Promised Date"]?"<span style=\"margin-left:6px;font-size:9px;color:var(--tx3)\"> "+j["Promised Date"]+"</span>":"")+"</div>"
    +"</div>";
}
function _jRow(j,role){
  var pri=parseInt(j["Priority"]||j["Priority (1-5)"]||3)||3, ac=_priC(pri);
  var cs=j["Cut Status"]||"Pending",ps=j["Print Status"]||"Pending",ds=j["Dispatch Status"]||"Pending";
  var dl=(j["Delay Flag"]==="DELAYED"||j["Delay Flag (Formula)"]==="DELAYED");
  var xid=(j["Job ID"]||"").replace(/"/g,"&quot;");
  var h="<tr onclick=\"_mJD('"+xid+"')\">"
    +"<td><div style=\"display:flex;align-items:center;gap:6px\"><div style=\"width:3px;height:24px;background:"+ac+";border-radius:2px;flex-shrink:0\"></div><b>"+_e(j["Job ID"]||"--")+"</b>"+(dl?"<span style=\"color:#EA4335\">&#9888;</span>":"")+"</div></td>"
    +"<td><div style=\"overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;font-weight:600\">"+_e(j["Job Name / Description"]||"--")+"</div></td>"
    +"<td>"+_e(j["Party Name"]||"--")+"</td>"
    +"<td style=\"white-space:nowrap\">"+_e(j["Machine Assigned"]||"--")+"</td>"
    +"<td><span class=\"badge "+(pri==1?"br":pri==2?"bo":"bb")+"\">P"+pri+"</span></td>"
    +"<td><span class=\"badge "+_cBadge(cs)+"\">"+cs+"</span></td>"
    +"<td><span class=\"badge "+_pBadge(ps)+"\">"+ps+"</span></td>"
    +"<td><span class=\"badge "+(ds==="Done"?"bg":"bx")+"\">"+ds+"</span></td>"
    +"<td>"+_stBadge(j["Job Status"]||"Pending")+"</td>"
    +"<td style=\"white-space:nowrap;font-size:11px;color:var(--tx3)\">"+_e(j["Promised Date"]||"--")+"</td>";
  if(role!=="viewer"){
    h+="<td onclick=\"event.stopPropagation()\" style=\"white-space:nowrap\">";
    if((role==="cutting"||role==="admin"||role==="supervisor")&&cs!=="Done")h+="<button class=\"btn btn-sm btnO\" onclick=\"_mCut('"+xid+"')\"><i class=\"fa-solid fa-scissors\"></i></button> ";
    if((role==="operator"||role==="admin"||role==="supervisor")&&cs==="Done"&&ps!=="Done")h+="<button class=\"btn btn-sm btnB\" onclick=\"_mPrint('"+xid+"')\"><i class=\"fa-solid fa-print\"></i></button> ";
    if((role==="admin"||role==="supervisor")&&ps==="Done"&&ds==="Pending")h+="<button class=\"btn btn-sm btnT\" onclick=\"_mDisp('"+xid+"')\"><i class=\"fa-solid fa-truck\"></i></button>";
    h+="</td>";
  }
  return h+"</tr>";
}

/* -- VIEWS -- */
function _vHome(){
  if(!_U)return;
  if(_U.role==="operator"){_vOpH();return;}
  if(_U.role==="cutting"){_vCutH();return;}
  if(_U.role==="viewer"){_vViewH();return;}
  var jbs=_D.jobs||[], td=_today();
  var pend=jbs.filter(function(j){return j["Job Status"]==="Pending";});
  var inp=jbs.filter(function(j){return j["Job Status"]==="In Progress";});
  var disp=jbs.filter(function(j){return j["Print Status"]==="Done"&&j["Dispatch Status"]==="Pending";});
  var delay=jbs.filter(function(j){return(j["Delay Flag"]==="DELAYED"||j["Delay Flag (Formula)"]==="DELAYED")&&j["Job Status"]!=="Complete";});
  var inv=_D.invoices||[];
  var mRev=inv.filter(function(i){return(i["Invoice Date"]||"").slice(0,7)===td.slice(0,7);}).reduce(function(s,i){return s+_n(i["Final Amount"]);},0);
  var out2=inv.filter(function(i){return i["Status"]==="Pending"||i["Status"]==="Overdue";}).reduce(function(s,i){return s+_n(i["Net Payable (Formula)"]||i["Net Payable"]);},0);
  var hh=new Date().getHours(), gm=hh<12?"Good Morning":hh<17?"Good Afternoon":"Good Evening";
  var dn=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"});
  var todayJ=jbs.filter(function(j){return(j["Entry Date"]||"").slice(0,10)===td;}).length;
  var h="<div class=\"gc\"><div class=\"gc-in\"><div class=\"gc-l\"><div class=\"gc-sub\">Namaste, "+_e(_U.name||"")+"</div><div class=\"gc-msg\">"+gm+"!</div><div class=\"gc-dt\">"+dn+"</div></div>"
    +"<div class=\"gc-stats\"><div class=\"gc-st\"><div class=\"gc-sv\">"+pend.length+"</div><div class=\"gc-sl\">Pending</div></div>"
    +"<div class=\"gc-st\"><div class=\"gc-sv\">"+inp.length+"</div><div class=\"gc-sl\">Running</div></div>"
    +"<div class=\"gc-st\"><div class=\"gc-sv\">"+disp.length+"</div><div class=\"gc-sl\">Dispatch</div></div>"
    +"<div class=\"gc-st\"><div class=\"gc-sv\">"+delay.length+"</div><div class=\"gc-sl\">Delayed</div></div></div></div></div>";
  if(delay.length)h+="<div class=\"al danger\"><i class=\"fa-solid fa-circle-exclamation\"></i><b>"+delay.length+" job(s) DELAYED!</b></div>";
  h+="<div class=\"kpi-row\">"+_kpi("Today",""+todayJ,"fa-calendar-day","#4285F4","rgba(66,133,244,.12)","Jobs added today")
    +_kpi("Pending",""+pend.length,"fa-hourglass-half","#FBBC05","rgba(251,188,5,.14)","Awaiting start")
    +_kpi("In Progress",""+inp.length,"fa-gears","#7C3AED","rgba(124,58,237,.12)","On machine")
    +_kpi("Dispatch Due",""+disp.length,"fa-truck","#0D9488","rgba(13,148,136,.12)","Ready to ship")+"</div>";
  /* Charts */
  var stM={Complete:0,"In Progress":0,Pending:0,"Dispatch Pending":0};
  jbs.forEach(function(j){var s=j["Job Status"]||"Pending";if(s==="Done - Dispatch Pending")s="Dispatch Pending";if(stM.hasOwnProperty(s))stM[s]++;});
  var stC=["#34A853","#4285F4","#FBBC05","#EA4335"],stK=Object.keys(stM);
  var tot=jbs.length||1,cop=[],cum=0;
  stK.forEach(function(k,i){var p=stM[k]/tot*100;cop.push(stC[i]+" "+cum.toFixed(1)+"% "+(cum+p).toFixed(1)+"%");cum+=p;});
  var mNms=(_D.machines||[]).map(function(m){return m["Machine Name"]||"";}).filter(Boolean);
  if(!mNms.length)mNms=["Machine 1","Machine 2","Machine 3"];
  var mC=mNms.map(function(m){return jbs.filter(function(j){return j["Machine Assigned"]===m;}).length;});
  var mMx=Math.max.apply(null,mC)||1;
  h+="<div class=\"dg-main\">";
  h+="<div>";
  h+="<div class=\"dg2\" style=\"margin-bottom:12px\">";
  h+="<div class=\"card\" style=\"margin-bottom:0\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-chart-pie\"></i>Job Status</div></div><div class=\"cb\"><div class=\"dn-w\"><div class=\"dn\" style=\"background:conic-gradient("+cop.join(",")+")\"></div><div class=\"dn-lg\">"+stK.map(function(k,i){return"<div class=\"dn-r\"><div class=\"dn-d\" style=\"background:"+stC[i]+"\"></div><span style=\"flex:1\">"+k+"</span><b>"+stM[k]+"</b></div>";}).join("")+"</div></div></div></div>";
  h+="<div class=\"card\" style=\"margin-bottom:0\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-gears\"></i>Machine Load</div></div><div class=\"cb\"><div class=\"cbg\">";
  mNms.forEach(function(m,i){h+="<div class=\"cbr\"><span class=\"cbl\">"+_e(m)+"</span><div class=\"cbt\"><div class=\"cbf\" style=\"width:"+(mC[i]/mMx*100).toFixed(0)+"%;background:"+["#4285F4","#34A853","#EA4335","#FBBC05"][i%4]+"\"></div></div><span class=\"cbv\">"+mC[i]+"</span></div>";});
  h+="</div></div></div></div>";
  h+="<div class=\"dg2\" style=\"margin-bottom:12px\">"+_kpi("Month Revenue","&#8377;"+_f(mRev),"fa-indian-rupee-sign","#34A853","rgba(52,168,83,.12)","Billed this month")+_kpi("Outstanding","&#8377;"+_f(out2),"fa-hourglass-half","#EA4335","rgba(234,67,53,.12)",inv.filter(function(i){return i["Status"]==="Overdue";}).length+" overdue")+"</div>";
  if(_U.role==="admin"){
    h+="<div class=\"sh\"><div class=\"sh-t\"><i class=\"fa-solid fa-bolt\" style=\"color:#FBBC05\"></i> Quick Actions</div></div><div class=\"qa\">"+_tile("fa-plus","#4285F4","rgba(66,133,244,.12)","New Job","Add production job","_mNewJob()")+_tile("fa-boxes-stacked","#34A853","rgba(52,168,83,.12)","Stock In","Register inward","_mStockIn()")+_tile("fa-truck","#0D9488","rgba(13,148,136,.12)","Dispatch",disp.length+" waiting","_lv('dispatch')",disp.length>0?disp.length:"")+_tile("fa-file-invoice","#7C3AED","rgba(124,58,237,.12)","Invoices","Bills & payments","_lv('invoices')")+_tile("fa-chart-bar","#FBBC05","rgba(251,188,5,.14)","Analytics","Reports","_lv('reports')")+_tile("fa-building-user","#EA4335","rgba(234,67,53,.12)","Parties","Customers","_lv('parties')")+"</div>";
    _fab=_mNewJob; ef("fab",function(e){e.classList.add("on");});
  }else{
    h+="<div class=\"qa\">"+_tile("fa-clipboard-list","#4285F4","rgba(66,133,244,.12)","All Jobs","View all","_lv('jobs')")+_tile("fa-truck","#0D9488","rgba(13,148,136,.12)","Dispatch",disp.length+" ready","_lv('dispatch')",disp.length>0?disp.length:"")+_tile("fa-magnifying-glass-chart","#7C3AED","rgba(124,58,237,.12)","QC","Quality check","_lv('qc')")+_tile("fa-triangle-exclamation","#EA4335","rgba(234,67,53,.12)","Downtime","Log issue","_lv('downtime')")+"</div>";
  }
  h+="</div>";
  h+="<div><div class=\"card\" style=\"margin-bottom:0\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-bolt\"></i>Recent Jobs</div><span class=\"ca\" onclick=\"_lv('jobs')\">View All</span></div>";
  var rec=jbs.slice(-10).reverse();
  if(!rec.length)h+="<div class=\"empty\" style=\"padding:28px\"><i class=\"fa-solid fa-inbox\"></i><p>No jobs yet</p></div>";
  else rec.forEach(function(j){
    var ac2=_priC(parseInt(j["Priority"]||j["Priority (1-5)"]||3)||3), xid=(j["Job ID"]||"").replace(/"/g,"&quot;");
    h+="<div onclick=\"_mJD('"+xid+"')\" style=\"display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--bdr);cursor:pointer\" onmouseover=\"this.style.background='var(--sur2)'\" onmouseout=\"this.style.background=''\">"
      +"<div style=\"width:3px;height:34px;border-radius:2px;background:"+ac2+";flex-shrink:0\"></div>"
      +"<div style=\"flex:1;min-width:0\"><div style=\"font-size:12px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap\">"+_e(j["Job Name / Description"]||"--")+"</div>"
      +"<div style=\"font-size:10px;color:var(--tx3);margin-top:1px\">"+_e(j["Job ID"]||"--")+" &bull; "+_e(j["Party Name"]||"--")+"</div></div>"
      +_stBadge(j["Job Status"]||"Pending")+"</div>";
  });
  h+="</div></div></div></div>";
  _html(h);
}
function _vOpH(){
  var myM=(_U&&_U.machine)||"";
  var jbs=(_D.jobs||[]).filter(function(j){return(!myM||j["Machine Assigned"]===myM)&&j["Print Status"]!=="Done";}).sort(function(a,b){return(_n(a["Priority"]||a["Priority (1-5)"])||5)-(_n(b["Priority"]||b["Priority (1-5)"])||5);});
  var done=(_D.jobs||[]).filter(function(j){return j["Machine Assigned"]===myM&&j["Print Status"]==="Done";}).length;
  var h="<div class=\"gc\"><div class=\"gc-in\"><div class=\"gc-l\"><div class=\"gc-sub\">Your Machine</div><div class=\"gc-msg\">"+_e(myM||"Not Assigned")+"</div></div><div class=\"gc-stats\"><div class=\"gc-st\"><div class=\"gc-sv\">"+jbs.length+"</div><div class=\"gc-sl\">In Queue</div></div><div class=\"gc-st\"><div class=\"gc-sv\">"+done+"</div><div class=\"gc-sl\">Done</div></div></div></div></div><div class=\"sh\"><div class=\"sh-t\">Priority Queue</div></div>";
  if(!jbs.length)h+="<div class=\"empty\"><i class=\"fa-solid fa-circle-check\"></i><h3>All Clear!</h3><p>No pending jobs on your machine</p></div>";
  else jbs.forEach(function(j){h+=_jCard(j,true);});
  _html(h);
}
function _vCutH(){
  var jbs=(_D.jobs||[]).filter(function(j){return j["Cut Status"]!=="Done";}).sort(function(a,b){return(_n(a["Priority"]||a["Priority (1-5)"])||5)-(_n(b["Priority"]||b["Priority (1-5)"])||5);});
  var done=(_D.jobs||[]).filter(function(j){return j["Cut Status"]==="Done";}).length;
  var h="<div class=\"gc\"><div class=\"gc-in\"><div class=\"gc-l\"><div class=\"gc-sub\">Cutting Station</div><div class=\"gc-msg\">Cut Queue</div></div><div class=\"gc-stats\"><div class=\"gc-st\"><div class=\"gc-sv\">"+jbs.length+"</div><div class=\"gc-sl\">Pending</div></div><div class=\"gc-st\"><div class=\"gc-sv\">"+done+"</div><div class=\"gc-sl\">Done</div></div></div></div></div><div class=\"sh\"><div class=\"sh-t\">Cutting Queue</div></div>";
  if(!jbs.length)h+="<div class=\"empty\"><i class=\"fa-solid fa-scissors\"></i><h3>All Done!</h3><p>No cutting jobs pending</p></div>";
  else jbs.forEach(function(j){h+=_jCard(j,true);});
  _html(h);
}
function _vViewH(){
  var jbs=_D.jobs||[],inv=_D.invoices||[];
  var comp=jbs.filter(function(j){return j["Job Status"]==="Complete";});
  var tBill=inv.reduce(function(s,i){return s+_n(i["Final Amount"]);},0);
  var out2=inv.reduce(function(s,i){return s+(i["Status"]==="Pending"||i["Status"]==="Overdue"?_n(i["Net Payable (Formula)"]||i["Net Payable"]):0);},0);
  var h="<div class=\"kpi-row\">"+_kpi("Total Jobs",""+jbs.length,"fa-clipboard-list","#4285F4","rgba(66,133,244,.12)")+_kpi("Complete",""+comp.length,"fa-circle-check","#34A853","rgba(52,168,83,.12)")+_kpi("Billed","&#8377;"+_f(tBill),"fa-file-invoice","#7C3AED","rgba(124,58,237,.12)")+_kpi("Outstanding","&#8377;"+_f(out2),"fa-hourglass-half","#EA4335","rgba(234,67,53,.12)")+"</div><div class=\"sh\"><div class=\"sh-t\">Recent Jobs</div></div>";
  jbs.slice(-10).reverse().forEach(function(j){h+=_jCard(j,false);});
  _html(h);
}

/* JOBS */
function _vJobs(){
  var role=_U?_U.role:"viewer";
  var jbs=(_D.jobs||[]).slice();
  if(role==="operator")jbs=jbs.filter(function(j){return j["Machine Assigned"]===(_U.machine||"");});
  if(role==="admin"){_fab=_mNewJob;ef("fab",function(e){e.classList.add("on");});}
  var flt=jbs.filter(function(j){
    var ms=_jFlt==="all"||j["Job Status"]===_jFlt;
    var q=(_jSrc||"").toLowerCase();
    var mr=!q||(j["Job ID"]||"").toLowerCase().indexOf(q)>=0||(j["Job Name / Description"]||"").toLowerCase().indexOf(q)>=0||(j["Party Name"]||"").toLowerCase().indexOf(q)>=0;
    return ms&&mr;
  }).sort(function(a,b){return(_n(a["Priority"]||a["Priority (1-5)"])||5)-(_n(b["Priority"]||b["Priority (1-5)"])||5);});
  var opts=["all","Pending","In Progress","Done - Dispatch Pending","Complete"];
  var h="<div class=\"srch\"><i class=\"fa-solid fa-magnifying-glass\"></i><input id=\"jSrch\" placeholder=\"Search job ID, description, party...\" oninput=\"_jSrchFn(this.value)\" value=\""+_e(_jSrc||"")+"\"></div>";
  h+="<div class=\"frow\">"+opts.map(function(s){return"<div class=\"pill"+(_jFlt===s?" on":"")+"\" onclick=\"_jFltFn('"+s+"')\">"+(s==="all"?"All ("+jbs.length+")":s)+"</div>";}).join("")+"</div>";
  h+="<div class=\"sh\"><div class=\"sh-t\">Jobs <span class=\"sh-c\">"+flt.length+"</span></div>"
    +"<div style=\"display:flex;gap:4px\">"
    +"<span class=\"sh-a"+(_jMod==="kanban"?"\" style=\"background:var(--BL);color:var(--B)":"")+'" onclick="_jModFn(\'kanban\')" title="Kanban"><i class="fa-solid fa-table-columns"></i></span>'
    +'<span class="sh-a'+(_jMod==="card"?"\" style=\"background:var(--BL);color:var(--B)":"")+'" onclick="_jModFn(\'card\')" title="Cards"><i class="fa-solid fa-table-cells-large"></i></span>'
    +'<span class="sh-a'+(_jMod==="tbl"?"\" style=\"background:var(--BL);color:var(--B)":"")+'" onclick="_jModFn(\'tbl\')" title="Table"><i class="fa-solid fa-table-list"></i></span>'
    +"</div></div>";
  if(!flt.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-clipboard-list\"></i><h3>No jobs</h3><p>No jobs match this filter</p></div>";_html(h);return;}
  if(_jMod==="kanban"){
    var cols=[{key:"Pending",label:"Pending",color:"#94A3B8",bg:"rgba(148,163,184,.12)"},{key:"In Progress",label:"In Progress",color:"#4285F4",bg:"rgba(66,133,244,.12)"},{key:"Done - Dispatch Pending",label:"Ready to Dispatch",color:"#0D9488",bg:"rgba(13,148,136,.12)"},{key:"Complete",label:"Complete",color:"#34A853",bg:"rgba(52,168,83,.12)"}];
    h+="<div class=\"kb-wrap\">";
    cols.forEach(function(col){
      var cJ=flt.filter(function(j){return(j["Job Status"]||"Pending")===col.key;});
      h+="<div class=\"kb-col\"><div class=\"kb-hd\" style=\"background:"+col.bg+"\"><div class=\"kb-hd-t\" style=\"color:"+col.color+"\"><i class=\"fa-solid fa-circle\" style=\"font-size:8px\"></i>"+col.label+"</div><span class=\"kb-cnt\" style=\"background:"+col.color+";color:#fff\">"+cJ.length+"</span></div><div class=\"kb-body\">";
      if(!cJ.length)h+="<div style=\"text-align:center;padding:20px 8px;color:var(--tx3);font-size:11px\"><i class=\"fa-solid fa-inbox\" style=\"display:block;font-size:20px;opacity:.2;margin-bottom:6px\"></i>Empty</div>";
      else cJ.forEach(function(j){h+=_kbCard(j);});
      h+="</div></div>";
    });
    h+="</div>";
  }else if(_jMod==="tbl"){
    h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Job ID</th><th>Description</th><th>Party</th><th>Machine</th><th>P</th><th>Cut</th><th>Print</th><th>Dispatch</th><th>Status</th><th>Due Date</th>"+(role!=="viewer"?"<th>Actions</th>":"")+"</tr></thead><tbody>";
    flt.forEach(function(j){h+=_jRow(j,role);});
    h+="</tbody></table></div>";
  }else{
    flt.forEach(function(j){h+=_jCard(j,role!=="viewer");});
  }
  _html(h);
}
function _jFltFn(f){_jFlt=f;_vJobs();}
function _jSrchFn(v){_jSrc=v;}
function _jModFn(m){_jMod=m;_vJobs();}

/* HISTORY */
function _vHist(){
  var role=_U?_U.role:"viewer";
  var jbs=_D.jobs||[];
  if(role==="operator")jbs=jbs.filter(function(j){return j["Machine Assigned"]===(_U.machine||"")&&j["Print Status"]==="Done";});
  else if(role==="cutting")jbs=jbs.filter(function(j){return j["Cut Status"]==="Done";});
  jbs=jbs.slice().reverse();
  var h="<div class=\"sh\"><div class=\"sh-t\">History <span class=\"sh-c\">"+jbs.length+"</span></div></div>";
  if(!jbs.length)h="<div class=\"empty\"><i class=\"fa-solid fa-clock-rotate-left\"></i><h3>No history yet</h3><p>Completed jobs appear here</p></div>";
  else jbs.forEach(function(j){h+=_jCard(j,false);});
  _html(h);
}

/* PARTIES */
function _vParties(){
  var role=_U?_U.role:"viewer";
  if(role==="admin"){_fab=_mNewParty;ef("fab",function(e){e.classList.add("on");});}
  var pts=_D.parties||[];
  _html("<div class=\"srch\"><i class=\"fa-solid fa-magnifying-glass\"></i><input id=\"ptSrch\" placeholder=\"Search party name, contact...\" oninput=\"_ptRender(this.value)\"></div><div id=\"ptList\"></div>");
  window._ptRender=function(q){
    q=(q||"").toLowerCase();
    var flt=pts.filter(function(p){return!q||(p["Party Name"]||"").toLowerCase().indexOf(q)>=0||(p["Contact Person 1"]||"").toLowerCase().indexOf(q)>=0;});
    var out="<div class=\"sh\" style=\"margin-bottom:8px\"><div class=\"sh-t\">Parties <span class=\"sh-c\">"+flt.length+"</span></div></div>";
    if(!flt.length){out+="<div class=\"empty\"><i class=\"fa-solid fa-building-user\"></i><h3>No parties</h3><p>Add your first party</p></div>";}
    else{
      out+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Party</th><th>Contact</th><th>Mobile</th><th>GST</th><th>City</th><th>Jobs</th><th>Outstanding</th><th>Status</th><th></th></tr></thead><tbody>";
      flt.forEach(function(p){
        var st=p["Status"]||"Active", jcnt=(_D.jobs||[]).filter(function(j){return j["Party ID"]===p["Party ID"];}).length;
        var xid=(p["Party ID"]||"").replace(/"/g,"&quot;"), ob=_n(p["Outstanding Balance (Rs)"]);
        out+="<tr onclick=\"_mPD('"+xid+"')\">"
          +"<td><div style=\"display:flex;align-items:center;gap:9px\"><div style=\"width:34px;height:34px;border-radius:9px;background:var(--BL);display:flex;align-items:center;justify-content:center;color:var(--B);font-weight:800;font-size:13px;flex-shrink:0\">"+(p["Party Name"]||"?")[0]+"</div><div><div style=\"font-weight:700\">"+_e(p["Party Name"]||"--")+"</div><div style=\"font-size:10px;color:var(--tx3)\">"+_e(p["Party ID"]||"")+"</div></div></div></td>"
          +"<td>"+_e(p["Contact Person 1"]||"--")+"</td>"
          +"<td style=\"white-space:nowrap\">"+_e(p["Mobile 1"]||"--")+"</td>"
          +"<td style=\"font-size:10px;color:var(--tx3)\">"+_e(p["GST Number"]||"--")+"</td>"
          +"<td>"+_e(p["Billing City"]||p["City"]||"--")+"</td>"
          +"<td style=\"font-weight:700\">"+jcnt+"</td>"
          +"<td style=\"font-weight:700;color:"+(ob>0?"#DC2626":"#15803D")+"\">&#8377;"+_f(ob)+"</td>"
          +"<td><span class=\"badge "+(st==="Active"?"bg":st==="Blacklisted"?"br":"bx")+"\">"+st+"</span></td>"
          +"<td onclick=\"event.stopPropagation()\">";
        if(p["WhatsApp 1"]){var wn=(p["WhatsApp 1"]||"").replace(/"/g,"&quot;"),cn=(p["Contact Person 1"]||"").replace(/"/g,"&quot;");out+="<button class=\"wa-btn btn-sm\" onclick=\"_waP('"+wn+"','"+cn+"')\"><i class=\"fa-brands fa-whatsapp\"></i></button>";}
        out+="</td></tr>";
      });
      out+="</tbody></table></div>";
    }
    var pl=el("ptList");if(pl)pl.innerHTML=out;
  };
  window._ptRender("");
}

/* STOCK */
function _vStock(){
  var role=_U?_U.role:"viewer";
  if(role==="admin"||role==="supervisor"){_fab=_mStockIn;ef("fab",function(e){e.classList.add("on");});}
  var stk=(_D.stock||[]).slice().sort(function(a,b){return _n(b["Usage %  (Formula)"])-_n(a["Usage %  (Formula)"]);});
  var h="<div class=\"kpi-row\">"+_kpi("Available",""+stk.filter(function(s){return s["Status"]==="Available";}).length,"fa-check-circle","#34A853","rgba(52,168,83,.12)")+_kpi("Partial",""+stk.filter(function(s){return s["Status"]==="Partial";}).length,"fa-circle-half-stroke","#FBBC05","rgba(251,188,5,.14)")+_kpi("Empty",""+stk.filter(function(s){return s["Status"]==="Empty";}).length,"fa-box-open","#EA4335","rgba(234,67,53,.12)")+_kpi("Total",""+stk.length,"fa-boxes-stacked","#4285F4","rgba(66,133,244,.12)")+"</div>";
  if(!stk.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-boxes-stacked\"></i><h3>No stock</h3><p>Add stock inward entries</p></div>";_html(h);return;}
  h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Stock ID</th><th>Paper Type</th><th>Party</th><th>Size</th><th>GSM</th><th>Good Gross</th><th>Remaining</th><th>Usage</th><th>Status</th></tr></thead><tbody>";
  stk.forEach(function(s){
    var pct=Math.min(100,_n(s["Usage %  (Formula)"])),rem=_n(s["Remaining Gross (Formula)"]),good=_n(s["Good Gross"]);
    var st=s["Status"]||"Available",bc=pct>=80?"#DC2626":pct>=50?"#D97706":"#15803D";
    h+="<tr><td><b>"+_e(s["Stock ID"]||"--")+"</b></td><td>"+_e(s["Paper Type"]||"--")+"</td><td>"+_e(s["Party Name"]||"--")+"</td><td style=\"white-space:nowrap\">"+_e(s["Sheet Size (inches)"]||"--")+"</td><td>"+_e(s["GSM (Weight)"]||"--")+"</td><td style=\"font-weight:700\">"+good.toFixed(0)+"</td><td style=\"font-weight:700;color:"+(pct>=80?"#DC2626":"var(--tx)")+"\">"+rem.toFixed(0)+"</td>"
      +"<td style=\"min-width:110px\"><div style=\"display:flex;align-items:center;gap:6px\"><div class=\"prog\" style=\"flex:1\"><div class=\"prog-b\" style=\"width:"+pct.toFixed(0)+"%;background:"+bc+"\"></div></div><span style=\"font-size:10px;font-weight:700;color:"+bc+"\">"+pct.toFixed(0)+"%</span></div></td>"
      +"<td><span class=\"badge "+(st==="Available"?"bg":st==="Partial"?"bo":"br")+"\">"+st+"</span></td></tr>";
  });
  h+="</tbody></table></div>";
  _html(h);
}

/* INVOICES */
function _vInvoices(){
  var role=_U?_U.role:"viewer";
  var inv=(_D.invoices||[]).slice().reverse();
  var pend=inv.filter(function(i){return i["Status"]==="Pending";}),ovd=inv.filter(function(i){return i["Status"]==="Overdue";}),paid=inv.filter(function(i){return i["Status"]==="Paid";});
  var tPend=pend.reduce(function(s,i){return s+_n(i["Net Payable (Formula)"]||i["Net Payable"]);},0);
  var flt2=_vInvoices._f||"all";
  var h="<div class=\"kpi-row\">"+_kpi("Pending",""+pend.length,"fa-hourglass-half","#FBBC05","rgba(251,188,5,.14)")+_kpi("Overdue",""+ovd.length,"fa-circle-exclamation","#EA4335","rgba(234,67,53,.12)")+_kpi("Paid",""+paid.length,"fa-circle-check","#34A853","rgba(52,168,83,.12)")+_kpi("Due Amount","&#8377;"+_f(tPend),"fa-indian-rupee-sign","#4285F4","rgba(66,133,244,.12)")+"</div>";
  h+="<div class=\"frow\"><div class=\"pill"+(flt2==="all"?" on":"")+"\" onclick=\"_vIF('all')\">All ("+inv.length+")</div><div class=\"pill"+(flt2==="Pending"?" on":"")+"\" onclick=\"_vIF('Pending')\">Pending</div><div class=\"pill"+(flt2==="Overdue"?" on":"")+"\" onclick=\"_vIF('Overdue')\">Overdue</div><div class=\"pill"+(flt2==="Paid"?" on":"")+"\" onclick=\"_vIF('Paid')\">Paid</div></div>";
  var fl=flt2==="all"?inv:inv.filter(function(i){return i["Status"]===flt2;});
  if(!fl.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-file-invoice\"></i><h3>No invoices</h3><p>Invoices appear after dispatch and billing</p></div>";_html(h);return;}
  h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Invoice No.</th><th>Party</th><th>Date</th><th>Due Date</th><th>Amount</th><th>Net Payable</th><th>Status</th><th>Actions</th></tr></thead><tbody>";
  fl.forEach(function(i2){
    var st=i2["Status"]||"Pending",stC=st==="Paid"?"bg":st==="Overdue"?"br":st==="Partial"?"bo":"bb";
    var pt=(_D.parties||[]).filter(function(p){return p["Party ID"]===i2["Party ID"];})[0]||{};
    var wa=pt["WhatsApp 1"]||pt["Mobile 1"]||"",np=_n(i2["Net Payable (Formula)"]||i2["Net Payable"]);
    var xi=(i2["Invoice No."]||"").replace(/"/g,"&quot;");
    h+="<tr onclick=\"_mID('"+xi+"')\">"
      +"<td><b>"+_e(i2["Invoice No."]||"--")+"</b></td><td>"+_e(i2["Party Name"]||"--")+"</td>"
      +"<td style=\"white-space:nowrap;font-size:11px\">"+_e(i2["Invoice Date"]||"--")+"</td>"
      +"<td style=\"white-space:nowrap;font-size:11px;"+(st==="Overdue"?"color:#DC2626;font-weight:700":"")+"\">"+_e(i2["Due Date"]||"--")+"</td>"
      +"<td style=\"font-weight:700\">&#8377;"+_f(_n(i2["Final Amount"]))+"</td>"
      +"<td style=\"color:#1D4ED8;font-weight:700\">&#8377;"+_f(np)+"</td>"
      +"<td><span class=\"badge "+stC+"\">"+st+"</span></td>"
      +"<td onclick=\"event.stopPropagation()\" style=\"white-space:nowrap\">";
    if(role==="admin"&&st!=="Paid")h+="<button class=\"btn btn-sm btnG\" onclick=\"_mPay('"+xi+"')\"><i class=\"fa-solid fa-indian-rupee-sign\"></i> Pay</button> ";
    if(wa&&role!=="viewer"){var wn=(wa||"").replace(/"/g,"&quot;"),cn=(pt["Contact Person 1"]||"").replace(/"/g,"&quot;"),dd=_e(i2["Due Date"]||"");h+="<button class=\"wa-btn btn-sm\" onclick=\"_waPR('"+wn+"','"+xi+"','"+_f(np)+"','"+dd+"','"+cn+"')\"><i class=\"fa-brands fa-whatsapp\"></i></button>";}
    h+="</td></tr>";
  });
  h+="</tbody></table></div>";
  _html(h);
}
_vInvoices._f="all";
function _vIF(f){_vInvoices._f=f;_vInvoices();}

/* PAYMENTS */
function _vPayments(){
  var pays=(_D.payments||[]).slice().reverse();
  var total=pays.reduce(function(s,p){return s+_n(p["Amount Received (Rs)"]);},0);
  var h="<div class=\"kpi-row\">"+_kpi("Total Receipts",""+pays.length,"fa-receipt","#4285F4","rgba(66,133,244,.12)")+_kpi("Total Received","&#8377;"+_f(total),"fa-money-bill-wave","#34A853","rgba(52,168,83,.12)")+"</div>";
  if(!pays.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-indian-rupee-sign\"></i><h3>No payments</h3><p>Payments appear here</p></div>";_html(h);return;}
  h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Pay ID</th><th>Date</th><th>Party</th><th>Invoice</th><th>Amount</th><th>Mode</th><th>TDS</th><th>Reference</th></tr></thead><tbody>";
  pays.forEach(function(p){
    h+="<tr><td><b>"+_e(p["Payment ID"]||"--")+"</b></td><td style=\"white-space:nowrap;font-size:11px\">"+_e(p["Payment Date"]||"--")+"</td><td>"+_e(p["Party Name"]||"--")+"</td><td>"+_e(p["Invoice No."]||"--")+"</td><td style=\"font-weight:800;color:#15803D\">&#8377;"+_f(_n(p["Amount Received (Rs)"]))+"</td><td><span class=\"badge bb\">"+_e(p["Payment Mode"]||"--")+"</span></td><td>&#8377;"+_f(_n(p["TDS Deducted (Rs)"]))+"</td><td style=\"font-size:11px;color:var(--tx3)\">"+_e(p["Reference No. / UTR / Cheque No."]||"--")+"</td></tr>";
  });
  h+="</tbody></table></div>";
  _html(h);
}

/* EXPENSES */
function _vExpenses(){
  var role=_U?_U.role:"viewer";
  if(role==="admin"||role==="supervisor"){_fab=_mNewExp;ef("fab",function(e){e.classList.add("on");});}
  var exps=(_D.expenses||[]).slice().reverse();
  var total=exps.reduce(function(s,e2){return s+_n(e2["Total (Formula)"]);},0);
  var byCat={};exps.forEach(function(e2){var cat=e2["Category"]||"Other";byCat[cat]=(byCat[cat]||0)+_n(e2["Total (Formula)"]);});
  var h="<div class=\"kpi-row\">"+_kpi("Expenses",""+exps.length,"fa-receipt","#FBBC05","rgba(251,188,5,.14)")+_kpi("Total Spend","&#8377;"+_f(total),"fa-money-bill","#EA4335","rgba(234,67,53,.12)")+"</div>";
  var cks=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a];});
  if(cks.length){var mx=Math.max.apply(null,cks.map(function(k){return byCat[k];})),cc=["#FBBC05","#4285F4","#34A853","#EA4335","#7C3AED","#0D9488"];h+="<div class=\"card\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-chart-bar\"></i>By Category</div></div><div class=\"cb\"><div class=\"cbg\">";cks.forEach(function(k,i){h+="<div class=\"cbr\"><span class=\"cbl\">"+_e(k)+"</span><div class=\"cbt\"><div class=\"cbf\" style=\"width:"+(byCat[k]/mx*100).toFixed(0)+"%;background:"+cc[i%cc.length]+"\"></div></div><span class=\"cbv\">&#8377;"+_f(byCat[k])+"</span></div>";});h+="</div></div></div>";}
  if(!exps.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-receipt\"></i><h3>No expenses</h3><p>Log factory expenses here</p></div>";_html(h);return;}
  h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Vendor</th><th>Qty</th><th>Rate</th><th>Total</th><th>GST</th><th>Mode</th></tr></thead><tbody>";
  exps.forEach(function(e2){
    h+="<tr><td style=\"white-space:nowrap;font-size:11px\">"+_e(e2["Date"]||"--")+"</td><td><span class=\"badge bo\">"+_e(e2["Category"]||"--")+"</span></td><td>"+_e(e2["Item Description"]||e2["Description"]||"--")+"</td><td>"+_e(e2["Vendor Name"]||e2["Vendor"]||"--")+"</td><td>"+_e(e2["Quantity"]||e2["Qty"]||"--")+"</td><td>&#8377;"+_f(_n(e2["Rate per Unit (Rs)"]||e2["Rate"]))+"</td><td style=\"font-weight:700;color:#DC2626\">&#8377;"+_f(_n(e2["Total (Formula)"]))+"</td><td>"+_e(e2["GST %"]||"--")+"%</td><td>"+_e(e2["Payment Mode"]||e2["Mode"]||"--")+"</td></tr>";
  });
  h+="</tbody></table></div>";
  _html(h);
}

/* MACHINES */
function _vMachines(){
  var machs=_D.machines||[],jbs=_D.jobs||[];
  if(!machs.length){_html("<div class=\"empty\"><i class=\"fa-solid fa-gears\"></i><h3>No machines</h3><p>Add machines in your Google Sheet</p></div>");return;}
  var h="<div class=\"dg3\">";
  machs.forEach(function(m){
    var nm=m["Machine Name"]||"--",st=m["Current Status"]||"Active";
    var actJ=jbs.filter(function(j){return j["Machine Assigned"]===nm&&j["Print Status"]==="In Progress";}).length;
    var totJ=jbs.filter(function(j){return j["Machine Assigned"]===nm;}).length;
    var compJ=jbs.filter(function(j){return j["Machine Assigned"]===nm&&j["Job Status"]==="Complete";}).length;
    var maint=m["Next Maintenance Due"]||"",mOD=maint&&maint<=_today();
    h+="<div class=\"card\" style=\"margin-bottom:0\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-gears\"></i>"+_e(nm)+"</div><span class=\"badge "+(st==="Active"?"bg":st==="On Repair"?"br":"bx")+"\">"+st+"</span></div>"
      +"<div class=\"cb\"><div class=\"ir\"><span class=\"ir-l\">Brand/Model</span><span class=\"ir-v\">"+_e(m["Make/Brand"]||m["Brand"]||"--")+"</span></div>"
      +"<div class=\"ir\"><span class=\"ir-l\">Operator</span><span class=\"ir-v\">"+_e(m["Assigned Operator"]||m["Operator"]||"--")+"</span></div>"
      +"<div class=\"ir\"><span class=\"ir-l\">Active Jobs</span><span class=\"ir-v\"><span class=\"badge "+(actJ?"bb":"bx")+"\">"+actJ+"</span></span></div>"
      +"<div class=\"ir\"><span class=\"ir-l\">Total / Done</span><span class=\"ir-v\"><b>"+totJ+"</b> / "+compJ+"</span></div>"
      +"<div class=\"ir\"><span class=\"ir-l\">Next Maint.</span><span class=\"ir-v\" style=\""+(mOD?"color:#DC2626;font-weight:700":"")+"\">"+_e(maint||"Not set")+(mOD?" &#9888;":"")+"</span></div>"
      +(mOD?"<div class=\"al danger\" style=\"margin:10px 0 0\"><i class=\"fa-solid fa-wrench\"></i><b>Maintenance overdue!</b></div>":"")
      +"<div style=\"margin-top:12px\"><div class=\"prog\"><div class=\"prog-b\" style=\"width:"+(totJ?Math.min(100,(actJ/totJ)*100):0).toFixed(0)+"%;background:#4285F4\"></div></div></div>"
      +"</div></div>";
  });
  h+="</div>";
  _html(h);
}

/* QC */
function _vQC(){
  var role=_U?_U.role:"viewer";
  if(role==="admin"||role==="supervisor"){_fab=_mNewQC;ef("fab",function(e){e.classList.add("on");});}
  var qcs=(_D.qc||[]).slice().reverse();
  var passed=qcs.filter(function(q){return q["Pass/Fail"]==="Pass";}).length;
  var failed=qcs.filter(function(q){return q["Pass/Fail"]==="Fail";}).length;
  var h="<div class=\"kpi-row\">"+_kpi("Total QC",""+qcs.length,"fa-magnifying-glass-chart","#4285F4","rgba(66,133,244,.12)")+_kpi("Pass",""+passed,"fa-circle-check","#34A853","rgba(52,168,83,.12)")+_kpi("Fail",""+failed,"fa-circle-xmark","#EA4335","rgba(234,67,53,.12)")+_kpi("Pass Rate",""+(qcs.length?Math.round(passed/qcs.length*100):0)+"%","fa-percent","#7C3AED","rgba(124,58,237,.12)",qcs.length+" inspections")+"</div>";
  if(!qcs.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-magnifying-glass-chart\"></i><h3>No QC entries</h3><p>Add QC after printing is done</p></div>";_html(h);return;}
  h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>QC ID</th><th>Job</th><th>Stage</th><th>Color</th><th>Register</th><th>Ink</th><th>Cut</th><th>Score</th><th>Inspected</th><th>Rejected</th><th>Result</th></tr></thead><tbody>";
  qcs.forEach(function(q){
    var sc=_n(q["Overall Score (Formula)"]),pf=q["Pass/Fail"]||"Pending";
    h+="<tr><td><b>"+_e(q["QC ID"]||"--")+"</b></td><td>"+_e(q["Job Name"]||q["Job ID"]||"--")+"</td><td><span class=\"badge bx\">"+_e(q["QC Stage"]||"--")+"</span></td>"
      +"<td>"+_e(q["Color Accuracy (1-5)"]||"--")+"/5</td><td>"+_e(q["Register Accuracy (1-5)"]||"--")+"/5</td><td>"+_e(q["Ink Density (1-5)"]||"--")+"/5</td><td>"+_e(q["Cutting Accuracy (1-5)"]||"--")+"/5</td>"
      +"<td><b style=\"color:"+(sc>=4?"#15803D":sc>=3?"#D97706":"#DC2626")+"\">"+sc.toFixed(1)+"/5</b></td>"
      +"<td>"+_e(q["Total Inspected"]||"--")+"</td><td style=\"color:"+(+q["Rejection Qty"]>0?"#DC2626":"var(--tx)")+"\">"+_e(q["Rejection Qty"]||"0")+"</td>"
      +"<td><span class=\"badge "+(pf==="Pass"?"bg":pf==="Fail"?"br":"bo")+"\">"+pf+"</span></td></tr>";
  });
  h+="</tbody></table></div>";
  _html(h);
}

/* DOWNTIME */
function _vDowntime(){
  _fab=_mNewDT;ef("fab",function(e){e.classList.add("on");});
  var dts=(_D.downtime||[]).slice().reverse();
  var tc=dts.reduce(function(s,d){return s+_n(d["Repair Cost (Rs)"]);},0);
  var prev=dts.filter(function(d){return d["Preventable (Y/N)"]==="Y";}).length;
  var h="<div class=\"kpi-row\">"+_kpi("Events",""+dts.length,"fa-triangle-exclamation","#EA4335","rgba(234,67,53,.12)")+_kpi("Total Cost","&#8377;"+_f(tc),"fa-wrench","#F97316","rgba(249,115,22,.12)")+_kpi("Preventable",""+prev,"fa-shield-halved","#FBBC05","rgba(251,188,5,.14)",dts.length?Math.round(prev/dts.length*100)+"% of events":"")+"</div>";
  if(!dts.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-triangle-exclamation\"></i><h3>No downtime logged</h3><p>Log machine issues here</p></div>";_html(h);return;}
  h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Log ID</th><th>Date</th><th>Machine</th><th>Category</th><th>Description</th><th>Duration</th><th>Cost</th><th>Preventable</th><th>Action</th></tr></thead><tbody>";
  dts.forEach(function(d){
    h+="<tr><td><b>"+_e(d["Log ID"]||"--")+"</b></td><td style=\"white-space:nowrap;font-size:11px\">"+_e(d["Date"]||"--")+"</td><td>"+_e(d["Machine Name"]||"--")+"</td><td><span class=\"badge bo\">"+_e(d["Reason Category"]||"--")+"</span></td>"
      +"<td><div style=\"max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap\">"+_e(d["Reason Description"]||d["Description"]||"--")+"</div></td>"
      +"<td style=\"white-space:nowrap;font-size:11px\">"+_e(d["Downtime Duration"]||d["Duration"]||"--")+"</td>"
      +"<td style=\"color:#DC2626;font-weight:700\">&#8377;"+_f(_n(d["Repair Cost (Rs)"]))+"</td>"
      +"<td><span class=\"badge "+(d["Preventable (Y/N)"]==="Y"?"bg":"br")+"\">"+(d["Preventable (Y/N)"]==="Y"?"Yes":"No")+"</span></td>"
      +"<td style=\"max-width:160px;font-size:11px;color:var(--tx3)\">"+_e(d["Action Taken"]||"--")+"</td></tr>";
  });
  h+="</tbody></table></div>";
  _html(h);
}

/* DISPATCH */
function _vDispatch(){
  var jbs=(_D.jobs||[]).filter(function(j){return j["Print Status"]==="Done"&&j["Dispatch Status"]==="Pending";});
  var h="<div class=\"kpi-row\">"+_kpi("Ready to Ship",""+jbs.length,"fa-truck","#0D9488","rgba(13,148,136,.12)","Jobs awaiting dispatch")+"</div>";
  if(!jbs.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-truck\"></i><h3>All Dispatched!</h3><p>No jobs pending dispatch</p></div>";_html(h);return;}
  jbs.forEach(function(j){
    var pt=(_D.parties||[]).filter(function(p){return p["Party ID"]===j["Party ID"];})[0]||{};
    var xid=(j["Job ID"]||"").replace(/"/g,"&quot;"),qcOk=j["QC Pass/Fail"]==="Pass";
    h+="<div class=\"card\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-clipboard-list\"></i>"+_e(j["Job Name / Description"]||"--")+"</div><span class=\"badge bt\">Ready</span></div>"
      +"<div class=\"cb\"><div class=\"ir\"><span class=\"ir-l\">Job ID</span><span class=\"ir-v\"><b>"+_e(j["Job ID"]||"--")+"</b></span></div>"
      +"<div class=\"ir\"><span class=\"ir-l\">Party</span><span class=\"ir-v\">"+_e(j["Party Name"]||"--")+"</span></div>"
      +"<div class=\"ir\"><span class=\"ir-l\">Machine</span><span class=\"ir-v\">"+_e(j["Machine Assigned"]||"--")+"</span></div>"
      +"<div class=\"ir\"><span class=\"ir-l\">Order Qty</span><span class=\"ir-v\">"+_e(j["Order Qty"]||"--")+"</span></div>"
      +"<div class=\"ir\"><span class=\"ir-l\">QC Status</span><span class=\"ir-v\"><span class=\"badge "+(qcOk?"bg":"bo")+"\">"+(j["QC Pass/Fail"]||"Pending")+"</span></span></div>"
      +(!qcOk?"<div class=\"al warn\"><i class=\"fa-solid fa-triangle-exclamation\"></i>QC not passed -- dispatch with caution</div>":"")
      +"<div style=\"display:flex;gap:8px;margin-top:12px\"><button class=\"btn btnT btn-sm\" style=\"flex:1\" onclick=\"_mDisp('"+xid+"')\"><i class=\"fa-solid fa-truck\"></i> Dispatch</button>";
    if(pt["WhatsApp 1"]){var wn=(pt["WhatsApp 1"]||"").replace(/"/g,"&quot;"),cn=(pt["Contact Person 1"]||"").replace(/"/g,"&quot;");h+="<button class=\"wa-btn btn-sm\" onclick=\"_waP('"+wn+"','"+cn+"')\"><i class=\"fa-brands fa-whatsapp\"></i></button>";}
    h+="</div></div></div>";
  });
  _html(h);
}

/* PLATES */
function _vPlates(){
  var plates=(_D.plates||[]).slice().reverse();
  var h="<div class=\"kpi-row\">"+_kpi("Total Plates",""+plates.length,"fa-layer-group","#4285F4","rgba(66,133,244,.12)")+_kpi("Active",""+plates.filter(function(p){return p["Scrapped (Y/N)"]!=="Y";}).length,"fa-check-circle","#34A853","rgba(52,168,83,.12)")+_kpi("Scrapped",""+plates.filter(function(p){return p["Scrapped (Y/N)"]==="Y";}).length,"fa-trash","#EA4335","rgba(234,67,53,.12)")+"</div>";
  if(!plates.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-layer-group\"></i><h3>No plates</h3><p>Plate records appear here</p></div>";_html(h);return;}
  h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Plate ID</th><th>Job</th><th>Type</th><th>Color</th><th>Date Made</th><th>Reused</th><th>Max</th><th>Status</th></tr></thead><tbody>";
  plates.forEach(function(p){
    var reused=_n(p["Times Reused"]),maxR=_n(p["Max Reuse Allowed"])||5,nearMax=reused>=maxR-1;
    h+="<tr><td><b>"+_e(p["Plate ID"]||"--")+"</b></td><td>"+_e(p["Job Name"]||p["Job ID"]||"--")+"</td><td>"+_e(p["Plate Type"]||"--")+"</td><td><span class=\"badge bb\">"+_e(p["Color (C/M/Y/K/Spot)"]||"--")+"</span></td><td style=\"white-space:nowrap;font-size:11px\">"+_e(p["Date Made"]||"--")+"</td><td style=\"font-weight:700;color:"+(nearMax?"#D97706":"var(--tx)")+"\">"+reused+(nearMax?" &#9888;":"")+"</td><td>"+maxR+"</td><td><span class=\"badge "+(p["Scrapped (Y/N)"]==="Y"?"br":"bg")+"\">"+(p["Scrapped (Y/N)"]==="Y"?"Scrapped":"Active")+"</span></td></tr>";
  });
  h+="</tbody></table></div>";
  _html(h);
}

/* REPORTS */
function _vReports(){
  var jbs=_D.jobs||[],inv=_D.invoices||[],exps=_D.expenses||[],pays=_D.payments||[],dts=_D.downtime||[],qcs=_D.qc||[];
  var tBill=inv.reduce(function(s,i){return s+_n(i["Final Amount"]);},0);
  var tExp=exps.reduce(function(s,e2){return s+_n(e2["Total (Formula)"]);},0);
  var tPaid=pays.reduce(function(s,p){return s+_n(p["Amount Received (Rs)"]);},0);
  var passR=qcs.length?Math.round(qcs.filter(function(q){return q["Pass/Fail"]==="Pass";}).length/qcs.length*100):0;
  var gp=tBill-tExp;
  var h="<div class=\"kpi-row\">"+_kpi("Revenue","&#8377;"+_f(tBill),"fa-indian-rupee-sign","#34A853","rgba(52,168,83,.12)","Total billed")+_kpi("Collected","&#8377;"+_f(tPaid),"fa-circle-check","#4285F4","rgba(66,133,244,.12)","Received")+_kpi("Outstanding","&#8377;"+_f(tBill-tPaid),"fa-hourglass-half","#EA4335","rgba(234,67,53,.12)",inv.filter(function(i){return i["Status"]==="Overdue";}).length+" overdue")+_kpi("QC Pass Rate",""+passR+"%","fa-percent","#7C3AED","rgba(124,58,237,.12)",qcs.length+" checks")+"</div>";
  h+="<div class=\"kpi-row\">"+_kpi("Total Jobs",""+jbs.length,"fa-clipboard-list","#0D9488","rgba(13,148,136,.12)",jbs.filter(function(j){return j["Job Status"]==="Complete";}).length+" complete")+_kpi("Expenses","&#8377;"+_f(tExp),"fa-receipt","#F97316","rgba(249,115,22,.12)","Total spend")+_kpi("Gross Profit","&#8377;"+_f(gp),"fa-scale-balanced",gp>=0?"#34A853":"#EA4335",gp>=0?"rgba(52,168,83,.12)":"rgba(234,67,53,.12)","Revenue - Expenses")+_kpi("Downtime",""+dts.length,"fa-triangle-exclamation","#EA4335","rgba(234,67,53,.12)","&#8377;"+_f(dts.reduce(function(s,d){return s+_n(d["Repair Cost (Rs)"]);},0))+" cost")+"</div>";
  var stM={Complete:0,"In Progress":0,Pending:0,"Dispatch Pending":0};
  jbs.forEach(function(j){var s=j["Job Status"]||"Pending";if(s==="Done - Dispatch Pending")s="Dispatch Pending";if(stM.hasOwnProperty(s))stM[s]++;});
  var stC=["#34A853","#4285F4","#FBBC05","#EA4335"],tot=jbs.length||1,cop=[],cum=0;
  Object.keys(stM).forEach(function(k,i){var p=stM[k]/tot*100;cop.push(stC[i]+" "+cum.toFixed(1)+"% "+(cum+p).toFixed(1)+"%");cum+=p;});
  var mNms=(_D.machines||[]).map(function(m){return m["Machine Name"]||"";}).filter(Boolean);
  if(!mNms.length)mNms=["Machine 1","Machine 2","Machine 3"];
  var mCnt=mNms.map(function(m){return jbs.filter(function(j){return j["Machine Assigned"]===m;}).length;});
  var mMx=Math.max.apply(null,mCnt)||1;
  var pBill={};inv.forEach(function(i){var pt=i["Party Name"]||"Unknown";pBill[pt]=(pBill[pt]||0)+_n(i["Final Amount"]);});
  var topP=Object.keys(pBill).sort(function(a,b){return pBill[b]-pBill[a];}).slice(0,6);
  h+="<div class=\"dg3\" style=\"margin-bottom:14px\">";
  h+="<div class=\"card\" style=\"margin-bottom:0\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-chart-pie\"></i>Job Status</div></div><div class=\"cb\"><div class=\"dn-w\"><div class=\"dn\" style=\"background:conic-gradient("+cop.join(",")+")\"></div><div class=\"dn-lg\">"+Object.keys(stM).map(function(k,i){return"<div class=\"dn-r\"><div class=\"dn-d\" style=\"background:"+stC[i]+"\"></div><span style=\"flex:1\">"+k+"</span><b>"+stM[k]+"</b></div>";}).join("")+"</div></div></div></div>";
  h+="<div class=\"card\" style=\"margin-bottom:0\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-gears\"></i>Jobs / Machine</div></div><div class=\"cb\"><div class=\"cbg\">";
  mNms.forEach(function(m,i){h+="<div class=\"cbr\"><span class=\"cbl\">"+_e(m)+"</span><div class=\"cbt\"><div class=\"cbf\" style=\"width:"+(mCnt[i]/mMx*100).toFixed(0)+"%;background:"+["#4285F4","#34A853","#EA4335","#FBBC05"][i%4]+"\"></div></div><span class=\"cbv\">"+mCnt[i]+"</span></div>";});
  h+="</div></div></div>";
  h+="<div class=\"card\" style=\"margin-bottom:0\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-trophy\"></i>Top Parties</div></div><div class=\"cb\"><div class=\"cbg\">";
  if(topP.length){var tpMx=pBill[topP[0]]||1;topP.forEach(function(pt){h+="<div class=\"cbr\"><span class=\"cbl\">"+_e(pt)+"</span><div class=\"cbt\"><div class=\"cbf\" style=\"width:"+(pBill[pt]/tpMx*100).toFixed(0)+"%;background:#4285F4\"></div></div><span class=\"cbv\">&#8377;"+_f(pBill[pt])+"</span></div>";});}
  else h+="<div style=\"color:var(--tx3);font-size:12px;text-align:center;padding:20px 0\">No invoice data</div>";
  h+="</div></div></div></div>";
  h+="<div class=\"card\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-scale-balanced\"></i>P&amp;L Summary</div></div><div class=\"cb\">"
    +"<div class=\"ir\"><span class=\"ir-l\">Revenue Billed</span><span class=\"ir-v\" style=\"color:#15803D;font-weight:700\">&#8377;"+_f(tBill)+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Payments Collected</span><span class=\"ir-v\" style=\"color:#1D4ED8;font-weight:700\">&#8377;"+_f(tPaid)+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Outstanding</span><span class=\"ir-v\" style=\"color:#DC2626;font-weight:700\">&#8377;"+_f(tBill-tPaid)+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Total Expenses</span><span class=\"ir-v\" style=\"color:#D97706;font-weight:700\">&#8377;"+_f(tExp)+"</span></div>"
    +"<div class=\"ir\" style=\"border-bottom:none;padding-top:14px;margin-top:6px;border-top:2px solid var(--bdr)\"><span class=\"ir-l\" style=\"font-weight:800;font-size:14px\">Gross Profit</span><span class=\"ir-v\" style=\"color:"+(gp>=0?"#15803D":"#DC2626")+";font-weight:900;font-size:20px\">&#8377;"+_f(gp)+"</span></div>"
    +"</div></div>";
  _html(h);
}

/* STAFF */
function _vStaff(){
  var users=_D.users||[];
  var rc={admin:"#EA4335",supervisor:"#7C3AED",operator:"#4285F4",cutting:"#F97316",viewer:"#0D9488"};
  var h="<div class=\"kpi-row\">"+_kpi("Total Staff",""+users.length,"fa-users","#4285F4","rgba(66,133,244,.12)")+_kpi("Active",""+users.filter(function(u){return u["Active (Y/N)"]==="Y";}).length,"fa-circle-check","#34A853","rgba(52,168,83,.12)")+"</div>";
  if(!users.length){h+="<div class=\"empty\"><i class=\"fa-solid fa-id-badge\"></i><h3>No staff</h3><p>Add users to the Users sheet</p></div>";_html(h);return;}
  h+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Machine</th><th>WhatsApp</th><th>Status</th></tr></thead><tbody>";
  users.forEach(function(u){
    var role2=(u["Role"]||"").toLowerCase(),c=rc[role2]||"#94A3B8";
    h+="<tr><td><div style=\"display:flex;align-items:center;gap:9px\"><div style=\"width:34px;height:34px;border-radius:50%;background:"+c+";color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0\">"+(u["Full Name"]||u["Name"]||"?")[0].toUpperCase()+"</div><b>"+_e(u["Full Name"]||u["Name"]||"--")+"</b></div></td>"
      +"<td style=\"font-size:11px;color:var(--tx3)\">"+_e(u["Personal Email"]||u["Email"]||"--")+"</td>"
      +"<td><span class=\"badge bb\">"+_rl(role2)+"</span></td>"
      +"<td>"+_e(u["Machine Assigned"]||u["Machine"]||"--")+"</td>"
      +"<td style=\"font-size:11px\">"+_e(u["WhatsApp"]||"--")+"</td>"
      +"<td><span class=\"badge "+(u["Active (Y/N)"]==="Y"?"bg":"bx")+"\">"+(u["Active (Y/N)"]==="Y"?"Active":"Inactive")+"</span></td></tr>";
  });
  h+="</tbody></table></div>";
  _html(h);
}

/* JOB LOG */
function _vJobLog(){
  var jbs=(_D.jobs||[]).slice().reverse();
  _html("<div class=\"srch\"><i class=\"fa-solid fa-magnifying-glass\"></i><input id=\"jlS\" placeholder=\"Search job ID, description, party...\" oninput=\"_jlRender(this.value)\"></div><div id=\"jlList\"></div>");
  window._jlRender=function(q){
    q=(q||"").toLowerCase();
    var flt=jbs.filter(function(j){return!q||(j["Job ID"]||"").toLowerCase().indexOf(q)>=0||(j["Job Name / Description"]||"").toLowerCase().indexOf(q)>=0||(j["Party Name"]||"").toLowerCase().indexOf(q)>=0;});
    var out="<div class=\"sh\" style=\"margin-bottom:8px\"><div class=\"sh-t\">Job Log <span class=\"sh-c\">"+flt.length+"</span></div></div>";
    if(!flt.length){out+="<div class=\"empty\"><i class=\"fa-solid fa-scroll\"></i><h3>No jobs found</h3><p>Try a different search</p></div>";}
    else{
      out+="<div class=\"tw\"><table class=\"tbl\"><thead><tr><th>Job ID</th><th>Description</th><th>Party</th><th>Machine</th><th>P</th><th>Cut</th><th>Print</th><th>QC</th><th>Dispatch</th><th>Status</th><th>Entry</th><th>Promised</th></tr></thead><tbody>";
      flt.forEach(function(j){
        var pri=parseInt(j["Priority"]||j["Priority (1-5)"]||3)||3,ac=_priC(pri);
        var dl=(j["Delay Flag"]==="DELAYED"||j["Delay Flag (Formula)"]==="DELAYED");
        var xid=(j["Job ID"]||"").replace(/"/g,"&quot;");
        out+="<tr onclick=\"_mJD('"+xid+"')\">"
          +"<td><div style=\"display:flex;align-items:center;gap:5px\"><div style=\"width:3px;height:22px;background:"+ac+";border-radius:2px;flex-shrink:0\"></div><b>"+_e(j["Job ID"]||"--")+"</b>"+(dl?"<span style=\"color:#EA4335\">&#9888;</span>":"")+"</div></td>"
          +"<td><div style=\"overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px;font-weight:600\">"+_e(j["Job Name / Description"]||"--")+"</div></td>"
          +"<td>"+_e(j["Party Name"]||"--")+"</td><td>"+_e(j["Machine Assigned"]||"--")+"</td>"
          +"<td><span class=\"badge "+(pri==1?"br":pri==2?"bo":"bb")+"\">P"+pri+"</span></td>"
          +"<td><span class=\"badge "+_cBadge(j["Cut Status"]||"Pending")+"\">"+_e(j["Cut Status"]||"--")+"</span></td>"
          +"<td><span class=\"badge "+_pBadge(j["Print Status"]||"Pending")+"\">"+_e(j["Print Status"]||"--")+"</span></td>"
          +"<td><span class=\"badge "+(j["QC Pass/Fail"]==="Pass"?"bg":j["QC Done (Y/N)"]?"bo":"bx")+"\">"+_e(j["QC Pass/Fail"]||"--")+"</span></td>"
          +"<td><span class=\"badge "+(j["Dispatch Status"]==="Done"?"bg":"bx")+"\">"+_e(j["Dispatch Status"]||"--")+"</span></td>"
          +"<td>"+_stBadge(j["Job Status"]||"Pending")+"</td>"
          +"<td style=\"white-space:nowrap;font-size:10px;color:var(--tx3)\">"+_e(j["Entry Date"]||"--")+"</td>"
          +"<td style=\"white-space:nowrap;font-size:10px\">"+_e(j["Promised Date"]||"--")+"</td></tr>";
      });
      out+="</tbody></table></div>";
    }
    var jl=el("jlList");if(jl)jl.innerHTML=out;
  };
  window._jlRender("");
}

/* SETTINGS */
function _vSettings(){
  var h="<div class=\"dg2\" style=\"margin-bottom:12px\">"
    +"<div class=\"card\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-server\"></i>Connection</div></div><div class=\"cb\">"
    +(_ok()?"<div class=\"al ok\" style=\"margin-bottom:0\"><i class=\"fa-solid fa-circle-check\"></i><div><b>GAS Connected</b><div style=\"font-size:11px;margin-top:2px;word-break:break-all\">"+_e(GAS_URL)+"</div></div></div>":"<div class=\"al warn\" style=\"margin-bottom:0\"><i class=\"fa-solid fa-triangle-exclamation\"></i><div><b>Not Connected</b><div style=\"font-size:11px;margin-top:2px\">Replace GAS_URL in app.js line 3 with your deployment URL.</div></div></div>")
    +"</div></div>"
    +"<div class=\"card\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-user-circle\"></i>Account</div></div><div class=\"cb\">"
    +"<div class=\"ir\"><span class=\"ir-l\">Name</span><span class=\"ir-v\"><b>"+_e(_U.name||"--")+"</b></span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Email</span><span class=\"ir-v\" style=\"font-size:11px\">"+_e(_U.email||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Role</span><span class=\"ir-v\"><span class=\"badge bb\">"+_rl(_U.role)+"</span></span></div>"
    +(_U.machine?"<div class=\"ir\"><span class=\"ir-l\">Machine</span><span class=\"ir-v\">"+_e(_U.machine)+"</span></div>":"")
    +"</div></div></div>"
    +"<div class=\"dg2\" style=\"margin-bottom:12px\">"
    +"<div class=\"card\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-brands fa-whatsapp\" style=\"color:#16A34A\"></i>WhatsApp</div></div><div class=\"cb\">"
    +"<div class=\"ir\"><span class=\"ir-l\">Service</span><span class=\"ir-v\">MessageAutoSender API</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Account</span><span class=\"ir-v\">nationalenterprises</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Status</span><span class=\"ir-v\"><span class=\"badge "+(_ok()?"bg":"bx")+"\">"+(_ok()?"Active":"Inactive")+"</span></span></div>"
    +"</div></div>"
    +"<div class=\"card\"><div class=\"ch\"><div class=\"ct\"><i class=\"fa-solid fa-circle-info\"></i>App Info</div></div><div class=\"cb\">"
    +"<div class=\"ir\"><span class=\"ir-l\">App Name</span><span class=\"ir-v\"><b>NM Print ERP</b></span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Version</span><span class=\"ir-v\">v6.0 Final</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Backend</span><span class=\"ir-v\">Google Apps Script + Sheets</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Built by</span><span class=\"ir-v\">Autoworkflow</span></div>"
    +"</div></div></div>"
    +"<button class=\"btn btnR btn-fw\" onclick=\"_out()\"><i class=\"fa-solid fa-right-from-bracket\"></i> Sign Out</button>";
  _html(h);
}
/* -- MODALS -- */
function _mOpen(tl,bd,ft){
  document.getElementById("mTl").textContent=tl;
  var mb=document.getElementById("mBd"); if(mb){mb.innerHTML=bd;mb.scrollTop=0;}
  var mf=document.getElementById("mFt"); if(mf){if(ft){mf.innerHTML=ft;mf.style.display="flex";}else{mf.innerHTML="";mf.style.display="none";}}
  ef("mOv",function(e){e.classList.add("on");}); ef("modal",function(e){e.classList.add("on");});
}
function _mClose(){ef("mOv",function(e){e.classList.remove("on");});ef("modal",function(e){e.classList.remove("on");});}
function _mLoad(){ef("mFt",function(e){e.innerHTML="<button class=\"btn btnX btn-fw\" disabled><i class=\"fa-solid fa-spinner fa-spin\"></i> Saving...</button>";});}

/* JOB DETAIL */
function _mJD(jid){
  var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===jid;})[0];
  if(!j){_t("Job not found");return;}
  var role=_U?_U.role:"viewer";
  var cs=j["Cut Status"]||"Pending",ps=j["Print Status"]||"Pending",ds=j["Dispatch Status"]||"Pending",qpf=j["QC Pass/Fail"]||"--";
  var steps=[{l:"Cut",d:cs==="Done",a:cs==="In Progress"},{l:"Print",d:ps==="Done",a:ps==="In Progress"},{l:"QC",d:qpf==="Pass",a:!!(j["QC Done (Y/N)"]&&qpf!=="Pass")},{l:"Dispatch",d:ds==="Done",a:false},{l:"Invoice",d:!!j["Billed (Y/N)"],a:false}];
  var sh="<div class=\"steps\">";
  steps.forEach(function(s,i){var cls=s.d?"done":s.a?"active":"wait";sh+="<div class=\"si\"><div class=\"si-r\"><div class=\"sd "+cls+"\">"+(s.d?"<i class=\"fa-solid fa-check\" style=\"font-size:9px\"></i>":(i+1))+"</div>"+(i<steps.length-1?"<div class=\"sl "+(s.d?"done":"wait")+"\"></div>":"")+"</div><div class=\"si-l\">"+s.l+"</div></div>";});
  sh+="</div>";
  var bd=sh+"<div class=\"fsec\">Job Information</div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Job ID</span><span class=\"ir-v\"><b>"+_e(j["Job ID"]||"--")+"</b></span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Description</span><span class=\"ir-v\">"+_e(j["Job Name / Description"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Party</span><span class=\"ir-v\">"+_e(j["Party Name"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Category</span><span class=\"ir-v\">"+_e(j["Category"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Machine</span><span class=\"ir-v\">"+_e(j["Machine Assigned"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Priority</span><span class=\"ir-v\"><span class=\"badge "+(parseInt(j["Priority"]||j["Priority (1-5)"]||3)<=2?"br":"bb")+"\">P"+(j["Priority"]||j["Priority (1-5)"]||3)+"</span></span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Order Qty</span><span class=\"ir-v\">"+_e(j["Order Qty"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Colors</span><span class=\"ir-v\">"+_e(j["Colors (C/M/Y/K)"]||j["Colors"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Customer PO</span><span class=\"ir-v\">"+_e(j["Customer PO No."]||j["Customer PO"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Entry Date</span><span class=\"ir-v\">"+_e(j["Entry Date"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Promised Date</span><span class=\"ir-v\"><b>"+_e(j["Promised Date"]||"--")+"</b></span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Status</span><span class=\"ir-v\">"+_stBadge(j["Job Status"]||"Pending")+"</span></div>"
    +(j["Supervisor Notes"]?"<div class=\"al info\" style=\"margin-top:12px\"><i class=\"fa-solid fa-note-sticky\"></i>"+_e(j["Supervisor Notes"])+"</div>":"");
  var xid=jid.replace(/"/g,"&quot;");
  var ft="";
  if((role==="cutting"||role==="admin"||role==="supervisor")&&cs!=="Done")ft+="<button class=\"btn btnO btn-sm\" onclick=\"_mClose();_mCut('"+xid+"')\"><i class=\"fa-solid fa-scissors\"></i> Cut</button>";
  if((role==="operator"||role==="admin"||role==="supervisor")&&cs==="Done"&&ps!=="Done")ft+="<button class=\"btn btnB btn-sm\" onclick=\"_mClose();_mPrint('"+xid+"')\"><i class=\"fa-solid fa-print\"></i> Print</button>";
  if((role==="admin"||role==="supervisor")&&ps==="Done"&&!j["QC Done (Y/N)"])ft+="<button class=\"btn btnV btn-sm\" onclick=\"_mClose();_mQCJ('"+xid+"')\"><i class=\"fa-solid fa-search\"></i> QC</button>";
  if((role==="admin"||role==="supervisor")&&ps==="Done"&&qpf==="Pass"&&ds==="Pending")ft+="<button class=\"btn btnT btn-sm\" onclick=\"_mClose();_mDisp('"+xid+"')\"><i class=\"fa-solid fa-truck\"></i> Dispatch</button>";
  if(role==="admin"&&ds==="Done"&&!j["Billed (Y/N)"])ft+="<button class=\"btn btnG btn-sm\" onclick=\"_mClose();_mInv('"+xid+"')\"><i class=\"fa-solid fa-file-invoice\"></i> Invoice</button>";
  _mOpen(j["Job Name / Description"]||jid,bd,ft||"<button class=\"btn btnX btn-sm btn-fw\" onclick=\"_mClose()\">Close</button>");
}
/* NEW JOB */
function _mNewJob(){
  var pts=(_D.parties||[]).filter(function(p){return(p["Status"]||"Active")==="Active";});
  var stk=(_D.stock||[]).filter(function(s){return s["Status"]==="Available"||s["Status"]==="Partial";});
  var machs=(_D.machines||[]).map(function(m){return m["Machine Name"]||"";}).filter(Boolean);
  if(!machs.length)machs=["Machine 1","Machine 2","Machine 3"];
  var bd="<div class=\"fsec\">Job Basics</div>"
    +"<div class=\"fg\"><label>Party *</label><select id=\"njP\"><option value=\"\">-- Select Party --</option>"+pts.map(function(p){return"<option value=\""+_e(p["Party ID"]||"")+"\">"+_e(p["Party Name"]||"")+"</option>";}).join("")+"</select></div>"
    +"<div class=\"fg\"><label>Job Name / Description *</label><input id=\"njN\" placeholder=\"e.g. ABC Mono Carton 300gsm 1000pcs\"></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Category</label><select id=\"njCat\"><option>Mono Carton</option><option>Duplex Carton</option><option>Wrapper</option><option>Brochure</option><option>Catalogue</option><option>Visiting Card</option><option>Sticker</option><option>Label</option><option>Envelope</option><option>Book</option><option>Other</option></select></div><div class=\"fg\"><label>Customer PO No.</label><input id=\"njPO\" placeholder=\"PO-001\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Order Qty *</label><input type=\"number\" id=\"njOQ\" placeholder=\"1000\"></div><div class=\"fg\"><label>Execute Qty</label><input type=\"number\" id=\"njEQ\" placeholder=\"1050\"></div></div>"
    +"<div class=\"fsec\">Material</div>"
    +"<div class=\"fg\"><label>Stock *</label><select id=\"njS\"><option value=\"\">-- Select Stock --</option>"+stk.map(function(s){return"<option value=\""+_e(s["Stock ID"]||"")+"\">"+_e((s["Stock ID"]||"")+" -- "+(s["Paper Type"]||"")+" "+(s["Sheet Size (inches)"]||"")+" "+(s["GSM (Weight)"]||"")+"GSM")+"</option>";}).join("")+"</select></div>"
    +"<div class=\"fsec\">Assignment</div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Machine *</label><select id=\"njM\">"+machs.map(function(m){return"<option>"+_e(m)+"</option>";}).join("")+"</select></div><div class=\"fg\"><label>Priority *</label><select id=\"njPri\"><option value=\"1\">P1 -- Urgent</option><option value=\"2\">P2 -- High</option><option value=\"3\" selected>P3 -- Normal</option><option value=\"4\">P4 -- Low</option><option value=\"5\">P5 -- Later</option></select></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Promised Date *</label><input type=\"date\" id=\"njD\"></div><div class=\"fg\"><label>Colors (C/M/Y/K)</label><input id=\"njCol\" placeholder=\"C,M,Y,K or 4+0\"></div></div>"
    +"<div class=\"fg\"><label>Supervisor Notes</label><textarea id=\"njNote\" placeholder=\"Special instructions...\"></textarea></div>";
  _mOpen("New Production Job",bd,"<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnB btn-sm\" style=\"flex:1\" onclick=\"_svNJ()\"><i class=\"fa-solid fa-plus\"></i> Add Job</button>");
}
function _svNJ(){
  var d={partyId:gv("njP"),jobName:gv("njN"),category:gv("njCat"),orderQty:gv("njOQ"),execQty:gv("njEQ"),stockId:gv("njS"),machine:gv("njM"),priority:gv("njPri"),promDate:gv("njD"),colors:gv("njCol"),custPO:gv("njPO"),note:gv("njNote")};
  if(!d.partyId||!d.jobName||!d.stockId||!d.promDate){_t("Fill all required (*) fields");return;}
  _mLoad();
  _api("addJob",d,function(r){if(r.success){if(_D.jobs&&r.job)_D.jobs.push(r.job);_mClose();_t("Job added!");_go("jobs");}else _t(r.error||"Failed");});
}
/* CUT */
function _mCut(jid){
  var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===jid;})[0];if(!j)return;
  var xid=jid.replace(/"/g,"&quot;");
  _mOpen("Update Cutting -- "+jid,
    "<div class=\"al info\"><i class=\"fa-solid fa-scissors\"></i><b>"+_e(j["Job Name / Description"]||jid)+"</b></div>"
    +"<div class=\"fg\"><label>Cut Status *</label><select id=\"cSt\"><option value=\"Pending\""+(j["Cut Status"]==="Pending"?" selected":"")+">Pending</option><option value=\"In Progress\""+(j["Cut Status"]==="In Progress"?" selected":"")+">In Progress</option><option value=\"Done\""+(j["Cut Status"]==="Done"?" selected":"")+">Done</option></select></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Start Time</label><input type=\"datetime-local\" id=\"cST\"></div><div class=\"fg\"><label>End Time</label><input type=\"datetime-local\" id=\"cET\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Qty Cut</label><input type=\"number\" id=\"cQ\" value=\""+_n(j["Cut Qty"]||0)+"\"></div><div class=\"fg\"><label>Wastage</label><input type=\"number\" id=\"cW\" value=\"0\"></div></div>"
    +"<div class=\"fg\"><label>Remark</label><textarea id=\"cR\">"+_e(j["Cut Remark"]||"")+"</textarea></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnO btn-sm\" style=\"flex:1\" onclick=\"_svCut('"+xid+"')\"><i class=\"fa-solid fa-check\"></i> Save</button>");
}
function _svCut(jid){
  var d={jobId:jid,cutStatus:gv("cSt"),cutStart:gv("cST"),cutEnd:gv("cET"),cutQty:gv("cQ"),wastage:gv("cW"),cutRemark:gv("cR")};
  _mLoad();
  _api("updateCut",d,function(r){if(r.success){var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===jid;})[0];if(j)j["Cut Status"]=d.cutStatus;_mClose();_t("Cut updated!");_go(_V);}else _t(r.error||"Failed");});
}
/* PRINT */
function _mPrint(jid){
  var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===jid;})[0];if(!j)return;
  var xid=jid.replace(/"/g,"&quot;");
  _mOpen("Update Printing -- "+jid,
    "<div class=\"al ok\"><i class=\"fa-solid fa-check\"></i>Cutting done -- ready to print</div>"
    +"<div class=\"fg\"><label>Print Status *</label><select id=\"pSt\"><option value=\"Pending\""+(j["Print Status"]==="Pending"?" selected":"")+">Pending</option><option value=\"In Progress\""+(j["Print Status"]==="In Progress"?" selected":"")+">In Progress</option><option value=\"Done\""+(j["Print Status"]==="Done"?" selected":"")+">Done</option></select></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Start Time</label><input type=\"datetime-local\" id=\"pST\"></div><div class=\"fg\"><label>End Time</label><input type=\"datetime-local\" id=\"pET\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Impressions Run</label><input type=\"number\" id=\"pIR\" value=\""+_n(j["Impressions Run"]||0)+"\"></div><div class=\"fg\"><label>Good Impressions</label><input type=\"number\" id=\"pIG\" value=\""+_n(j["Good Impressions"]||0)+"\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Rejections</label><input type=\"number\" id=\"pRej\" value=\""+_n(j["Rejection Impressions"]||0)+"\"></div><div class=\"fg\"><label>Ink Used (gm)</label><input type=\"number\" id=\"pInk\" value=\"0\"></div></div>"
    +"<div class=\"fg\"><label>Print Remark</label><textarea id=\"pR\">"+_e(j["Print Remark"]||"")+"</textarea></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnB btn-sm\" style=\"flex:1\" onclick=\"_svPrint('"+xid+"')\"><i class=\"fa-solid fa-print\"></i> Save</button>");
}
function _svPrint(jid){
  var d={jobId:jid,printStatus:gv("pSt"),printStart:gv("pST"),printEnd:gv("pET"),impressions:gv("pIR"),goodImp:gv("pIG"),rejectImp:gv("pRej"),inkUsed:gv("pInk"),printRemark:gv("pR")};
  _mLoad();
  _api("updatePrint",d,function(r){if(r.success){var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===jid;})[0];if(j)j["Print Status"]=d.printStatus;_mClose();_t("Print updated!");_go(_V);}else _t(r.error||"Failed");});
}
/* DISPATCH */
function _mDisp(jid){
  var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===jid;})[0];if(!j)return;
  var xid=jid.replace(/"/g,"&quot;");
  _mOpen("Mark Dispatched -- "+jid,
    "<div class=\"al ok\"><i class=\"fa-solid fa-print\"></i>Print done -- ready to dispatch</div>"
    +(j["QC Pass/Fail"]!=="Pass"?"<div class=\"al warn\"><i class=\"fa-solid fa-triangle-exclamation\"></i>QC not passed -- dispatch anyway?</div>":"")
    +"<div class=\"form-row\"><div class=\"fg\"><label>Vehicle No.</label><input id=\"dV\" value=\""+_e(j["Vehicle No."]||"")+"\"></div><div class=\"fg\"><label>Driver Name</label><input id=\"dDr\" value=\""+_e(j["Driver Name"]||"")+"\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>LR Number</label><input id=\"dLR\" value=\""+_e(j["LR Number"]||"")+"\"></div><div class=\"fg\"><label>Expected Delivery</label><input type=\"date\" id=\"dEDD\"></div></div>"
    +"<div class=\"fg\"><label>Dispatch Note</label><textarea id=\"dNt\">"+_e(j["Supervisor Notes"]||"")+"</textarea></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnT btn-sm\" style=\"flex:1\" onclick=\"_svDisp('"+xid+"')\"><i class=\"fa-solid fa-truck\"></i> Mark Dispatched</button>");
}
function _svDisp(jid){
  var d={jobId:jid,vehicleNo:gv("dV"),driverName:gv("dDr"),lrNumber:gv("dLR"),edd:gv("dEDD"),supNote:gv("dNt")};
  _mLoad();
  _api("updateDispatch",d,function(r){
    if(r.success){
      var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===jid;})[0];
      if(j){j["Dispatch Status"]="Done";j["Job Status"]="Done - Dispatch Pending";}
      _mClose();_t("Dispatched!");_go(_V);
      if(j){var pt=(_D.parties||[]).filter(function(p){return p["Party ID"]===j["Party ID"];})[0]||{};var wa=pt["WhatsApp 1"]||pt["Mobile 1"];if(wa)setTimeout(function(){_waDisp(wa,pt["Contact Person 1"]||"",j["Job Name / Description"]||"",jid,_today(),d.vehicleNo,d.lrNumber);},700);}
    }else _t(r.error||"Failed");
  });
}
/* INVOICE */
function _mInv(jid){
  var xid=jid.replace(/"/g,"&quot;");
  _mOpen("Generate Invoice -- "+jid,
    "<div class=\"fg\"><label>Invoice Type</label><select id=\"iT\"><option value=\"Pakka\">Pakka (With GST)</option><option value=\"Kachha\">Kachha (No GST)</option></select></div>"
    +"<div class=\"fg\"><label>Taxable Amount (Rs) *</label><input type=\"number\" id=\"iAmt\" placeholder=\"5000\"></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>CGST %</label><input type=\"number\" id=\"iCG\" value=\"9\"></div><div class=\"fg\"><label>SGST %</label><input type=\"number\" id=\"iSG\" value=\"9\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Discount (Rs)</label><input type=\"number\" id=\"iDis\" value=\"0\"></div><div class=\"fg\"><label>Payment Terms (days)</label><input type=\"number\" id=\"iTP\" value=\"30\"></div></div>"
    +"<div class=\"fg\"><label>Notes</label><textarea id=\"iN\" placeholder=\"Special payment terms...\"></textarea></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnG btn-sm\" style=\"flex:1\" onclick=\"_svInv('"+xid+"')\"><i class=\"fa-solid fa-file-invoice\"></i> Generate</button>");
}
function _svInv(jid){
  var d={jobId:jid,type:gv("iT"),taxable:gv("iAmt"),cgst:gv("iCG"),sgst:gv("iSG"),discount:gv("iDis"),terms:gv("iTP"),note:gv("iN")};
  if(!d.taxable){_t("Enter taxable amount");return;}
  _mLoad();
  _api("addInvoice",d,function(r){if(r.success){var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===jid;})[0];if(j)j["Billed (Y/N)"]=true;if(r.invoice&&_D.invoices)_D.invoices.push(r.invoice);_mClose();_t("Invoice generated!");_go("invoices");}else _t(r.error||"Failed");});
}
/* INVOICE DETAIL */
function _mID(invNo){
  var i2=(_D.invoices||[]).filter(function(i){return i["Invoice No."]===invNo;})[0];if(!i2)return;
  var st=i2["Status"]||"Pending",stC=st==="Paid"?"bg":st==="Overdue"?"br":st==="Partial"?"bo":"bb";
  var np=_n(i2["Net Payable (Formula)"]||i2["Net Payable"]),role=_U?_U.role:"viewer";
  var xi=invNo.replace(/"/g,"&quot;");
  var pt=(_D.parties||[]).filter(function(p){return p["Party ID"]===i2["Party ID"];})[0]||{};
  var wa=pt["WhatsApp 1"]||pt["Mobile 1"]||"";
  var bd="<div style=\"text-align:center;padding:14px 0 18px\"><div style=\"font-size:30px;font-weight:900\">&#8377;"+_f(_n(i2["Final Amount"]))+"</div><span class=\"badge "+stC+"\" style=\"margin-top:8px\">"+st+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Invoice No.</span><span class=\"ir-v\"><b>"+_e(i2["Invoice No."]||"--")+"</b></span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Party</span><span class=\"ir-v\">"+_e(i2["Party Name"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Date</span><span class=\"ir-v\">"+_e(i2["Invoice Date"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Due Date</span><span class=\"ir-v\" style=\""+(st==="Overdue"?"color:#DC2626;font-weight:700":"")+"\">"+_e(i2["Due Date"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Taxable</span><span class=\"ir-v\">&#8377;"+_f(_n(i2["Taxable Amount"]))+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Net Payable</span><span class=\"ir-v\" style=\"color:#1D4ED8;font-weight:800;font-size:15px\">&#8377;"+_f(np)+"</span></div>";
  var ft="<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Close</button>";
  if(role==="admin"&&st!=="Paid")ft+="<button class=\"btn btnG btn-sm\" onclick=\"_mClose();_mPay('"+xi+"')\"><i class=\"fa-solid fa-indian-rupee-sign\"></i> Record Payment</button>";
  if(wa&&role!=="viewer"){var wn=wa.replace(/"/g,"&quot;"),cn=(pt["Contact Person 1"]||"").replace(/"/g,"&quot;"),dd=_e(i2["Due Date"]||"");ft+="<button class=\"wa-btn btn-sm\" onclick=\"_waPR('"+wn+"','"+xi+"','"+_f(np)+"','"+dd+"','"+cn+"')\"><i class=\"fa-brands fa-whatsapp\"></i></button>";}
  _mOpen("Invoice -- "+invNo,bd,ft);
}
/* PAYMENT */
function _mPay(invNo){
  var i2=(_D.invoices||[]).filter(function(i){return i["Invoice No."]===invNo;})[0];if(!i2)return;
  var np=_n(i2["Net Payable (Formula)"]||i2["Net Payable"]),xi=invNo.replace(/"/g,"&quot;");
  _mOpen("Record Payment",
    "<div class=\"al info\"><i class=\"fa-solid fa-file-invoice\"></i>Invoice <b>"+_e(invNo)+"</b> -- Net Payable: <b>&#8377;"+_f(np)+"</b></div>"
    +"<div class=\"fg\"><label>Amount Received (Rs) *</label><input type=\"number\" id=\"pmA\" placeholder=\""+np+"\"></div>"
    +"<div class=\"fg\"><label>Payment Mode *</label><select id=\"pmM\"><option>Cash</option><option>UPI</option><option>NEFT</option><option>RTGS</option><option>Cheque</option></select></div>"
    +"<div class=\"fg\"><label>Reference / UTR No.</label><input id=\"pmR\" placeholder=\"UTR or cheque number\"></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>TDS Deducted (Rs)</label><input type=\"number\" id=\"pmT\" value=\"0\"></div><div class=\"fg\"><label>Date</label><input type=\"date\" id=\"pmDate\" value=\""+_today()+"\"></div></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnG btn-sm\" style=\"flex:1\" onclick=\"_svPay('"+xi+"')\"><i class=\"fa-solid fa-check\"></i> Record</button>");
}
function _svPay(invNo){
  var d={invoiceNo:invNo,amount:gv("pmA"),mode:gv("pmM"),ref:gv("pmR"),tds:gv("pmT"),payDate:gv("pmDate")};
  if(!d.amount||parseFloat(d.amount)<=0){_t("Enter valid amount");return;}
  _mLoad();
  _api("addPayment",d,function(r){if(r.success){_mClose();_t("Payment recorded!");_go("payments");}else _t(r.error||"Failed");});
}
/* STOCK INWARD */
function _mStockIn(){
  var pts=(_D.parties||[]).filter(function(p){return(p["Status"]||"Active")==="Active";});
  _mOpen("Stock Inward",
    "<div class=\"fg\"><label>Party (Supplier) *</label><select id=\"siP\"><option value=\"\">-- Select Supplier --</option>"+pts.map(function(p){return"<option value=\""+_e(p["Party ID"]||"")+"\">"+_e(p["Party Name"]||"")+"</option>";}).join("")+"</select></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Challan No. *</label><input id=\"siCh\" placeholder=\"CH-2501\"></div><div class=\"fg\"><label>Date</label><input type=\"date\" id=\"siCD\" value=\""+_today()+"\"></div></div>"
    +"<div class=\"fsec\">Paper Details</div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Paper Type *</label><select id=\"siPT\"><option>Duplex</option><option>Kraft</option><option>Normal</option><option>Art Paper</option><option>Newsprint</option><option>Bond</option><option>Coated</option><option>Other</option></select></div><div class=\"fg\"><label>GSM *</label><input type=\"number\" id=\"siG\" placeholder=\"300\"></div></div>"
    +"<div class=\"fg\"><label>Sheet Size (inches) *</label><input id=\"siSz\" placeholder=\"27x35 or 20x30\"></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>No. of Bundles *</label><input type=\"number\" id=\"siB\" placeholder=\"12\"></div><div class=\"fg\"><label>Gross per Bundle *</label><input type=\"number\" id=\"siGB\" placeholder=\"4\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Vehicle No.</label><input id=\"siV\" placeholder=\"DL 1AB 1234\"></div><div class=\"fg\"><label>Rack / Location</label><input id=\"siR\" placeholder=\"Rack A1\"></div></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnG btn-sm\" style=\"flex:1\" onclick=\"_svSI()\"><i class=\"fa-solid fa-boxes-stacked\"></i> Add Stock</button>");
}
function _svSI(){
  var d={partyId:gv("siP"),challan:gv("siCh"),chDate:gv("siCD"),vehicle:gv("siV"),paperType:gv("siPT"),sheetSize:gv("siSz"),gsm:gv("siG"),bundles:gv("siB"),gross:gv("siGB"),rack:gv("siR")};
  if(!d.partyId||!d.challan||!d.bundles||!d.sheetSize||!d.gsm){_t("Fill required (*) fields");return;}
  _mLoad();
  _api("addStock",d,function(r){if(r.success){if(_D.stock&&r.stock)_D.stock.push(r.stock);_mClose();_t("Stock added!");_go("stock");}else _t(r.error||"Failed");});
}
/* QC */
function _mNewQC(){_mQCJ("");}
function _mQCJ(preId){
  var rJ=(_D.jobs||[]).filter(function(j){return j["Print Status"]==="Done";});
  _mOpen("QC Entry",
    "<div class=\"fg\"><label>Job *</label><select id=\"qJ\"><option value=\"\">-- Select Job --</option>"+rJ.map(function(j){return"<option value=\""+_e(j["Job ID"]||"")+"\""+(j["Job ID"]===preId?" selected":"")+">"+_e((j["Job ID"]||"")+" -- "+(j["Job Name / Description"]||""))+"</option>";}).join("")+"</select></div>"
    +"<div class=\"fg\"><label>QC Stage *</label><select id=\"qSt\"><option>Pre-press QC</option><option>Print QC</option><option>Post-press QC</option><option>Final QC</option></select></div>"
    +"<div class=\"fsec\">Ratings (1 to 5)</div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Color Accuracy</label><input type=\"number\" id=\"qCA\" min=\"1\" max=\"5\" value=\"4\"><div class=\"fg-hint\">1=Poor 5=Excellent</div></div><div class=\"fg\"><label>Register Accuracy</label><input type=\"number\" id=\"qRA\" min=\"1\" max=\"5\" value=\"4\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Ink Density</label><input type=\"number\" id=\"qID\" min=\"1\" max=\"5\" value=\"4\"></div><div class=\"fg\"><label>Cutting Accuracy</label><input type=\"number\" id=\"qCuA\" min=\"1\" max=\"5\" value=\"4\"></div></div>"
    +"<div class=\"fsec\">Result</div>"
    +"<div class=\"fg\"><label>Pass / Fail *</label><select id=\"qR\"><option value=\"Pass\">Pass</option><option value=\"Partial Pass\">Partial Pass</option><option value=\"Fail\">Fail</option></select></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Total Inspected</label><input type=\"number\" id=\"qTI\" placeholder=\"200\"></div><div class=\"fg\"><label>Rejection Qty</label><input type=\"number\" id=\"qRQ\" value=\"0\"></div></div>"
    +"<div class=\"fg\"><label>Corrective Action / Remarks</label><textarea id=\"qNt\" placeholder=\"Describe issues or actions taken...\"></textarea></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnV btn-sm\" style=\"flex:1\" onclick=\"_svQC()\"><i class=\"fa-solid fa-search\"></i> Save QC</button>");
}
function _svQC(){
  var d={jobId:gv("qJ"),stage:gv("qSt"),colorAcc:gv("qCA"),regAcc:gv("qRA"),inkDen:gv("qID"),cutAcc:gv("qCuA"),result:gv("qR"),totalInsp:gv("qTI"),rejQty:gv("qRQ"),note:gv("qNt")};
  if(!d.jobId){_t("Select a job");return;}
  _mLoad();
  _api("addQC",d,function(r){
    if(r.success){var j=(_D.jobs||[]).filter(function(x){return x["Job ID"]===d.jobId;})[0];if(j){j["QC Done (Y/N)"]=true;j["QC Pass/Fail"]=d.result;}_mClose();_t("QC saved!");_go(_V);
      if(d.result==="Fail"&&j){var sup=(_D.users||[]).filter(function(u){return(u["Role"]||"").toLowerCase()==="supervisor";})[0]||{};var sw=sup["WhatsApp"]||sup["Mobile"];if(sw)setTimeout(function(){_waQCF(sw,d.jobId,j["Job Name / Description"]||"",d.stage,d.rejQty);},700);}
    }else _t(r.error||"Failed");
  });
}
/* DOWNTIME */
function _mNewDT(){
  var machs=(_D.machines||[]).map(function(m){return m["Machine Name"]||"";}).filter(Boolean);
  if(!machs.length)machs=["Machine 1","Machine 2","Machine 3"];
  _mOpen("Log Downtime",
    "<div class=\"fg\"><label>Machine *</label><select id=\"dtM\">"+machs.map(function(m){return"<option>"+_e(m)+"</option>";}).join("")+"</select></div>"
    +"<div class=\"fg\"><label>Category *</label><select id=\"dtC\"><option>Mechanical Failure</option><option>Electrical Issue</option><option>Operator Error</option><option>Scheduled Maintenance</option><option>Chemical Issue</option><option>Power Cut</option><option>Raw Material Issue</option><option>Other</option></select></div>"
    +"<div class=\"fg\"><label>Description *</label><textarea id=\"dtD\" placeholder=\"Describe the issue...\"></textarea></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Start Time</label><input type=\"datetime-local\" id=\"dtST\"></div><div class=\"fg\"><label>End Time</label><input type=\"datetime-local\" id=\"dtET\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Repair Cost (Rs)</label><input type=\"number\" id=\"dtRC\" value=\"0\"></div><div class=\"fg\"><label>Preventable?</label><select id=\"dtPv\"><option value=\"Y\">Yes</option><option value=\"N\">No</option></select></div></div>"
    +"<div class=\"fg\"><label>Action Taken</label><textarea id=\"dtAct\" placeholder=\"What was done to fix it?\"></textarea></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnR btn-sm\" style=\"flex:1\" onclick=\"_svDT()\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Log</button>");
}
function _svDT(){
  var d={machine:gv("dtM"),category:gv("dtC"),desc:gv("dtD"),startTime:gv("dtST"),endTime:gv("dtET"),cost:gv("dtRC"),action:gv("dtAct"),preventable:gv("dtPv")};
  if(!d.desc){_t("Enter description");return;}
  _mLoad();
  _api("addDowntime",d,function(r){if(r.success){_mClose();_t("Downtime logged!");_go(_V);}else _t(r.error||"Failed");});
}
/* NEW PARTY */
function _mNewParty(){
  _mOpen("Add New Party",
    "<div class=\"fg\"><label>Party Name *</label><input id=\"npN\" placeholder=\"ABC Packaging Pvt Ltd\"></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Party Type</label><select id=\"npT\"><option>Brand Owner</option><option>Manufacturer</option><option>Trader</option><option>Printer</option><option>Retailer</option><option>Other</option></select></div><div class=\"fg\"><label>Credit Days</label><input type=\"number\" id=\"npCD\" value=\"30\"></div></div>"
    +"<div class=\"fsec\">Contact</div>"
    +"<div class=\"fg\"><label>Contact Name *</label><input id=\"npCP\" placeholder=\"Rajesh Kumar\"></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Mobile *</label><input type=\"tel\" id=\"npM\" placeholder=\"98XXXXXXXX\" inputmode=\"numeric\"></div><div class=\"fg\"><label>WhatsApp</label><input type=\"tel\" id=\"npWA\" placeholder=\"Same or diff\" inputmode=\"numeric\"></div></div>"
    +"<div class=\"fsec\">Business</div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>GST Number</label><input id=\"npGST\" placeholder=\"07XXXXX0000X1Z5\"></div><div class=\"fg\"><label>City *</label><input id=\"npCity\" placeholder=\"Delhi\"></div></div>"
    +"<div class=\"fg\"><label>Address</label><textarea id=\"npAddr\" placeholder=\"Street, Area, City, Pincode\"></textarea></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnB btn-sm\" style=\"flex:1\" onclick=\"_svNP()\"><i class=\"fa-solid fa-plus\"></i> Add Party</button>");
}
function _svNP(){
  var d={name:gv("npN"),type:gv("npT"),contact:gv("npCP"),mobile:gv("npM"),whatsapp:gv("npWA"),gst:gv("npGST"),city:gv("npCity"),addr:gv("npAddr"),creditDays:gv("npCD")};
  if(!d.name||!d.mobile){_t("Name and mobile required");return;}
  _mLoad();
  _api("addParty",d,function(r){if(r.success){if(_D.parties&&r.party)_D.parties.push(r.party);_mClose();_t("Party added!");_go("parties");}else _t(r.error||"Failed");});
}
/* PARTY DETAIL */
function _mPD(pid){
  var p=(_D.parties||[]).filter(function(x){return x["Party ID"]===pid;})[0];if(!p)return;
  var jbs=(_D.jobs||[]).filter(function(j){return j["Party ID"]===pid;});
  var inv=(_D.invoices||[]).filter(function(i){return i["Party ID"]===pid;});
  var totalBill=inv.reduce(function(s,i){return s+_n(i["Final Amount"]);},0);
  var xid=pid.replace(/"/g,"&quot;");
  var bd="<div style=\"display:flex;align-items:center;gap:12px;margin-bottom:14px\">"
    +"<div style=\"width:52px;height:52px;border-radius:14px;background:var(--BL);display:flex;align-items:center;justify-content:center;color:var(--B);font-weight:900;font-size:22px;flex-shrink:0\">"+(p["Party Name"]||"?")[0]+"</div>"
    +"<div><div style=\"font-size:17px;font-weight:800\">"+_e(p["Party Name"]||"--")+"</div><div style=\"font-size:11px;color:var(--tx3)\">"+_e(p["Party ID"]||"")+" &bull; "+_e(p["Party Type"]||"")+"</div></div></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Contact</span><span class=\"ir-v\">"+_e(p["Contact Person 1"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Mobile</span><span class=\"ir-v\">"+_e(p["Mobile 1"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">GST</span><span class=\"ir-v\" style=\"font-size:11px\">"+_e(p["GST Number"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">City</span><span class=\"ir-v\">"+_e(p["Billing City"]||p["City"]||"--")+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Total Jobs</span><span class=\"ir-v\"><span class=\"badge bb\">"+jbs.length+"</span></span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Total Billed</span><span class=\"ir-v\">&#8377;"+_f(totalBill)+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Outstanding</span><span class=\"ir-v\" style=\"color:#DC2626;font-weight:700;font-size:15px\">&#8377;"+_f(_n(p["Outstanding Balance (Rs)"]))+"</span></div>"
    +"<div class=\"ir\"><span class=\"ir-l\">Status</span><span class=\"ir-v\"><span class=\"badge "+(p["Status"]==="Active"?"bg":p["Status"]==="Blacklisted"?"br":"bx")+"\">"+_e(p["Status"]||"Active")+"</span></span></div>";
  var ft="<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Close</button>";
  if(p["WhatsApp 1"]){var wn=(p["WhatsApp 1"]||"").replace(/"/g,"&quot;"),cn=(p["Contact Person 1"]||"").replace(/"/g,"&quot;");ft="<button class=\"wa-btn btn-sm\" onclick=\"_waP('"+wn+"','"+cn+"')\"><i class=\"fa-brands fa-whatsapp\"></i> WhatsApp</button>"+ft;}
  _mOpen(p["Party Name"]||"Party Detail",bd,ft);
}
/* EXPENSE */
function _mNewExp(){
  _mOpen("Log Expense",
    "<div class=\"fg\"><label>Category *</label><select id=\"exC\"><option>Ink</option><option>Plate</option><option>Chemical</option><option>Lamination Film</option><option>Maintenance</option><option>Electricity</option><option>Packing Material</option><option>Labour</option><option>Transport</option><option>Miscellaneous</option></select></div>"
    +"<div class=\"fg\"><label>Description *</label><input id=\"exD\" placeholder=\"e.g. Cyan Ink 1Kg\"></div>"
    +"<div class=\"fg\"><label>Vendor Name</label><input id=\"exV\" placeholder=\"Vendor name\"></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Qty</label><input type=\"number\" id=\"exQ\" placeholder=\"1\"></div><div class=\"fg\"><label>Unit</label><select id=\"exU\"><option>Kg</option><option>Litre</option><option>Pcs</option><option>Roll</option><option>Sheet</option><option>Bill</option><option>Job</option><option>Set</option></select></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Rate per Unit (Rs)</label><input type=\"number\" id=\"exR\" placeholder=\"800\"></div><div class=\"fg\"><label>GST %</label><input type=\"number\" id=\"exGST\" value=\"18\"></div></div>"
    +"<div class=\"form-row\"><div class=\"fg\"><label>Payment Mode</label><select id=\"exPM\"><option>Cash</option><option>UPI</option><option>NEFT</option><option>Cheque</option></select></div><div class=\"fg\"><label>Date</label><input type=\"date\" id=\"exDt\" value=\""+_today()+"\"></div></div>",
    "<button class=\"btn btnX btn-sm\" onclick=\"_mClose()\">Cancel</button><button class=\"btn btnO btn-sm\" style=\"flex:1\" onclick=\"_svExp()\"><i class=\"fa-solid fa-receipt\"></i> Add</button>");
}
function _svExp(){
  var d={category:gv("exC"),desc:gv("exD"),vendor:gv("exV"),qty:gv("exQ"),unit:gv("exU"),rate:gv("exR"),gst:gv("exGST"),mode:gv("exPM"),date:gv("exDt")};
  if(!d.desc){_t("Enter description");return;}
  _mLoad();
  _api("addExpense",d,function(r){if(r.success){_mClose();_t("Expense added!");_go("expenses");}else _t(r.error||"Failed");});
}
/* -- WHATSAPP -- */
function _wa(num,msg,lbl){
  num=String(num||"").replace(/\D/g,"");
  if(!num){_t("No WhatsApp number");return;}
  if(!num.startsWith("91")&&num.length===10)num="91"+num;
  if(!_ok()){window.open("https://wa.me/"+num+"?text="+encodeURIComponent(msg),"_blank");return;}
  _t("Sending WhatsApp...");
  _api("sendWhatsApp",{number:num,message:msg},function(r){
    if(r&&r.success)_t("WhatsApp sent"+(lbl?" -- "+lbl:""));
    else{_t("Opening WhatsApp...");window.open("https://wa.me/"+num+"?text="+encodeURIComponent(msg),"_blank");}
  });
}
function _waP(num,name){_wa(num,"Namaskar "+(name||"")+" ji!\nNM Print (Nitin Mittal), Mundka, Delhi se bol rahe hain.\nKoi kaam ho to zaroor bataiye.\n\nDhanyawad!",name);}
function _waDisp(num,name,jobNm,jid,dt,veh,lr){_wa(num,"Namaskar "+(name||"")+" ji!\n\nAapka kaam complete ho gaya aur dispatch kar diya gaya:\n*"+jobNm+"*\n\nJob ID: "+jid+"\nDate: "+(dt||_today())+"\nVehicle: "+(veh||"--")+"\nLR No.: "+(lr||"--")+"\n\nDhanyawad!\n-- NM Print, Mundka","Dispatch");}
function _waPR(num,invNo,amt,due,name){var od=due&&due<_today();_wa(num,"Namaskar "+(name||"")+" ji!\n\n"+(od?"PAYMENT OVERDUE!\n\n":"Payment Reminder\n\n")+"Invoice: *"+invNo+"*\nAmount: *Rs. "+amt+"*\nDue: "+(due||"--")+"\n\nKripya payment karein.\n-- NM Print, Mundka","Reminder");}
function _waQCF(num,jid,nm,stage,rej){_wa(num,"QC FAIL -- Urgent!\n\nJob: "+jid+" -- "+nm+"\nStage: "+stage+"\nRejected: "+(rej||0)+"\n\nKripya turant review karein.\n-- NM Print","QC Fail");}
