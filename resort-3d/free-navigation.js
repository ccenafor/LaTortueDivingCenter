import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {flightDelta,limitFlight} from './flight-motion.js?v=reef-18';

// Overview gestures can translate the camera target instead of orbiting a fixed pin.
export function createOrbitNavigation(camera,canvas){
 const controls=new OrbitControls(camera,canvas);
 controls.enableDamping=true;controls.dampingFactor=.08;
 controls.minDistance=1.5;controls.maxDistance=120;controls.maxPolarAngle=Math.PI*.48;
 controls.enablePan=true;controls.screenSpacePanning=true;
 return controls;
}

export function createFreeNavigation({camera,controls,canvas,panel,toggle,onExit,onEnter,onChange=()=>{},onModeChange=()=>{}}){
 let active=false,yaw=0,pitch=0,drag=null;
 const keys=new Set(),held=new Map(),euler=new THREE.Euler(0,0,0,'YXZ');
 const originalLabel=canvas.getAttribute('aria-label');
 const keyActions={w:'forward',z:'forward',s:'back',a:'left',q:'left',d:'right',ArrowUp:'forward',ArrowDown:'back',ArrowLeft:'turnLeft',ArrowRight:'turnRight',r:'up',f:'down',i:'lookUp',k:'lookDown',Shift:'fast'};
 const isEditable=el=>el?.matches('input,select,textarea,[contenteditable="true"]');
 function clear(){keys.clear();held.clear();drag=null;panel.querySelectorAll('[data-flight]').forEach(b=>b.classList.remove('held'));}
 function orient(){pitch=THREE.MathUtils.clamp(pitch,-1.35,1.35);camera.quaternion.setFromEuler(euler.set(pitch,yaw,0,'YXZ'));controls.target.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(3));onChange();}
 function moving(){return active&&([...keys].some(k=>keyActions[k]!=='fast')||held.size>0);}
 function step(dt,actions){
  const has=a=>actions.has(a)?1:0;
  yaw+=(has('turnLeft')-has('turnRight'))*dt*1.3;
  pitch+=(has('lookUp')-has('lookDown'))*dt;
  camera.position.add(flightDelta(yaw,has('forward')-has('back'),has('right')-has('left'),has('up')-has('down'),dt,has('fast')?7:2.8));
  limitFlight(camera.position);orient();
 }
 function setActive(value){
  clear();active=value;controls.enabled=!value;panel.hidden=!value;toggle.setAttribute('aria-pressed',String(value));
  toggle.textContent=value?'Quitter le mode libre':'Explorer librement';
  document.body.classList.toggle('free-mode',value);onModeChange(value);
  if(value){canvas.setAttribute('aria-label','Exploration libre du resort. Glisser pour regarder, WASD ou ZQSD pour se déplacer.');canvas.setAttribute('aria-describedby','flightHelp');}
  else{canvas.setAttribute('aria-label',originalLabel);canvas.removeAttribute('aria-describedby');}
  if(value){
   onEnter();euler.setFromQuaternion(camera.quaternion,'YXZ');yaw=euler.y;pitch=euler.x;orient();canvas.focus({preventScroll:true});
  }
 }
 canvas.addEventListener('pointerdown',e=>{
  if(!active||e.button!==0||drag)return;e.preventDefault();canvas.focus({preventScroll:true});
  drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener('pointermove',e=>{
  if(!active||drag?.id!==e.pointerId)return;
  yaw-=(e.clientX-drag.x)*.004;pitch-=(e.clientY-drag.y)*.004;
  drag.x=e.clientX;drag.y=e.clientY;orient();
 });
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{if(drag?.id===e.pointerId)drag=null;});
 window.addEventListener('keydown',e=>{
  if(!active||document.querySelector('dialog[open]')||isEditable(e.target))return;
  if(e.key==='Escape'){e.preventDefault();onExit();return;}
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  // Shortcuts only operate while the canvas or its flight controls have focus.
  if(e.target!==canvas&&!panel.contains(e.target))return;
  const key=e.key.length===1?e.key.toLowerCase():e.key,action=keyActions[key];if(!action)return;
  e.preventDefault();keys.add(key);if(!e.repeat&&action!=='fast')step(.05,new Set([action]));
 });
 window.addEventListener('keyup',e=>{keys.delete(e.key.length===1?e.key.toLowerCase():e.key);});
 window.addEventListener('blur',clear);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 document.addEventListener('focusin',e=>{if(active&&e.target!==canvas&&!panel.contains(e.target))clear();});
 for(const button of panel.querySelectorAll('[data-flight]')){
  button.addEventListener('pointerdown',e=>{
   if(!active||e.button!==0)return;e.preventDefault();button.focus({preventScroll:true});button.setPointerCapture(e.pointerId);
   held.set(e.pointerId,button.dataset.flight);button.classList.add('held');step(.05,new Set([button.dataset.flight]));
  });
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,e=>{held.delete(e.pointerId);button.classList.remove('held');});
  button.addEventListener('click',e=>{if(active&&e.detail===0)step(.05,new Set([button.dataset.flight]));});
 }
 return {get active(){return active;},get moving(){return moving();},setActive,clear,update(dt){if(moving())step(dt,new Set([...keys].map(k=>keyActions[k]).concat([...held.values()])));}};
}
