/* IronLog 0.1.0 – local-first workout tracker */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-'+Date.now()+'-'+Math.random().toString(16).slice(2));
const localISODate = (date=new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const todayISO = () => localISODate();
const sessionDate = s => localISODate(new Date(s.startedAt));
const displayWeight = kgValue => state.settings.unit==='lb' ? Number(kgValue||0)*2.2046226218 : Number(kgValue||0);
const storedWeight = shownValue => state.settings.unit==='lb' ? Number(shownValue||0)/2.2046226218 : Number(shownValue||0);
const fmtDate = (iso,opts={day:'2-digit',month:'short',year:'numeric'}) => new Date(iso+'T12:00:00').toLocaleDateString('de-DE',opts);
const fmtNum = n => new Intl.NumberFormat('de-DE',{maximumFractionDigits:1}).format(n||0);
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kg = n => `${fmtNum(n)} kg`;
const baseExercises = [
['Bankdrücken','Bench Press','Brust','Freihantel','Langhantel','Bilateral'],
['Schrägbankdrücken Kurzhantel','Incline Dumbbell Press','Brust','Freihantel','Kurzhanteln','Bilateral'],
['Brustpresse','Chest Press','Brust','Maschine','Brustpresse','Bilateral'],
['Butterfly','Pec Deck Fly','Brust','Maschine','Butterfly-Maschine','Bilateral'],
['Kabel-Flys','Cable Fly','Brust','Kabelzug','Kabelzug','Bilateral'],
['Liegestütze','Push-up','Brust','Körpergewicht','Körpergewicht','Bilateral'],
['Klimmzüge','Pull-up','Rücken','Körpergewicht','Klimmzugstange','Bilateral'],
['Latzug breit','Wide-Grip Lat Pulldown','Rücken','Maschine','Latzug','Bilateral'],
['Rudern sitzend','Seated Cable Row','Rücken','Kabelzug','Kabelzug','Bilateral'],
['Langhantelrudern','Barbell Row','Rücken','Freihantel','Langhantel','Bilateral'],
['Einarmiges Kurzhantelrudern','Single-Arm Dumbbell Row','Rücken','Freihantel','Kurzhantel','Unilateral'],
['Face Pulls','Face Pull','Schultern','Kabelzug','Kabelzug','Bilateral'],
['Schulterdrücken Maschine','Machine Shoulder Press','Schultern','Maschine','Schulterpresse','Bilateral'],
['Schulterdrücken Kurzhantel','Dumbbell Shoulder Press','Schultern','Freihantel','Kurzhanteln','Bilateral'],
['Seitheben','Lateral Raise','Schultern','Freihantel','Kurzhanteln','Unilateral'],
['Reverse Butterfly','Reverse Pec Deck','Schultern','Maschine','Butterfly reverse','Bilateral'],
['Bizepscurls','Biceps Curl','Bizeps','Freihantel','Kurzhanteln','Bilateral'],
['Hammercurls','Hammer Curl','Bizeps','Freihantel','Kurzhanteln','Bilateral'],
['Trizepsdrücken Kabel','Cable Triceps Pushdown','Trizeps','Kabelzug','Kabelzug','Bilateral'],
['Trizeps Overhead Kabel','Overhead Cable Triceps Extension','Trizeps','Kabelzug','Kabelzug','Bilateral'],
['Kniebeugen','Barbell Squat','Beine','Freihantel','Langhantel','Bilateral'],
['Beinpresse','Leg Press','Beine','Maschine','Beinpresse','Bilateral'],
['Beinstrecker','Leg Extension','Beine','Maschine','Beinstrecker','Bilateral'],
['Beinbeuger sitzend','Seated Leg Curl','Beine','Maschine','Beinbeuger','Bilateral'],
['Rumänisches Kreuzheben','Romanian Deadlift','Beine','Freihantel','Langhantel','Bilateral'],
['Bulgarian Split Squat','Bulgarian Split Squat','Beine','Freihantel','Kurzhanteln','Unilateral'],
['Wadenheben stehend','Standing Calf Raise','Waden','Maschine','Wadenmaschine','Bilateral'],
['Hip Thrust','Hip Thrust','Gesäß','Freihantel','Langhantel','Bilateral'],
['Plank','Plank','Bauch','Körpergewicht','Körpergewicht','Bilateral'],
['Crunches Kabel','Cable Crunch','Bauch','Kabelzug','Kabelzug','Bilateral'],
['Hanging Leg Raises','Hanging Leg Raise','Bauch','Körpergewicht','Klimmzugstange','Bilateral'],
['Einarmiges Seitheben Kabel','Single-Arm Cable Lateral Raise','Schultern','Kabelzug','Kabelzug','Unilateral'],
['Einbeinige Beinpresse','Single-Leg Press','Beine','Maschine','Beinpresse','Unilateral'],
['Dips','Dip','Trizeps','Körpergewicht','Dip-Barren','Bilateral'],
['Kreuzheben','Deadlift','Rücken','Freihantel','Langhantel','Bilateral'],
['Frontkniebeugen','Front Squat','Beine','Freihantel','Langhantel','Bilateral'],
['Hackenschmidt-Kniebeugen','Hack Squat','Beine','Maschine','Hackenschmidt-Maschine','Bilateral'],
['Smith-Machine-Kniebeugen','Smith Machine Squat','Beine','Maschine','Multipresse','Bilateral'],
['Beinstrecker einbeinig','Single-Leg Extension','Beine','Maschine','Beinstrecker','Unilateral'],
['Beinbeuger liegend','Lying Leg Curl','Beine','Maschine','Beinbeuger','Bilateral'],
['Glute Kickback','Glute Kickback','Gesäß','Maschine','Kickback-Maschine','Unilateral'],
['Abduktorenmaschine','Hip Abduction','Gesäß','Maschine','Abduktorenmaschine','Bilateral'],
['Adduktorenmaschine','Hip Adduction','Beine','Maschine','Adduktorenmaschine','Bilateral'],
['Good Mornings','Good Morning','Rücken','Freihantel','Langhantel','Bilateral'],
['Rückenstrecker','Back Extension','Rücken','Körpergewicht','Rückenstreckerbank','Bilateral'],
['Assistierte Klimmzüge','Assisted Pull-up','Rücken','Maschine','Klimmzugmaschine','Bilateral'],
['Brustgestütztes Rudern','Chest-Supported Row','Rücken','Maschine','Rudergerät','Bilateral'],
['T-Bar Rudern','T-Bar Row','Rücken','Freihantel','T-Bar','Bilateral'],
['Latzug eng','Close-Grip Lat Pulldown','Rücken','Kabelzug','Latzug','Bilateral'],
['Pullover Kabel','Cable Pullover','Rücken','Kabelzug','Kabelzug','Bilateral'],
['Scottcurls','Preacher Curl','Bizeps','Maschine','Scottbank','Bilateral'],
['Konzentrationscurls','Concentration Curl','Bizeps','Freihantel','Kurzhantel','Unilateral'],
['Kabelcurls einarmig','Single-Arm Cable Curl','Bizeps','Kabelzug','Kabelzug','Unilateral'],
['Skull Crusher','Lying Triceps Extension','Trizeps','Freihantel','SZ-Stange','Bilateral'],
['Enges Bankdrücken','Close-Grip Bench Press','Trizeps','Freihantel','Langhantel','Bilateral'],
['Trizepsdrücken Kurzhantel über Kopf','Overhead Dumbbell Triceps Extension','Trizeps','Freihantel','Kurzhantel','Bilateral'],
['Frontheben','Front Raise','Schultern','Freihantel','Kurzhanteln','Bilateral'],
['Reverse Cable Fly','Reverse Cable Fly','Schultern','Kabelzug','Kabelzug','Bilateral'],
['Arnold Press','Arnold Press','Schultern','Freihantel','Kurzhanteln','Bilateral'],
['Aufrechtes Rudern','Upright Row','Schultern','Freihantel','Langhantel','Bilateral'],
['Erhöhte Liegestütze','Incline Push-up','Brust','Körpergewicht','Bank','Bilateral'],
['Liegestütze mit Zusatzgewicht','Weighted Push-up','Brust','Körpergewicht','Gewichtsscheibe','Bilateral'],
['Hängendes Knieheben','Hanging Knee Raise','Bauch','Körpergewicht','Klimmzugstange','Bilateral'],
['Reverse Crunch','Reverse Crunch','Bauch','Körpergewicht','Körpergewicht','Bilateral'],
['Ab Wheel Rollout','Ab Wheel Rollout','Bauch','Körpergewicht','Ab Wheel','Bilateral'],
['Russian Twists','Russian Twist','Bauch','Freihantel','Gewichtsscheibe','Bilateral'],
['Seitstütz','Side Plank','Bauch','Körpergewicht','Körpergewicht','Unilateral'],
['Farmer Walk','Farmer Carry','Ganzkörper','Freihantel','Kurzhanteln','Bilateral']
].map((x,i)=>({id:'ex-'+(i+1),de:x[0],en:x[1],muscle:x[2],type:x[3],equipment:x[4],side:x[5],weightMode:['Körpergewicht','Körpergewicht + Zusatzgewicht','Körpergewicht − Unterstützung'].includes(x[3])?'bodyweight':'external',description:'Kontrollierte Bewegung, stabiler Rumpf und sauberer Bewegungsumfang.'}));
const seedPlans = [
{id:'ppl',name:'Push Pull Legs',version:1,active:true,days:[
{id:'ppl-push',name:'Push',exercises:['ex-1','ex-2','ex-3','ex-15','ex-19','ex-17'].map(id=>({exerciseId:id,sets:3,reps:10,rest:90}))},
{id:'ppl-pull',name:'Pull',exercises:['ex-7','ex-8','ex-9','ex-11','ex-16','ex-18'].map(id=>({exerciseId:id,sets:3,reps:10,rest:90}))},
{id:'ppl-legs',name:'Legs',exercises:['ex-21','ex-22','ex-24','ex-25','ex-27','ex-29'].map(id=>({exerciseId:id,sets:3,reps:10,rest:120}))}
]},
{id:'uku',name:'Oberkörper / Unterkörper',version:1,active:true,days:[
{id:'uku-upper',name:'Oberkörper',exercises:['ex-1','ex-8','ex-3','ex-14','ex-17','ex-19'].map(id=>({exerciseId:id,sets:3,reps:10,rest:90}))},
{id:'uku-lower',name:'Unterkörper',exercises:['ex-21','ex-22','ex-24','ex-25','ex-27','ex-29'].map(id=>({exerciseId:id,sets:3,reps:10,rest:120}))}
]}
];
const freshState = () => ({schema:1,exercises:JSON.parse(JSON.stringify(baseExercises)),plans:JSON.parse(JSON.stringify(seedPlans)).map(p=>({...p,lineageId:p.id})),sessions:[],bodyEntries:[],activeWorkout:null,settings:{language:'de',unit:'kg',defaultRest:90},createdAt:new Date().toISOString()});
let state, db, currentView='home', calDate=new Date(), selectedDay=todayISO(), progressRange='week', exerciseFilter='Alle', restRemaining=90, restInterval=null, workoutInterval=null, dragId=null, dropTargetId=null;

function openDB(){return new Promise((resolve,reject)=>{
 if(!('indexedDB'in window)){resolve(null);return}
 const req=indexedDB.open('ironlog-db',1);
 req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains('state'))d.createObjectStore('state')};
 req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
})}
async function loadState(){
 try{db=await openDB();if(db){const value=await new Promise((resolve,reject)=>{const tx=db.transaction('state','readonly');const r=tx.objectStore('state').get('main');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});if(value)return normalizeState(value)}}
 catch(e){console.warn('IndexedDB nicht verfügbar',e)}
 try{const raw=localStorage.getItem('ironlog-state');if(raw)return normalizeState(JSON.parse(raw))}catch(e){console.warn(e)}
 return freshState();
}
function normalizeState(s){const f=freshState();const out={...f,...s,settings:{...f.settings,...(s.settings||{})},exercises:Array.isArray(s.exercises)?s.exercises:f.exercises,plans:Array.isArray(s.plans)?s.plans:f.plans,sessions:Array.isArray(s.sessions)?s.sessions:[],bodyEntries:Array.isArray(s.bodyEntries)?s.bodyEntries:[]};out.plans.forEach(p=>{p.lineageId=p.lineageId||p.id});return out}
let saveQueue=Promise.resolve();
function saveState(){
 $('#save-status').innerHTML='<i style="background:#d69b36"></i> Speichert…';
 const snapshot=JSON.stringify(state);
 saveQueue=saveQueue.then(async()=>{
   if(db){await new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(JSON.parse(snapshot),'main');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
   try{localStorage.setItem('ironlog-state',snapshot)}catch(e){console.warn('localStorage-Fallback fehlgeschlagen',e)}
   $('#save-status').innerHTML='<i></i> Lokal gespeichert';
 }).catch(e=>{console.error(e);$('#save-status').textContent='Speicherfehler'});
 return saveQueue;
}
function toast(msg){const root=$('#toast-root');root.innerHTML=`<div class="toast">${esc(msg)}</div>`;setTimeout(()=>root.innerHTML='',2400)}
function exerciseById(id){return state.exercises.find(e=>e.id===id)}
function exName(e){return state.settings.language==='en'?(e.en||e.de):e.de}
function allDays(){return state.plans.flatMap(p=>p.days.map(d=>({...d,planId:p.id,planName:p.name,version:p.version})))}
function getPlanDay(planId,dayId){const p=state.plans.find(x=>x.id===planId);return p?.days.find(d=>d.id===dayId)}
function showView(view){
 if(state.activeWorkout && view!=='workout'){toast('Dein Workout läuft noch – erst beenden oder verlassen.');view='workout'}
 currentView=view;
 $$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+view));
 $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.nav===view));
 if(view==='home')renderHome();if(view==='plans')renderPlans();if(view==='exercises')renderExercises();if(view==='calendar')renderCalendar();if(view==='progress')renderProgress();if(view==='history')renderHistory();if(view==='workout')renderWorkout();
 window.scrollTo(0,0);
}
function navSetup(){document.addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(b){e.preventDefault();showView(b.dataset.nav)}});$('#quick-settings').onclick=()=>showView('settings')}
function renderHome(){
 const now=new Date();$('#today-label').textContent=now.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'}).toUpperCase();
 const start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-((start.getDay()+6)%7));
 const sessions=state.sessions.filter(s=>new Date(s.startedAt)>=start);
 $('#week-workouts').textContent=sessions.length;$('#week-volume').textContent=kg(sessions.reduce((a,s)=>a+s.volume,0));$('#week-time').textContent=fmtNum(sessions.reduce((a,s)=>a+s.duration,0)/60)+' min';
 const recent=[...state.sessions].sort((a,b)=>b.startedAt.localeCompare(a.startedAt)).slice(0,3);
 $('#recent-workouts').innerHTML=recent.length?recent.map(sessionCard).join(''):'Noch keine Workouts. Dein erstes Training wartet. 💪';
 $('#home-plans').innerHTML=state.plans.filter(p=>p.active).slice(0,4).map(p=>`<div class="mini-plan"><strong>${esc(p.name)}</strong><small>${p.days.length} Trainingstage · Version ${p.version}</small></div>`).join('')||'<div class="empty-state">Noch keine aktiven Pläne.</div>';
}
function sessionCard(s){return `<article class="list-card"><div class="plan-card"><div><strong>${esc(s.dayName||s.name)}</strong><small>${esc(s.planName||'Freies Training')} · ${fmtDate(sessionDate(s))}</small></div><strong>${kg(s.volume)}</strong></div><div class="history-meta"><span>◷ ${Math.round(s.duration/60)} min</span><span>▤ ${s.exercises.length} Übungen</span><span>✓ ${s.completedSets} Sätze</span></div></article>`}
function renderPlans(){
 $('#plans-list').innerHTML=state.plans.length?state.plans.map(p=>`<article class="list-card"><div class="plan-card"><div><strong>${esc(p.name)}</strong><small>Version ${p.version} · ${p.days.length} Trainingstage · ${p.active?'Aktiv':'Archiviert'}</small><div class="tag-row">${p.days.map(d=>`<span class="tag">${esc(d.name)}</span>`).join('')}</div></div><div class="plan-actions"><button class="btn btn-outline btn-small" data-edit-plan="${p.id}">Bearbeiten</button><button class="btn btn-outline btn-small" data-activate-plan="${p.id}">${p.active?'Aktiv':'Aktivieren'}</button></div></div></article>`).join(''):'<div class="empty-state">Noch keine Pläne vorhanden.</div>';
 $$('[data-edit-plan]').forEach(b=>b.onclick=()=>editPlan(b.dataset.editPlan));$$('[data-activate-plan]').forEach(b=>b.onclick=()=>{const p=state.plans.find(x=>x.id===b.dataset.activatePlan);state.plans.filter(x=>(x.lineageId||x.id)===(p.lineageId||p.id)).forEach(x=>x.active=false);p.active=true;saveState();renderPlans();toast('Plan aktiviert')});
}
function editPlan(id){
 const original=state.plans.find(x=>x.id===id);if(!original)return;
 const draft=JSON.parse(JSON.stringify(original));
 renderPlanEditor(draft,original);
}
function renderPlanEditor(draft,original){
 openModal(`<h2>${original?'Planversion bearbeiten':'Neuen Trainingsplan erstellen'}</h2><p>${original?'Deine Änderungen werden als neue Version gespeichert. Die bisherige Version bleibt unverändert.':'Lege Trainingstage an und füge anschließend Übungen hinzu.'}</p><label class="field-label">Planname</label><input class="field" id="plan-version-name" value="${esc(draft.name)}"><div class="modal-list" id="plan-day-list">${draft.days.map(d=>`<div class="modal-exercise"><div><strong>${esc(d.name)}</strong><small>${d.exercises.length} Übungen</small></div><button class="btn btn-outline btn-small" data-edit-day-draft="${d.id}">Bearbeiten</button></div>`).join('')||'<p>Noch keine Trainingstage angelegt.</p>'}</div><label class="field-label">Trainingstag hinzufügen</label><div style="display:flex;gap:7px"><input class="field" id="new-day-name" placeholder="z. B. Push" style="margin:0"><button class="btn btn-outline" id="add-plan-day">＋</button></div><div class="modal-actions"><button class="btn btn-outline" id="modal-cancel">Abbrechen</button><button class="btn btn-primary" id="save-plan-version">${original?'Neue Version speichern':'Plan speichern'}</button></div>`);
 const syncName=()=>{draft.name=$('#plan-version-name').value.trim()||draft.name};
 $$('[data-edit-day-draft]').forEach(b=>b.onclick=()=>{syncName();editPlanDayDraft(draft,b.dataset.editDayDraft,()=>renderPlanEditor(draft,original))});
 $('#add-plan-day').onclick=()=>{syncName();const name=$('#new-day-name').value.trim();if(!name){toast('Bitte einen Namen für den Trainingstag eingeben');return}draft.days.push({id:uid(),name,exercises:[]});renderPlanEditor(draft,original)};
 $('#modal-cancel').onclick=closeModal;
 $('#save-plan-version').onclick=()=>{syncName();if(!draft.days.length){toast('Lege mindestens einen Trainingstag an');return}const final=JSON.parse(JSON.stringify(draft));final.id=uid();final.lineageId=original?(original.lineageId||original.id):draft.id;final.version=original?original.version+1:1;final.active=true;final.days.forEach(d=>{d.id=uid()});if(original)state.plans.filter(p=>(p.lineageId||p.id)===final.lineageId).forEach(p=>p.active=false);state.plans.push(final);saveState();closeModal();renderPlans();toast(original?'Neue Planversion gespeichert':'Trainingsplan erstellt')};
}
function editPlanDayDraft(draft,dayId,returnToEditor){
 const d=draft.days.find(x=>x.id===dayId);if(!d)return;
 const render=()=>{
  openModal(`<h2>${esc(d.name)} bearbeiten</h2><label class="field-label">Name des Trainingstags</label><input id="day-name" class="field" value="${esc(d.name)}"><div class="modal-list">${d.exercises.map((x,i)=>{const e=exerciseById(x.exerciseId);return `<div class="modal-exercise" style="align-items:flex-start"><div style="flex:1;min-width:0"><strong>${esc(e?exName(e):'Unbekannte Übung')}</strong><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:7px"><label class="small">Sätze<input class="field" style="padding:7px;margin:3px 0" type="number" min="1" max="20" data-day-sets="${i}" value="${x.sets}"></label><label class="small">Wdh.<input class="field" style="padding:7px;margin:3px 0" type="number" min="1" max="100" data-day-reps="${i}" value="${x.reps}"></label><label class="small">Pause s<input class="field" style="padding:7px;margin:3px 0" type="number" min="0" max="900" data-day-rest="${i}" value="${x.rest||state.settings.defaultRest}"></label></div></div><button class="btn btn-outline btn-small" data-remove-day-ex="${i}">×</button></div>`}).join('')||'<p>Füge Übungen zu diesem Trainingstag hinzu.</p>'}</div><button class="btn btn-outline btn-block" id="day-add-ex">＋ Übung hinzufügen</button><div class="modal-actions"><button class="btn btn-outline" id="day-back">Zurück</button><button class="btn btn-primary" id="save-day-draft">Speichern</button></div>`);
  $$('[data-remove-day-ex]').forEach(b=>b.onclick=()=>{readInputs();d.exercises.splice(Number(b.dataset.removeDayEx),1);render()});
  $('#day-add-ex').onclick=()=>{readInputs();openExercisePicker(e=>{d.exercises.push({exerciseId:e.id,sets:3,reps:10,rest:state.settings.defaultRest});render()})};
  $('#day-back').onclick=()=>{readInputs();d.name=$('#day-name').value.trim()||d.name;returnToEditor()};
  $('#save-day-draft').onclick=()=>{readInputs();d.name=$('#day-name').value.trim()||d.name;returnToEditor()};
 };
 const readInputs=()=>{ $$('[data-day-sets]').forEach(el=>d.exercises[Number(el.dataset.daySets)].sets=Math.max(1,Math.min(20,Number(el.value)||3)));$$('[data-day-reps]').forEach(el=>d.exercises[Number(el.dataset.dayReps)].reps=Math.max(1,Math.min(100,Number(el.value)||10)));$$('[data-day-rest]').forEach(el=>d.exercises[Number(el.dataset.dayRest)].rest=Math.max(0,Math.min(900,Number(el.value)||0)));};
 render();
}
function addPlan(){
 openModal(`<h2>Neuen Trainingsplan erstellen</h2><p>Gib deinem Split einen Namen.</p><label class="field-label">Planname</label><input id="new-plan-name" class="field" placeholder="z. B. Mein 4er Split"><div class="modal-actions"><button class="btn btn-outline" id="modal-cancel">Abbrechen</button><button class="btn btn-primary" id="create-plan">Weiter</button></div>`);
 $('#modal-cancel').onclick=closeModal;$('#create-plan').onclick=()=>{const name=$('#new-plan-name').value.trim();if(!name){toast('Bitte einen Namen eingeben');return}const draft={id:uid(),name,version:1,active:true,days:[]};renderPlanEditor(draft,null)};
}
function renderExercises(){
 const q=($('#exercise-search').value||'').toLowerCase();
 const list=state.exercises.filter(e=>(exerciseFilter==='Alle'||e.type===exerciseFilter||e.side===exerciseFilter)&&[e.de,e.en,e.muscle,e.equipment,e.type].join(' ').toLowerCase().includes(q));
 $('#exercise-count').textContent=`${list.length} Übungen`;
 $('#exercise-list').innerHTML=list.map(e=>`<article class="exercise-card"><div class="exercise-symbol">${e.type==='Maschine'?'▤':e.type==='Freihantel'?'◈':e.type==='Kabelzug'?'⌁':'↗'}</div><strong>${esc(exName(e))}</strong><small>${esc(e.muscle)} · ${esc(e.type)}${e.side==='Unilateral'?' · Einseitig':''}</small><small>ⓘ ${esc(e.equipment)}</small><button class="text-btn" data-ex-info="${e.id}">Details ansehen →</button></article>`).join('')||'<div class="empty-state">Keine Übungen gefunden.</div>';
 $$('[data-ex-info]').forEach(b=>b.onclick=()=>showExerciseInfo(b.dataset.exInfo));
}
function showExerciseInfo(id){const e=exerciseById(id);if(!e)return;openModal(`<h2>${esc(exName(e))}</h2><p>${esc(e.description||'Keine Beschreibung hinterlegt.')}</p><div class="tag-row"><span class="tag">${esc(e.muscle)}</span><span class="tag">${esc(e.type)}</span><span class="tag">${esc(e.side)}</span></div><div class="panel" style="box-shadow:none;margin:14px 0 0;background:#f7f5fa"><b style="font-size:11px">Equipment</b><p>${esc(e.equipment)}</p><b style="font-size:11px">Ausführung</b><p>Saubere Technik, kontrollierte negative Phase und den Bewegungsumfang ohne Schwung ausführen.</p></div><button class="btn btn-primary btn-block" id="modal-cancel">Schließen</button>`);$('#modal-cancel').onclick=closeModal}
function addExercise(){
 openModal(`<h2>Eigene Übung</h2><label class="field-label">Name (Deutsch)</label><input id="custom-de" class="field" placeholder="z. B. Kabelrudern eng"><label class="field-label">Name (Englisch, optional)</label><input id="custom-en" class="field" placeholder="Close-Grip Cable Row"><label class="field-label">Muskelgruppe</label><select id="custom-muscle" class="field">${['Brust','Rücken','Schultern','Bizeps','Trizeps','Beine','Gesäß','Waden','Bauch','Unterarme','Ganzkörper'].map(x=>`<option>${x}</option>`).join('')}</select><label class="field-label">Equipment / Typ</label><select id="custom-type" class="field"><option>Maschine</option><option>Freihantel</option><option>Körpergewicht</option><option>Kabelzug</option><option>Sonstiges</option></select><label class="field-label">Equipment-Info</label><input id="custom-equipment" class="field" placeholder="z. B. Kabelzug, enger Griff"><label class="field-label">Ausführung</label><select id="custom-side" class="field"><option>Bilateral</option><option>Unilateral</option></select><div class="modal-actions"><button class="btn btn-outline" id="modal-cancel">Abbrechen</button><button class="btn btn-primary" id="save-custom-ex">Speichern</button></div>`);
 $('#modal-cancel').onclick=closeModal;$('#save-custom-ex').onclick=()=>{const de=$('#custom-de').value.trim();if(!de){toast('Bitte einen Namen eingeben');return}state.exercises.push({id:uid(),de,en:$('#custom-en').value.trim()||de,muscle:$('#custom-muscle').value,type:$('#custom-type').value,equipment:$('#custom-equipment').value.trim()||'Nicht angegeben',side:$('#custom-side').value,weightMode:'external',description:'Eigene Übung.'});saveState();closeModal();renderExercises();toast('Übung hinzugefügt')};
}
function openExercisePicker(onPick){
 const q='<div class="search-wrap"><span>⌕</span><input id="picker-search" placeholder="Übung suchen…"></div><div class="modal-list" id="picker-list"></div>';
 openModal(`<h2>Übung hinzufügen</h2><p>Du kannst auch Übungen außerhalb deines Splits hinzufügen.</p>${q}<button class="btn btn-outline btn-block" id="picker-custom">＋ Eigene Übung erstellen</button>`);
 const render=()=>{const term=$('#picker-search').value.toLowerCase();const arr=state.exercises.filter(e=>[e.de,e.en,e.muscle,e.type].join(' ').toLowerCase().includes(term));$('#picker-list').innerHTML=arr.slice(0,70).map(e=>`<button class="modal-exercise" data-pick="${e.id}"><span><strong>${esc(exName(e))}</strong><small>${esc(e.muscle)} · ${esc(e.type)}</small></span><b>＋</b></button>`).join('')||'<p>Keine Treffer.</p>';$$('[data-pick]').forEach(b=>b.onclick=()=>{const e=exerciseById(b.dataset.pick);closeModal();onPick(e)})};
 $('#picker-search').oninput=render;$('#picker-custom').onclick=()=>{closeModal();addExercise()};render();
}
function setupWorkoutSelect(){
 const active=state.plans.filter(p=>p.active);$('#workout-plan-select').innerHTML=active.map(p=>`<option value="${p.id}">${esc(p.name)} · V${p.version}</option>`).join('')||'<option value="">Kein aktiver Plan</option>';
 updateWorkoutDays();
}
function updateWorkoutDays(){
 const p=state.plans.find(x=>x.id===$('#workout-plan-select').value);$('#workout-day-select').innerHTML=p?.days.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('')||'<option value="">Freies Training</option>';
 const d=p?.days.find(x=>x.id===$('#workout-day-select').value);$('#workout-preview').innerHTML=d?d.exercises.map(x=>{const e=exerciseById(x.exerciseId);return `${esc(e?exName(e):'Übung')} · ${x.sets} × ${x.reps}`}).join('<br>'):'Freies Training – Übungen während des Workouts hinzufügen.';
}
function startWorkout(){
 const p=state.plans.find(x=>x.id===$('#workout-plan-select').value),d=p?.days.find(x=>x.id===$('#workout-day-select').value);
 if(state.activeWorkout){showView('workout');return}
 const exercises=(d?.exercises||[]).map(x=>{const previous=[...state.sessions].sort((a,b)=>b.startedAt.localeCompare(a.startedAt)).flatMap(session=>session.exercises).find(ex=>ex.exerciseId===x.exerciseId);return {id:uid(),exerciseId:x.exerciseId,rest:x.rest||state.settings.defaultRest,sets:Array.from({length:x.sets||3},(_,i)=>{const oldSet=previous?.sets[i]||previous?.sets.at(-1);return {weight:Number(oldSet?.weight)||0,reps:Number(oldSet?.reps)||x.reps||10,done:false}})}});
 state.activeWorkout={id:uid(),planId:p?.id||null,planName:p?.name||'Freies Training',planVersion:p?.version||null,dayId:d?.id||null,dayName:d?.name||'Freies Training',startedAt:new Date().toISOString(),exercises};
 restRemaining=Number(state.settings.defaultRest)||90;saveState();showView('workout');
}
function renderWorkout(){
 const active=!!state.activeWorkout;$('#workout-setup').hidden=active;$('#active-workout').hidden=!active;
 if(!active){setupWorkoutSelect();return}
 $('#active-plan-label').textContent=`${state.activeWorkout.planName} · ${state.activeWorkout.planVersion?'V'+state.activeWorkout.planVersion:''}`;$('#active-workout-title').textContent=state.activeWorkout.dayName;
 $('#active-exercises').innerHTML=state.activeWorkout.exercises.map((x,index)=>renderActiveExercise(x,index)).join('')||'<div class="empty-state">Noch keine Übungen. Füge deine erste hinzu.</div>';
 bindWorkoutControls();updateWorkoutMetrics();updateDuration();$('#rest-display').textContent=timerFormat(restRemaining);
 if(workoutInterval)clearInterval(workoutInterval);workoutInterval=setInterval(updateDuration,1000);
}
function renderActiveExercise(x,index){
 const e=exerciseById(x.exerciseId);return `<article class="active-exercise" draggable="true" data-active-ex="${x.id}"><div class="exercise-head"><span class="drag-handle" title="Ziehen zum Sortieren">⠿</span><div class="exercise-head-main"><strong>${esc(e?exName(e):'Unbekannte Übung')}</strong><small>${esc(e?.muscle||'')} · ${esc(e?.equipment||'')}</small></div><button class="icon-btn" data-info-active="${e?.id||''}" aria-label="Übungsinfo">ⓘ</button><button class="icon-btn" data-remove-active="${x.id}" aria-label="Übung entfernen">×</button></div><div class="exercise-tools"><button data-rest-ex="${x.id}">Pause: ${x.rest}s</button><button data-add-set="${x.id}">＋ Satz</button><button data-move-up="${x.id}">↑</button><button data-move-down="${x.id}">↓</button></div><div class="sets-head"><span>SATZ</span><span>GEWICHT (${state.settings.unit})</span><span>WIEDERHOLUNGEN</span><span>✓</span></div>${x.sets.map((s,i)=>`<div class="set-row"><span class="set-number">${i+1}</span><input class="set-input" type="number" inputmode="decimal" min="0" step="0.5" value="${displayWeight(s.weight)}" data-set-weight="${x.id}" data-index="${i}" aria-label="Gewicht Satz ${i+1}"><input class="set-input" type="number" inputmode="numeric" min="0" step="1" value="${s.reps}" data-set-reps="${x.id}" data-index="${i}" aria-label="Wiederholungen Satz ${i+1}"><button class="set-done ${s.done?'checked':''}" data-set-done="${x.id}" data-index="${i}" aria-label="Satz ${i+1} erledigt">✓</button></div>`).join('')}</article>`;
}
function bindWorkoutControls(){
 $$('[data-set-weight]').forEach(el=>el.onchange=()=>{const x=findActive(el.dataset.setWeight);if(!x)return;x.sets[+el.dataset.index].weight=Math.max(0,storedWeight(Number(el.value)||0));saveState();updateWorkoutMetrics()});
 $$('[data-set-reps]').forEach(el=>el.onchange=()=>{const x=findActive(el.dataset.setReps);if(!x)return;x.sets[+el.dataset.index].reps=Math.max(0,Math.floor(Number(el.value)||0));saveState();updateWorkoutMetrics()});
 $$('[data-set-done]').forEach(el=>el.onclick=()=>{const x=findActive(el.dataset.setDone);if(!x)return;const s=x.sets[+el.dataset.index];s.done=!s.done;saveState();renderWorkout()});
 $$('[data-add-set]').forEach(el=>el.onclick=()=>{const x=findActive(el.dataset.addSet),last=x.sets.at(-1)||{weight:0,reps:10,done:false};x.sets.push({weight:last.weight,reps:last.reps,done:false});saveState();renderWorkout()});
 $$('[data-remove-active]').forEach(el=>el.onclick=()=>{state.activeWorkout.exercises=state.activeWorkout.exercises.filter(x=>x.id!==el.dataset.removeActive);saveState();renderWorkout()});
 $$('[data-info-active]').forEach(el=>el.onclick=()=>showExerciseInfo(el.dataset.infoActive));
 $$('[data-rest-ex]').forEach(el=>el.onclick=()=>{const x=findActive(el.dataset.restEx);if(!x)return;openModal(`<h2>Pausenzeit</h2><p>${esc(exName(exerciseById(x.exerciseId)))}</p><label class="field-label">Sekunden</label><input class="field" type="number" id="exercise-rest-value" min="0" max="900" value="${x.rest}"><div class="modal-actions"><button class="btn btn-outline" id="modal-cancel">Abbrechen</button><button class="btn btn-primary" id="save-ex-rest">Übernehmen</button></div>`);$('#modal-cancel').onclick=closeModal;$('#save-ex-rest').onclick=()=>{x.rest=Math.max(0,Math.min(900,Number($('#exercise-rest-value').value)||0));restRemaining=x.rest;saveState();closeModal();renderWorkout()}});
 $$('[data-move-up]').forEach(el=>el.onclick=()=>moveExercise(el.dataset.moveUp,-1));
 $$('[data-move-down]').forEach(el=>el.onclick=()=>moveExercise(el.dataset.moveDown,1));
 const cards=$$('.active-exercise');cards.forEach(card=>{const handle=card.querySelector('.drag-handle');handle.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;e.preventDefault();dragId=card.dataset.activeEx;card.classList.add('dragging')});card.addEventListener('dragstart',()=>{dragId=card.dataset.activeEx;card.classList.add('dragging')});card.addEventListener('dragend',()=>{dragId=null;card.classList.remove('dragging')});card.addEventListener('dragover',e=>e.preventDefault());card.addEventListener('drop',e=>{e.preventDefault();if(!dragId||dragId===card.dataset.activeEx)return;const arr=state.activeWorkout.exercises,from=arr.findIndex(x=>x.id===dragId),to=arr.findIndex(x=>x.id===card.dataset.activeEx);const [item]=arr.splice(from,1);arr.splice(to,0,item);saveState();renderWorkout()})});
}
function findActive(id){return state.activeWorkout?.exercises.find(x=>x.id===id)}
function moveExercise(id,delta){const arr=state.activeWorkout.exercises,i=arr.findIndex(x=>x.id===id),j=i+delta;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];saveState();renderWorkout()}
function updateWorkoutMetrics(){
 if(!state.activeWorkout)return;let volume=0,done=0,total=0;
 state.activeWorkout.exercises.forEach(x=>x.sets.forEach(s=>{volume+=Number(s.weight||0)*Number(s.reps||0);if(s.done)done++;total++}));
 $('#live-volume').textContent=kg(volume);$('#live-sets').textContent=`${done} / ${total}`;
}
function updateDuration(){if(!state.activeWorkout)return;const seconds=Math.max(0,Math.floor((Date.now()-new Date(state.activeWorkout.startedAt).getTime())/1000));$('#workout-duration').textContent=timerFormat(seconds)}
function timerFormat(seconds){const m=Math.floor(seconds/60),s=seconds%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function toggleRest(){if(restInterval){clearInterval(restInterval);restInterval=null;$('#rest-toggle').textContent='Weiter';$('#rest-status').textContent='Pausiert';return}if(restRemaining<=0)restRemaining=Number(state.settings.defaultRest)||90;$('#rest-toggle').textContent='Pause';$('#rest-status').textContent='Pause läuft';restInterval=setInterval(()=>{restRemaining--;$('#rest-display').textContent=timerFormat(restRemaining);if(restRemaining<=0){clearInterval(restInterval);restInterval=null;$('#rest-toggle').textContent='Start';$('#rest-status').textContent='Pause vorbei – weiter geht’s!';if(navigator.vibrate)navigator.vibrate([180,100,180])}},1000)}
function finishWorkout(){
 if(!state.activeWorkout)return;const a=state.activeWorkout;
 const volume=a.exercises.reduce((sum,x)=>sum+x.sets.reduce((v,s)=>v+Number(s.weight||0)*Number(s.reps||0),0),0);
 const completedSets=a.exercises.reduce((sum,x)=>sum+x.sets.filter(s=>s.done).length,0);
 const duration=Math.max(0,Math.floor((Date.now()-new Date(a.startedAt).getTime())/1000));
 if(!a.exercises.length){toast('Füge mindestens eine Übung hinzu');return}
 const session={...JSON.parse(JSON.stringify(a)),endedAt:new Date().toISOString(),duration,volume,completedSets,exercises:a.exercises.map(x=>({...x,name:exName(exerciseById(x.exerciseId)),muscle:exerciseById(x.exerciseId)?.muscle||''}))};
 state.sessions.push(session);state.activeWorkout=null;clearInterval(workoutInterval);clearInterval(restInterval);workoutInterval=restInterval=null;saveState();openModal(`<h2>Starkes Training! 💪</h2><p>${esc(session.dayName)} wurde gespeichert.</p><div class="stats-grid"><div class="stat-card"><strong>${kg(volume)}</strong><small>Volumen</small></div><div class="stat-card"><strong>${Math.round(duration/60)} min</strong><small>Dauer</small></div><div class="stat-card"><strong>${completedSets}</strong><small>Erledigte Sätze</small></div></div><button class="btn btn-primary btn-block" id="modal-done">Fertig</button>`);$('#modal-done').onclick=()=>{closeModal();showView('home')};
}
function cancelWorkout(){openModal(`<h2>Workout verlassen?</h2><p>Dein aktuelles Workout bleibt als Entwurf gespeichert und kann später fortgesetzt werden. Möchtest du es wirklich verlassen?</p><div class="modal-actions"><button class="btn btn-outline" id="modal-cancel">Weiter trainieren</button><button class="btn btn-primary" id="leave-workout">Verlassen</button></div>`);$('#modal-cancel').onclick=closeModal;$('#leave-workout').onclick=()=>{closeModal();state.activeWorkout=null;clearInterval(workoutInterval);clearInterval(restInterval);saveState();showView('home');toast('Entwurf verworfen')}}
function renderCalendar(){
 const y=calDate.getFullYear(),m=calDate.getMonth();$('#calendar-title').textContent=calDate.toLocaleDateString('de-DE',{month:'long',year:'numeric'});
 const first=new Date(y,m,1),offset=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),prevDays=new Date(y,m,0).getDate();
 const workoutDates=new Set(state.sessions.map(s=>sessionDate(s)));
 let html='';for(let i=0;i<42;i++){let day,month=m,year=y,muted=false;if(i<offset){day=prevDays-offset+i+1;month=m-1;muted=true}else if(i>=offset+days){day=i-offset-days+1;month=m+1;muted=true}else day=i-offset+1;
 const date=new Date(year,month,day),iso=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
 html+=`<button class="day-cell ${muted?'muted-day':''} ${iso===todayISO()?'today':''} ${iso===selectedDay?'selected':''} ${workoutDates.has(iso)?'has-workout':''}" data-date="${iso}">${day}</button>`}
 $('#calendar-days').innerHTML=html;$$('[data-date]').forEach(b=>b.onclick=()=>{selectedDay=b.dataset.date;renderCalendar()});
 $('#selected-date-title').textContent=fmtDate(selectedDay,{weekday:'long',day:'numeric',month:'long'});
 const sessions=state.sessions.filter(s=>sessionDate(s)===selectedDay);
 $('#calendar-day-detail').innerHTML=sessions.length?sessions.map(sessionCard).join(''):'<div class="empty-state">An diesem Tag ist kein Training gespeichert.</div>';
}
function renderHistory(){const arr=[...state.sessions].sort((a,b)=>b.startedAt.localeCompare(a.startedAt));$('#history-list').innerHTML=arr.length?arr.map(s=>`<article class="list-card"><div class="plan-card"><div><strong>${esc(s.dayName)}</strong><small>${esc(s.planName)} · ${fmtDate(sessionDate(s))}</small></div><strong>${kg(s.volume)}</strong></div><div class="history-meta"><span>◷ ${Math.round(s.duration/60)} min</span><span>${s.exercises.length} Übungen</span><span>${s.completedSets} erledigte Sätze</span></div><button class="text-btn" data-session-detail="${s.id}">Details ansehen →</button></article>`).join(''):'<div class="empty-state">Noch keine abgeschlossenen Workouts.</div>';$$('[data-session-detail]').forEach(b=>b.onclick=()=>showSession(b.dataset.sessionDetail))}
function showSession(id){const s=state.sessions.find(x=>x.id===id);if(!s)return;openModal(`<h2>${esc(s.dayName)}</h2><p>${fmtDate(sessionDate(s))} · ${esc(s.planName)}</p><div class="stats-grid"><div class="stat-card"><strong>${kg(s.volume)}</strong><small>Volumen</small></div><div class="stat-card"><strong>${Math.round(s.duration/60)} min</strong><small>Dauer</small></div><div class="stat-card"><strong>${s.completedSets}</strong><small>Erledigte Sätze</small></div></div><div class="modal-list">${s.exercises.map(x=>`<div class="modal-exercise"><span><strong>${esc(x.name||exName(exerciseById(x.exerciseId))||'Übung')}</strong><small>${x.sets.map((set,i)=>`S${i+1}: ${set.weight} kg × ${set.reps}`).join(' · ')}</small></span></div>`).join('')}</div><button class="btn btn-primary btn-block" id="modal-cancel">Schließen</button>`);$('#modal-cancel').onclick=closeModal}
function rangeStart(range){const d=new Date();d.setHours(0,0,0,0);if(range==='week'){d.setDate(d.getDate()-((d.getDay()+6)%7));return d}if(range==='month'){d.setDate(1);return d}if(range==='year'){d.setMonth(0,1);return d}return new Date(0)}
function renderProgress(){
 const start=rangeStart(progressRange),sessions=state.sessions.filter(s=>new Date(s.startedAt)>=start),volume=sessions.reduce((a,s)=>a+s.volume,0),duration=sessions.reduce((a,s)=>a+s.duration,0);
 $('#stat-workouts').textContent=sessions.length;$('#stat-volume').textContent=kg(volume);$('#stat-duration').textContent=fmtNum(duration/3600)+' h';$('#stat-records').textContent=countRecords();
 drawVolumeChart(sessions);renderStrengthSelect();renderMuscles(sessions);renderBodyStats();
}
function drawCanvasChart(canvas,labels,values,unit){
 const ctx=canvas.getContext('2d'),w=canvas.clientWidth||320,h=190,dpr=window.devicePixelRatio||1;canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
 const pad={l:36,r:8,t:12,b:28},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b,max=Math.max(1,...values)*1.15;
 ctx.strokeStyle='#eee9f3';ctx.lineWidth=1;ctx.fillStyle='#938b9e';ctx.font='9px DM Sans';ctx.textAlign='right';
 for(let i=0;i<4;i++){const y=pad.t+ch*i/3;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText(fmtNum(max*(1-i/3)),pad.l-7,y+3)}
 if(!values.length){ctx.textAlign='center';ctx.fillText('Noch keine Daten vorhanden',w/2,h/2);return}
 const pts=values.map((v,i)=>({x:pad.l+(values.length===1?cw/2:cw*i/(values.length-1)),y:pad.t+ch-(v/max)*ch}));
 ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle='#8054d8';ctx.lineWidth=2.5;ctx.stroke();
 pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,3.5,0,Math.PI*2);ctx.fillStyle='#8054d8';ctx.fill()});
 ctx.fillStyle='#938b9e';ctx.textAlign='center';labels.forEach((l,i)=>{if(labels.length<=7||i===0||i===labels.length-1||i%Math.ceil(labels.length/5)===0)ctx.fillText(l,pts[i].x,h-7)});
}
function drawVolumeChart(sessions){
 const grouped={};sessions.forEach(s=>{const d=sessionDate(s);grouped[d]=(grouped[d]||0)+s.volume});const entries=Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).slice(-14);
 drawCanvasChart($('#volume-chart'),entries.map(x=>x[0].slice(5)),entries.map(x=>x[1]),'kg');
}
function renderStrengthSelect(){
 const ids=[...new Set(state.sessions.flatMap(s=>s.exercises.map(e=>e.exerciseId)))];const select=$('#exercise-stat-select');const old=select.value;
 select.innerHTML=ids.map(id=>{const e=exerciseById(id);return `<option value="${id}">${esc(e?exName(e):id)}</option>`}).join('')||'<option value="">Noch keine Daten</option>';
 if(ids.includes(old))select.value=old;drawStrengthChart(select.value);
}
function drawStrengthChart(id){
 const rows=[];state.sessions.slice().sort((a,b)=>a.startedAt.localeCompare(b.startedAt)).forEach(s=>s.exercises.filter(e=>e.exerciseId===id).forEach(e=>{const max=Math.max(0,...e.sets.map(x=>Number(x.weight)||0));if(max)rows.push({date:sessionDate(s),max})}));
 drawCanvasChart($('#strength-chart'),rows.map(x=>x.date.slice(5)),rows.map(x=>x.max),'kg');
}
function renderMuscles(sessions){
 const counts={};sessions.forEach(s=>s.exercises.forEach(e=>{const muscle=e.muscle||exerciseById(e.exerciseId)?.muscle||'Sonstige';counts[muscle]=(counts[muscle]||0)+e.sets.length}));
 const max=Math.max(1,...Object.values(counts));$('#muscle-stats').innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([name,n])=>`<div class="muscle-row"><span>${esc(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${n/max*100}%"></div></div><b>${n} Sätze</b></div>`).join('')||'<div class="no-data">Noch keine Trainingsdaten.</div>';
}
function countRecords(){const best={};let records=0;state.sessions.slice().sort((a,b)=>a.startedAt.localeCompare(b.startedAt)).forEach(s=>s.exercises.forEach(e=>e.sets.forEach(set=>{const w=Number(set.weight)||0;if(w>0&&w>(best[e.exerciseId]||0)){best[e.exerciseId]=w;records++}})));return records}
function renderBodyStats(){
 const latest=state.bodyEntries.slice().sort((a,b)=>b.date.localeCompare(a.date))[0];$('#body-stats').innerHTML=latest?Object.entries(latest.values).map(([k,v])=>`<div class="body-chip">${esc(k)}<strong>${esc(v)} ${k==='Körpergewicht'?'kg':'cm'}</strong></div>`).join(''):`<div class="no-data">Noch keine Körperdaten eingetragen.</div>`;
}
function addBodyEntry(){
 const names=['Körpergewicht','Brust','Taille','Hüfte','Oberarm','Unterarm','Oberschenkel','Wade','Nacken'];
 openModal(`<h2>Körperdaten eintragen</h2><p>Alle Felder sind optional. Du kannst eigene Messwerte ergänzen.</p><label class="field-label">Datum</label><input type="date" id="body-date" class="field" value="${todayISO()}"><div id="body-inputs">${names.map(n=>`<label class="field-label">${n} (${n==='Körpergewicht'?'kg':'cm'})</label><input class="field" type="number" step="0.1" min="0" data-body-name="${n}" placeholder="Optional">`).join('')}</div><label class="field-label">Eigener Messwert (optional)</label><input id="body-custom-name" class="field" placeholder="z. B. Schulter"><input id="body-custom-value" class="field" type="number" step="0.1" placeholder="Wert"><div class="modal-actions"><button class="btn btn-outline" id="modal-cancel">Abbrechen</button><button class="btn btn-primary" id="save-body">Speichern</button></div>`);
 $('#modal-cancel').onclick=closeModal;$('#save-body').onclick=()=>{const values={};$$('[data-body-name]').forEach(el=>{if(el.value!=='')values[el.dataset.bodyName]=Number(el.value)});const cn=$('#body-custom-name').value.trim(),cv=$('#body-custom-value').value;if(cn&&cv)values[cn]=Number(cv);if(!Object.keys(values).length){toast('Bitte mindestens einen Wert eintragen');return}state.bodyEntries.push({id:uid(),date:$('#body-date').value||todayISO(),values});saveState();closeModal();renderBodyStats();toast('Körperdaten gespeichert')};
}
function openModal(html){$('#modal-root').innerHTML=`<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;$('#modal-root').querySelector('.modal-backdrop').addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))closeModal()})}
function closeModal(){$('#modal-root').innerHTML=''}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`ironlog-backup-${todayISO()}.json`;a.click();URL.revokeObjectURL(url);toast('Backup exportiert')}
function importData(file){if(!file)return;const reader=new FileReader();reader.onload=async()=>{try{const parsed=JSON.parse(reader.result);if(!parsed||!Array.isArray(parsed.sessions)||!Array.isArray(parsed.plans)||!Array.isArray(parsed.exercises))throw new Error('Ungültiges Backup');if(!confirm('Das Backup ersetzt alle aktuell lokalen Daten. Vorher am besten ein Backup exportieren. Fortfahren?'))return;state=normalizeState(parsed);await saveState();toast('Backup importiert');showView('home')}catch(e){alert('Import fehlgeschlagen: '+e.message)}};reader.readAsText(file)}
function resetData(){if(!confirm('Wirklich alle lokalen IronLog-Daten löschen? Dieser Schritt kann nicht rückgängig gemacht werden.'))return;if(!confirm('Letzte Sicherheitsabfrage: Daten wirklich vollständig zurücksetzen?'))return;state=freshState();saveState().then(()=>{toast('Lokale Daten zurückgesetzt');showView('home')})}
function bindStatic(){
 $('#home-start').onclick=()=>showView('workout');$('#add-plan').onclick=addPlan;$('#add-exercise').onclick=addExercise;
 $('#exercise-search').oninput=renderExercises;$('#exercise-filters').onclick=e=>{const b=e.target.closest('[data-filter]');if(!b)return;exerciseFilter=b.dataset.filter;$$('.filter-chip').forEach(x=>x.classList.toggle('selected',x===b));renderExercises()};
 $('#workout-plan-select').onchange=updateWorkoutDays;$('#workout-day-select').onchange=updateWorkoutDays;$('#begin-workout').onclick=startWorkout;
 $('#workout-add-exercise').onclick=()=>openExercisePicker(e=>{state.activeWorkout.exercises.push({id:uid(),exerciseId:e.id,rest:Number(state.settings.defaultRest),sets:[{weight:0,reps:10,done:false},{weight:0,reps:10,done:false},{weight:0,reps:10,done:false}]});saveState();renderWorkout()});
 $('#finish-workout').onclick=finishWorkout;$('#cancel-workout').onclick=cancelWorkout;
 $('#rest-toggle').onclick=toggleRest;$('#rest-plus').onclick=()=>{restRemaining=Math.min(3600,restRemaining+10);$('#rest-display').textContent=timerFormat(restRemaining)};$('#rest-minus').onclick=()=>{restRemaining=Math.max(0,restRemaining-10);$('#rest-display').textContent=timerFormat(restRemaining)};$('#rest-reset').onclick=()=>{if(restInterval){clearInterval(restInterval);restInterval=null}restRemaining=Number(state.settings.defaultRest)||90;$('#rest-display').textContent=timerFormat(restRemaining);$('#rest-toggle').textContent='Start';$('#rest-status').textContent='Bereit, wenn du es bist.'};
 $('#cal-prev').onclick=()=>{calDate.setMonth(calDate.getMonth()-1);renderCalendar()};$('#cal-next').onclick=()=>{calDate.setMonth(calDate.getMonth()+1);renderCalendar()};
 $('#progress-range').onclick=e=>{const b=e.target.closest('[data-range]');if(!b)return;progressRange=b.dataset.range;$$('#progress-range button').forEach(x=>x.classList.toggle('selected',x===b));renderProgress()};
 $('#exercise-stat-select').onchange=e=>drawStrengthChart(e.target.value);$('#add-body-entry').onclick=addBodyEntry;
 $('#export-data').onclick=exportData;$('#import-data').onchange=e=>importData(e.target.files[0]);$('#reset-data').onclick=resetData;
 $('#language-select').onchange=e=>{state.settings.language=e.target.value;saveState();renderExercises();renderPlans();if(state.activeWorkout)renderWorkout()};
 $('#unit-select').onchange=e=>{state.settings.unit=e.target.value;saveState();if(state.activeWorkout)renderWorkout()};
 $('#default-rest').onchange=e=>{state.settings.defaultRest=Number(e.target.value);saveState()};
}
function initSettings(){ $('#language-select').value=state.settings.language;$('#unit-select').value=state.settings.unit;$('#default-rest').value=String(state.settings.defaultRest)}
function setupTouchReorder(){
 document.addEventListener('pointermove',e=>{if(!dragId||e.pointerType!=='touch')return;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.active-exercise');$$('.active-exercise').forEach(c=>c.classList.remove('drop-target'));dropTargetId=target?.dataset.activeEx||null;if(target&&dropTargetId!==dragId)target.classList.add('drop-target')});
 document.addEventListener('pointerup',e=>{if(e.pointerType!=='touch'||!dragId)return;const from=dragId,to=dropTargetId;dragId=null;dropTargetId=null;$$('.active-exercise').forEach(c=>c.classList.remove('dragging','drop-target'));if(from&&to&&from!==to){const arr=state.activeWorkout?.exercises;if(!arr)return;const a=arr.findIndex(x=>x.id===from),b=arr.findIndex(x=>x.id===to);if(a>=0&&b>=0){const [item]=arr.splice(a,1);arr.splice(b,0,item);saveState();renderWorkout()}}});
}
async function init(){
 state=await loadState();if(!state.plans.length)state.plans=seedPlans;
 bindStatic();navSetup();initSettings();setupTouchReorder();
 if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('SW registration',e));
 if(state.activeWorkout){restRemaining=Number(state.settings.defaultRest)||90;showView('workout')}else showView('home');
 window.addEventListener('resize',()=>{if(currentView==='progress')renderProgress()});
}
init();
})();