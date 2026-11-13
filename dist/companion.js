// The companion shares the course's local storage and import/export lifecycle.
const miloAnimations=[
{id:'pfote-lecken',label:'Milo leckt gelangweilt seine Pfote'},
{id:'katzenbuckel',label:'Milo macht einen Katzenbuckel'},
{id:'ball-spielen',label:'Milo spielt auf dem Rücken mit einem Ball'},
{id:'schlafen',label:'Milo schläft zusammengerollt'},
{id:'sarkastisch',label:'Milo blickt sarkastisch drein'},
{id:'futter-betteln',label:'Milo bettelt um Futter'},
{id:'gluecklich-huepfen',label:'Milo hüpft glücklich'},
{id:'beine-strecken',label:'Milo liegt auf dem Rücken und streckt alle Beine in die Höhe'},
{id:'gaehnen',label:'Milo gähnt'},
{id:'schnurren',label:'Milo sitzt zufrieden da und schnurrt'}
];
let miloAnimationIndex=Math.floor(Math.random()*miloAnimations.length),lastMiloTask=null;
const miloMotion=typeof window.matchMedia==='function'?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
function miloImageSource(){const pose=miloAnimations[miloAnimationIndex];return `assets/milo/${pose.id}.${miloMotion?.matches?'png':'gif?play=once-v1'}`}
function syncMiloTask(){const task=view==='course'?`${state.activeTopic}:${state.current}`:null;if(task!==null&&task!==lastMiloTask){miloAnimationIndex=(miloAnimationIndex+1+Math.floor(Math.random()*(miloAnimations.length-1)))%miloAnimations.length;paintCompanion()}lastMiloTask=task}
let tipIndex=0,tipTimer,tipExpanded=true;
const companion=document.createElement('aside');companion.className='companion';companion.setAttribute('aria-label','Milo, dein Lernbegleiter');document.body.appendChild(companion);
function paintCompanion(){const tips=state.companion.tips;tipIndex=tipIndex%tips.length;const markup=`<section id="milo-tip" class="tip-bubble glass" ${tipExpanded?'':'hidden'}><div class="tip-heading"><span><i></i> MILOS NATUR- & LERNTIPP</span><button class="bubble-close" aria-label="Tipp einklappen" onclick="toggleTip(false)">×</button></div><p>${esc(tips[tipIndex])}</p><div class="tip-controls"><span>${tipIndex+1} / ${tips.length}</span><button onclick="nextTip(true)" aria-label="Nächsten Tipp anzeigen">Nächster Tipp <span>→</span></button></div></section><button class="cat-button" aria-label="${tipExpanded?'Milos Tipp einklappen':'Milos Tipps anzeigen'}" aria-expanded="${tipExpanded}" aria-controls="milo-tip" onclick="toggleTip(!tipExpanded)"><span class="cat-shadow"></span><img class="milo-animation" src="${miloImageSource()}" alt="${miloAnimations[miloAnimationIndex].label}" width="160" height="160" onerror="this.onerror=null;this.src='assets/kater.webp'"><span class="cat-name">Milo <span>✧</span></span></button>`;
// Updating the tip must leave the existing GIF element and its playback intact.
const currentImage=typeof companion.querySelector==='function'?companion.querySelector('.milo-animation'):null;
if(currentImage&&currentImage.getAttribute('src')===miloImageSource()){
 const template=document.createElement('template');template.innerHTML=markup;
 companion.querySelector('#milo-tip').replaceWith(template.content.querySelector('#milo-tip'));
 const button=companion.querySelector('.cat-button');
 button.setAttribute('aria-expanded',String(tipExpanded));
 button.setAttribute('aria-label',tipExpanded?'Milos Tipp einklappen':'Milos Tipps anzeigen');
 return;
}
companion.innerHTML=markup}
function nextTip(manual=false){tipIndex=(tipIndex+1)%state.companion.tips.length;paintCompanion();if(manual)restartTipTimer()}
function toggleTip(show){tipExpanded=show;paintCompanion();restartTipTimer()}
function restartTipTimer(){clearInterval(tipTimer);if(!document.hidden&&tipExpanded&&state.companion.tips.length>1)tipTimer=setInterval(()=>nextTip(),state.companion.interval*1000)}
function refreshCompanion(){tipIndex=0;paintCompanion();restartTipTimer()}
document.addEventListener('visibilitychange',restartTipTimer);
if(miloMotion&&typeof miloMotion.addEventListener==='function')miloMotion.addEventListener('change',()=>paintCompanion());
function mountCompanionEditor(){if(view!=='admin'||document.querySelector('#companion-editor'))return;const host=document.querySelector('.admin-grid');if(!host)return;const section=document.createElement('section');section.className='admin-card glass companion-editor';section.id='companion-editor';section.innerHTML=`<div class="companion-editor-intro"><img src="assets/kater.webp" alt="Milo" width="80" height="80"><div><span class="eyebrow">DEIN KLEINER LERNBEGLEITER</span><h3>Milos Tipps bearbeiten</h3><p>Milo zeigt deine Tipps unten rechts. Du kannst bis zu 30 Tipps mit jeweils 240 Zeichen hinterlegen.</p></div></div><form id="tips-form"><label for="tips-text">Tipps · ein Tipp pro Zeile</label><textarea id="tips-text" rows="7" required>${esc(state.companion.tips.join('\n'))}</textarea><label for="tips-interval">Automatischer Wechsel (10–120 Sekunden)</label><input id="tips-interval" type="number" min="10" max="120" step="1" value="${state.companion.interval}" required><p>Tipps und Intervall werden gespeichert und beim Datenexport mitgesichert. Mit einem Klick auf Milo lassen sich die Tipps einklappen.</p><button class="primary" type="submit">Tipps speichern ✓</button></form>`;host.appendChild(section);document.querySelector('#tips-form').onsubmit=e=>{e.preventDefault();const tips=document.querySelector('#tips-text').value.split('\n').map(t=>t.trim()).filter(Boolean),interval=Number(document.querySelector('#tips-interval').value);if(!tips.length||tips.length>30||tips.some(t=>t.length>240)||!Number.isInteger(interval)||interval<10||interval>120)return toast('Bitte 1–30 Tipps mit maximal 240 Zeichen und ein Intervall von 10–120 Sekunden eingeben.');state.companion={tips,interval};save();refreshCompanion();if(storageOK)toast('Milos Tipps sind gespeichert.')}}
refreshCompanion();
