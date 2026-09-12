import assert from 'node:assert/strict';
import * as THREE from '../resort-3d/vendor/three.module.js';
import {createFreeNavigation,createOrbitNavigation} from '../resort-3d/free-navigation.js';
class Element extends EventTarget{
 constructor(){super();this.style={};this.clientWidth=800;this.clientHeight=600;this.attrs={};this.dataset={};this.children=[];this.classList={toggle(){},add(){},remove(){}};}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]||null;}removeAttribute(k){delete this.attrs[k];}
 matches(){return false;}contains(el){return el===this||this.children.includes(el);}querySelectorAll(){return this.children;}
 focus(){}setPointerCapture(){}releasePointerCapture(){}getRootNode(){return document;}
}
globalThis.window=new EventTarget();globalThis.document=new EventTarget();document.body=new Element();document.querySelector=()=>null;
const canvas=new Element(),panel=new Element(),toggle=new Element(),button=new Element();button.dataset.flight='forward';panel.children=[button];
const camera=new THREE.PerspectiveCamera();camera.position.set(0,1.7,20);
const controls={enabled:true,target:new THREE.Vector3()};let nav,wakes=0;
nav=createFreeNavigation({camera,controls,canvas,panel,toggle,onChange(){wakes++;},onEnter(){},onExit(){nav.setActive(false);}});
function emit(target,type,props={}){const e=new Event(type,{cancelable:true});for(const [k,v]of Object.entries(props))Object.defineProperty(e,k,{value:v});target.dispatchEvent(e);return e;}
nav.setActive(true);assert.equal(controls.enabled,false);assert.equal(panel.hidden,false);
emit(window,'keydown',{key:'w',target:canvas,repeat:false});const initial=camera.position.z;nav.update(.04);assert.ok(camera.position.z<initial);
emit(window,'keyup',{key:'w'});const released=camera.position.clone();nav.update(.04);assert.ok(camera.position.equals(released));
emit(window,'keydown',{key:'z',target:canvas});emit(window,'blur');const blurred=camera.position.clone();nav.update(.04);assert.ok(camera.position.equals(blurred));
emit(button,'pointerdown',{button:0,pointerId:1});const held=camera.position.z;nav.update(.04);assert.ok(camera.position.z<held);
emit(button,'pointercancel',{pointerId:1});const cancelled=camera.position.clone();nav.update(.04);assert.ok(camera.position.equals(cancelled));
const beforeShortcut=camera.position.clone();const shortcut=emit(window,'keydown',{key:'r',ctrlKey:true,target:canvas});nav.update(.04);assert.ok(camera.position.equals(beforeShortcut));assert.equal(shortcut.defaultPrevented,false);
emit(window,'keydown',{key:'Escape',target:canvas});assert.equal(nav.active,false);assert.equal(controls.enabled,true);assert.equal(panel.hidden,true);
console.log('PASS: held keys, release, blur, pointer cancellation, browser shortcut and Escape.');

nav.setActive(true);const idleWakes=wakes;nav.update(.04);assert.equal(wakes,idleWakes);assert.equal(nav.moving,false);
emit(window,'keydown',{key:'Shift',target:canvas});assert.equal(nav.moving,false);
emit(window,'keydown',{key:'w',target:canvas});assert.equal(nav.moving,true);assert.ok(wakes>idleWakes);
emit(window,'keyup',{key:'w'});assert.equal(nav.moving,false);
console.log('PASS: free navigation wakes rendering only on movement.');

// Exercise the actual viewer orbit configuration with pointer events.
const orbitCanvas=new Element(),orbitCamera=new THREE.PerspectiveCamera();orbitCamera.position.set(10,12,20);
const orbit=createOrbitNavigation(orbitCamera,orbitCanvas);
function settle(){for(let i=0;i<180;i++)orbit.update();}
const startTarget=orbit.target.clone(),startCamera=orbitCamera.position.clone();
emit(orbitCanvas,'pointerdown',{pointerId:2,pointerType:'mouse',button:2,clientX:300,clientY:200});
emit(orbitCanvas,'pointermove',{pointerId:2,pointerType:'mouse',clientX:420,clientY:260});
emit(orbitCanvas,'pointerup',{pointerId:2,pointerType:'mouse'});settle();
const targetShift=orbit.target.clone().sub(startTarget),cameraShift=orbitCamera.position.clone().sub(startCamera);
assert.ok(targetShift.length()>1,'right drag releases the fixed target');
assert.ok(targetShift.distanceTo(cameraShift)<1e-8,'camera and target translate together');
const beforeTouch=orbit.target.clone();
for(const [pointerId,pageX] of [[3,200],[4,300]])emit(orbitCanvas,'pointerdown',{pointerId,pointerType:'touch',pageX,pageY:200});
emit(orbitCanvas,'pointermove',{pointerId:3,pointerType:'touch',pageX:230,pageY:240});
emit(orbitCanvas,'pointermove',{pointerId:4,pointerType:'touch',pageX:330,pageY:240});
for(const pointerId of [3,4])emit(orbitCanvas,'pointerup',{pointerId,pointerType:'touch'});
settle();assert.ok(orbit.target.distanceTo(beforeTouch)>.1,'two fingers also translate the target');
let modeChanges=[];const integrated=createFreeNavigation({camera:orbitCamera,controls:orbit,canvas:orbitCanvas,panel,toggle,onEnter(){},onExit(){},onModeChange(active){modeChanges.push(active);}});
integrated.setActive(true);const freeCamera=orbitCamera.position.clone();
emit(orbitCanvas,'pointerdown',{pointerId:5,pointerType:'mouse',button:0,clientX:300,clientY:200});
emit(orbitCanvas,'pointermove',{pointerId:5,pointerType:'mouse',clientX:390,clientY:220});
emit(orbitCanvas,'pointerup',{pointerId:5,pointerType:'mouse'});
assert.ok(orbitCamera.position.equals(freeCamera),'free look rotates in place rather than orbiting');
emit(window,'keydown',{key:'w',target:orbitCanvas});integrated.update(.04);emit(window,'keyup',{key:'w'});
assert.ok(orbitCamera.position.distanceTo(freeCamera)>.1,'walking changes position independently of the old focus');
integrated.setActive(false);assert.deepEqual(modeChanges,[true,false]);orbit.dispose();
console.log('PASS: right-drag and two-finger pan, free look, walking and mode callbacks.');
