import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../resort-3d/vendor/three.module.js';
import {createReef,openWaterWindow} from '../resort-3d/reef.js';
import {reefBounds,reefFloor,inReef,fishTypes,shouldAnimateReef} from '../resort-3d/reef-layout.js';
import {limitFlight} from '../resort-3d/flight-motion.js';
import {stops} from '../resort-3d/stops.js';

const started=performance.now(),reef=createReef();
assert.equal(fishTypes.length,6);assert.equal(fishTypes.reduce((n,s)=>n+s.count,0),41);
assert.equal(reef.root.children.length,16,'bounded extra draw calls');
let vertices=0,triangles=0;
reef.root.traverse(mesh=>{
 if(!mesh.isMesh)return;
 vertices+=mesh.geometry.attributes.position.count;
 triangles+=(mesh.geometry.index?.count||mesh.geometry.attributes.position.count)/3*(mesh.count||1);
 assert.equal(mesh.castShadow,false,'no extra shadow rendering');
 for(const n of mesh.geometry.attributes.position.array)assert.ok(Number.isFinite(n));
});
assert.ok(vertices<50000);assert.ok(triangles<500000);
const fish=reef.root.children.filter(o=>o.isInstancedMesh&&!o.userData.coral),before=fish[0].instanceMatrix.array.slice();
reef.update(.05);assert.notDeepEqual(fish[0].instanceMatrix.array,before,'fish actually move');
// Simulate a complete swim cycle: animals remain submerged within the visible reef,
// with a margin above the seabed (no swimming through a sandy bank).
const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),previousPosition=new THREE.Vector3(),forward=new THREE.Vector3(),travel=new THREE.Vector3();
const colonies=reef.root.children.filter(o=>o.userData.coral);
const colonyCount=colonies.reduce((n,m)=>n+m.count,0);
assert.ok(colonyCount>=90&&colonyCount<=140,'intermediate density with sandy gaps');
assert.ok(inReef(0,-36)&&!inReef(13,-36)&&!inReef(10,-32),'compact oval, without the wide rectangular corners');
const occupied=new Set();
for(const colony of colonies)for(let i=0;i<colony.count;i++){
 colony.getMatrixAt(i,matrix);position.setFromMatrixPosition(matrix);
 assert.ok(inReef(position.x,position.z));
 occupied.add(`${Math.floor((position.x+15)/3)},${Math.floor((-position.z-31)/2)}`);
}
assert.ok(occupied.size>=18,'irregular coral heads distributed across the compact reef window');
for(let t=0;t<700;t++){
 const previous=fish.map(m=>m.instanceMatrix.array.slice());
 reef.update(.1);
 for(const school of fish)for(let i=0;i<school.count;i++){
  school.getMatrixAt(i,matrix);position.setFromMatrixPosition(matrix);
  forward.setFromMatrixColumn(matrix,0).setY(0).normalize();
  previousPosition.setFromMatrixPosition(matrix.fromArray(previous[fish.indexOf(school)],i*16));
  travel.copy(position).sub(previousPosition).setY(0).normalize();
  assert.ok(forward.dot(travel)>.995,`${school.name} faces its direction of travel, including turns`);
  assert.ok(inReef(position.x,position.z));
  assert.ok(position.y<reefBounds.waterY-.15);
  assert.ok(position.y>reefFloor(position.x,position.z)+.2);
 }
}
const active={visible:true,enabled:true,reduced:false,close:true,hidden:false};
assert.equal(shouldAnimateReef(active),true);
for(const [key,value]of [['visible',false],['enabled',false],['reduced',true],['close',false],['hidden',true]])assert.equal(shouldAnimateReef({...active,[key]:value}),false,key);
const camera=new THREE.Vector3(0,-2.4,-36);limitFlight(camera);assert.equal(camera.y,-2.4,'free swimming stays underwater');
camera.y=-20;limitFlight(camera);assert.ok(camera.y>reefFloor(camera.x,camera.z));
camera.set(0,-3,0);limitFlight(camera);assert.equal(camera.y,.25,'land navigation is unchanged');
const model=new THREE.Group(),water=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());water.material.name='V17 water';model.add(water);
const ground=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());ground.material.name='V17 gravel';model.add(ground);const originalGround=ground.material;
openWaterWindow(model);const shader={vertexShader:'#include <begin_vertex>',fragmentShader:'#include <clipping_planes_fragment>'};water.material.onBeforeCompile(shader);
assert.match(shader.fragmentShader,/discard/);assert.equal(ground.material,originalGround,'resort materials unchanged');
const stop=stops.find(s=>s.reef);assert.ok(stop.views.inside.pos[1]<reefBounds.waterY);
for(const photo of stop.photos)assert.ok(fs.existsSync(new URL('..'+photo,import.meta.url)),'reference photo exists');
console.log('PASS reef geometry, 41 fish / 6 varieties, water cutaway, full swim cycle, pause/reduced-motion/offscreen gates, free swim, photos.');
console.log(JSON.stringify({drawCalls:reef.root.children.length,vertices,triangles,constructionAndTestsMs:Math.round(performance.now()-started)}));
