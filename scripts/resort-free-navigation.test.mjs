import assert from 'node:assert/strict';
import * as THREE from '../resort-3d/vendor/three.module.js';
import {createFreeNavigation} from '../resort-3d/free-navigation.js';
class Element extends EventTarget{
 constructor(){super();this.attrs={};this.dataset={};this.children=[];this.classList={toggle(){},add(){},remove(){}};}
 setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]||null;}removeAttribute(k){delete this.attrs[k];}
 matches(){return false;}contains(el){return el===this||this.children.includes(el);}querySelectorAll(){return this.children;}
 focus(){}setPointerCapture(){}
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
