import assert from 'node:assert/strict';
import {createPets,petDefinitions,shouldAnimatePets} from '../resort-3d/pets.js';
const model=createPets();
assert.deepEqual(model.pets.map(p=>p.name),['Dolly','Panda','Blossom','Bubbles','Buttercup']);
assert.equal(model.pets.filter(p=>p.kind==='dog').length,2);
assert.equal(model.pets.filter(p=>p.kind==='cat').length,3);
let triangles=0,draws=0;
model.root.traverse(o=>{if(o.isMesh){draws++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;for(const x of o.geometry.attributes.position.array)assert.ok(Number.isFinite(x));}});
assert.ok(draws<=40);assert.ok(triangles<45000);
for(let i=0;i<2400;i++){
 const before=model.pets.map(p=>p.root.position.clone());model.update(.05);
 model.pets.forEach((p,j)=>{
  assert.equal(p.root.position.y,p.origin[1]);
  assert.ok(Math.abs(p.root.position.x-p.origin[0])<=p.radius+.001);
  assert.ok(Math.abs(p.root.position.z-p.origin[2])<=p.radius*.65+.001);
  const d=p.root.position.clone().sub(before[j]);
  if(d.lengthSq()>1e-9){const heading=new (p.root.position.constructor)(Math.sin(p.root.rotation.y),0,Math.cos(p.root.rotation.y));assert.ok(heading.dot(d.normalize())>.99,'Animals must face their movement');}
 });
}
const base={enabled:true,reduced:false,hidden:false,close:true,visible:true};
assert.equal(shouldAnimatePets(base),true);
for(const [key,val]of [['enabled',false],['reduced',true],['hidden',true],['close',false],['visible',false]])assert.equal(shouldAnimatePets({...base,[key]:val}),false);
console.log('PASS five named pets, finite geometry, bounded court routes, forward gait and animation gates.',JSON.stringify({draws,triangles}));
