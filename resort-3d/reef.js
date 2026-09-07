import * as THREE from './vendor/three.module.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
import {reefFloor,fishTypes} from './reef-layout.js';

// Shared, low-resolution geometry is baked into a handful of vertex-colour batches.
// Fish of the same type use one instanced draw; no image textures or shadow passes.
export function createReef(){
 const root=new THREE.Group();root.name='Le récif de La Tortue';
 const staticParts=[],animalParts=[],schools=[];
 const sphere=new THREE.SphereGeometry(1,12,8);
 const matrix=new THREE.Matrix4(),rotation=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0);
 const white=new THREE.Color(),pose=new THREE.Object3D();
 let seed=1826,time=0;
 const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 function piece(list,geometry,color,position,scale,quaternion){
  const g=geometry.clone();matrix.compose(new THREE.Vector3(...position),quaternion||new THREE.Quaternion(),new THREE.Vector3(...scale));g.applyMatrix4(matrix);
  g.deleteAttribute('uv');white.set(color);const colors=new Float32Array(g.attributes.position.count*3);
  for(let i=0;i<colors.length;i+=3){colors[i]=white.r;colors[i+1]=white.g;colors[i+2]=white.b;}
  g.setAttribute('color',new THREE.BufferAttribute(colors,3));list.push(g);
 }
 const blob=(list,color,p,s)=>piece(list,sphere,color,p,s);
 function rod(list,color,a,b,r1,r2=r1){
  const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av);
  const g=new THREE.CylinderGeometry(r2,r1,d.length(),7);rotation.setFromUnitVectors(up,d.normalize());
  piece(list,g,color,av.add(bv).multiplyScalar(.5).toArray(),[1,1,1],rotation);g.dispose();
 }
 function finish(list,name,instanced=0){
  const geometry=mergeGeometries(list);list.forEach(g=>g.dispose());
  const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,side:THREE.DoubleSide});
  const mesh=instanced?new THREE.InstancedMesh(geometry,material,instanced):new THREE.Mesh(geometry,material);
  mesh.name=name;mesh.castShadow=false;mesh.receiveShadow=false;root.add(mesh);return mesh;
 }
 // Elliptical sandy slope. Colours and ripples are geometry, avoiding texture downloads.
 const points=[],colors=[],indices=[],rings=20,segments=96;
 for(let r=0;r<=rings;r++)for(let j=0;j<=segments;j++){
  const a=j/segments*Math.PI*2,k=r/rings,x=Math.cos(a)*11*k,z=-36+Math.sin(a)*5.4*k;
  points.push(x,reefFloor(x,z),z);const c=new THREE.Color('#a8ad94');c.multiplyScalar(.9+.1*Math.sin(x*4+z*9)**2);colors.push(c.r,c.g,c.b);
  if(r<rings&&j<segments){const n=r*(segments+1)+j;indices.push(n,n+1,n+segments+1,n+1,n+segments+2,n+segments+1);}
 }
 const floor=new THREE.BufferGeometry();floor.setAttribute('position',new THREE.Float32BufferAttribute(points,3));floor.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));floor.setIndex(indices);floor.computeVertexNormals();staticParts.push(floor);
 // Join the submerged slope to the waterline: no open gap beneath the shoreline.
 const bankPoints=[],bankColors=[],bankIndices=[];
 for(let j=0;j<=segments;j++){
  const a=j/segments*Math.PI*2,x=Math.cos(a)*11,z=-36+Math.sin(a)*5.4;
  bankPoints.push(x,-1.335,z,x,reefFloor(x,z)-.015,z);
  for(const color of ['#67a6a5','#939f88']){const c=new THREE.Color(color);bankColors.push(c.r,c.g,c.b);}
  if(j<segments){const n=j*2;bankIndices.push(n,n+1,n+2,n+1,n+3,n+2);}
 }
 const bank=new THREE.BufferGeometry();bank.setAttribute('position',new THREE.Float32BufferAttribute(bankPoints,3));bank.setAttribute('color',new THREE.Float32BufferAttribute(bankColors,3));bank.setIndex(bankIndices);bank.computeVertexNormals();staticParts.push(bank);
 // Several separated coral heads, with sandy channels between them.
 const patches=[[-7,-35,1.1],[-4.2,-37,1.3],[.4,-35.4,1.2],[4.5,-36.7,1.2],[7.7,-34.7,.7],[-.8,-39.5,.8],[5.2,-39,.8],[-7,-38,.75]];
 patches.forEach(([x,z,size],index)=>{
  const y=reefFloor(x,z);blob(staticParts,'#788777',[x,y+.1,z],[size,.34*size,size*.72]);
  // Branching fire/staghorn-like colonies with lighter growing tips.
  for(let j=0;j<18;j++){
   const a=random()*6.28,r=Math.sqrt(random())*size*.85,bx=x+Math.cos(a)*r,bz=z+Math.sin(a)*r,h=(.3+random()*.55)*size;
   const color=index%2?'#bd9561':'#c4b66e',tip=[bx+(random()-.5)*.15,y+h,bz+(random()-.5)*.15];
   rod(staticParts,color,[bx,y+.15,bz],tip,.055*size,.025*size);
   for(let k=0;k<3;k++){const angle=k*2.1+a,end=[tip[0]+Math.cos(angle)*.18*size,tip[1]+.15*size,tip[2]+Math.sin(angle)*.18*size];rod(staticParts,color,[bx,y+h*.65,bz],end,.033*size,.013*size);blob(staticParts,'#e7dcb2',end,[.026,.037,.026]);}
  }
  // Tiered plate corals, rose/ochre lobes, and small brain-coral mounds.
  for(let j=0;j<3;j++){
   blob(staticParts,index%2?'#bd8b73':'#809f9a',[x+size*.7,y+.18+j*.16,z+.35],[size*(.6-j*.1),.075,size*(.42-j*.06)]);
  }
  const cx=x-size*.65,cz=z-.35;
  blob(staticParts,'#929d63',[cx,y+.27,cz],[size*.45,.34,size*.38]);
  for(let j=0;j<14;j++){
   const a=j*.65;blob(staticParts,'#c1ba7f',[cx+Math.cos(a)*size*.31,y+.28+Math.sin(j*.8)*.1,cz+Math.sin(a)*size*.27],[.10,.15,.08]);
  }
 });
 // Sea fans: repeated fine branches rather than solid coloured cards.
 for(const [x,z]of [[-5.6,-36.4],[3.4,-38.1],[6.1,-34.9]]){
  const y=reefFloor(x,z),color='#aa7581';rod(staticParts,color,[x,y,z],[x,y+1,z],.05,.025);
  for(let j=0;j<11;j++){
   const a=(j/10-.5)*2.3,ex=x+Math.sin(a)*.8,ey=y+.45+Math.cos(a)*.85;
   rod(staticParts,color,[x,y+.35,z],[ex,ey,z],.022,.008);
   for(let k=1;k<4;k++){const t=k/4;rod(staticParts,color,[x+(ex-x)*t,y+.35+(ey-y-.35)*t,z],[x+(ex-x)*t+.13, y+.5+(ey-y-.35)*t,z],.01,.004);}
  }
 }
 // Anemone beside the clownfish colony; sparse rubble, not a carpet of stones.
 for(let j=0;j<65;j++){
  const a=random()*6.28,r=Math.sqrt(random())*.55,x=-.7+Math.cos(a)*r,z=-34.8+Math.sin(a)*r,y=reefFloor(x,z);
  rod(staticParts,'#a6af91',[x,y,z],[x+.04,y+.22+random()*.16,z],.027,.018);
 }
 for(let j=0;j<50;j++){
  const a=random()*6.28,r=Math.sqrt(random()),x=Math.cos(a)*10*r,z=-36+Math.sin(a)*4.8*r;
  blob(staticParts,'#8c9788',[x,reefFloor(x,z)+.03,z],[.04+random()*.12,.045,.06+random()*.10]);
 }
 const habitat=finish(staticParts,'Coraux, anémones et fond sableux');habitat.updateMatrix();habitat.matrixAutoUpdate=false;

 function fin(list,color,vertices){
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices.flat(),3));g.setIndex([0,1,2]);g.computeVertexNormals();piece(list,g,color,[0,0,0],[1,1,1]);g.dispose();
 }
 function fishGeometry(type){
  const list=[],l=type.length,h=type.height,w=h*.35;
  blob(list,type.body,[0,0,0],[l*.44,h*.5,w]);
  blob(list,type.body,[l*.33,-h*.03,0],[l*.16,h*.28,w*.78]);
  fin(list,type.fin,[[-l*.37,0,0],[-l*.70,h*.37,0],[-l*.70,-h*.37,0]]);
  fin(list,type.fin,[[l*.2,h*.29,0],[-l*.27,h*.7,0],[-l*.36,h*.12,0]]);
  fin(list,type.fin,[[l*.15,-h*.22,0],[-l*.28,-h*.60,0],[-l*.31,-h*.15,0]]);
  for(const side of [-1,1]){
   fin(list,type.fin,[[l*.12,0,side*w*.8],[-l*.18,-h*.25,side*w*2],[-l*.16,0,side*w*.8]]);
   blob(list,'#efe8cb',[l*.30,h*.12,side*w*.76],[h*.10,h*.10,h*.07]);
   blob(list,'#122c32',[l*.32,h*.12,side*w*.83],[h*.055,h*.067,h*.05]);
  }
  if(type.pattern==='clown'||type.pattern==='cardinal'){
   for(const x of [-.24,.03,.25]){
    blob(list,'#433d34',[x*l,0,0],[l*.054,h*.51,w*1.03]);
    blob(list,type.pattern==='clown'?'#fff5db':'#d4bea0',[x*l,0,0],[l*.034,h*.52,w*1.06]);
   }
  }else if(type.pattern==='butterfly'){
   blob(list,'#293c3b',[l*.24,0,0],[l*.045,h*.44,w*.98]);
   for(const side of [-1,1])blob(list,'#3d4740',[-l*.17,h*.12,side*w*.96],[h*.12,h*.12,.012]);
  }else if(type.pattern==='surgeon'){
   for(const side of [-1,1])blob(list,'#284e72',[-l*.04,h*.1,side*w*.93],[l*.23,h*.12,.012]);
  }else if(type.pattern==='parrot'){
   for(const side of [-1,1])for(let j=0;j<8;j++)blob(list,j%2?'#68c5a3':'#aa9cba',[(j%4-1.7)*l*.15,(Math.floor(j/4)-.5)*h*.28,side*w*.95],[l*.06,h*.09,.015]);
  }
  return list;
 }
 fishTypes.forEach((type,s)=>{
  const mesh=finish(fishGeometry(type),type.name,type.count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const swimTime={value:0};mesh.material.onBeforeCompile=shader=>{
   shader.uniforms.swimTime=swimTime;
   shader.vertexShader='uniform float swimTime;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nfloat tailWeight = smoothstep(0.0, ${(type.length*.65).toFixed(4)}, -min(position.x, 0.0));\ntransformed.z += sin(swimTime * 5.0 + instanceMatrix[3].x * 2.0 + position.x * 9.0) * tailWeight * ${(type.length*.09).toFixed(4)};`);
  };
  mesh.material.customProgramCacheKey=()=>`reef-fish-${s}`;
  // Frustum bounds remain conservative as fish move inside this fixed patch.
  mesh.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,-3,-36),13);
  const fish=Array.from({length:type.count},(_,i)=>({phase:random()*6.28,size:.82+random()*.35,offset:i,school:s}));
  schools.push({mesh,fish,swimTime});
 });
 // Turtle with domed shell, individual scutes, pale plastron, beak, eyes and four flippers.
 blob(animalParts,'#bfb68b',[0,-.08,0],[.58,.10,.43]);
 blob(animalParts,'#576a43',[0,.04,0],[.58,.24,.43]);
 for(let j=0;j<5;j++)blob(animalParts,'#a19a60',[(j-2)*.17,.245-Math.abs(j-2)*.035,0],[.11,.025,.13]);
 for(const side of [-1,1])for(let j=0;j<4;j++)blob(animalParts,j%2?'#8c8554':'#b0a774',[(j-1.5)*.21,.17,side*.24],[.13,.045,.12]);
 blob(animalParts,'#aaa67a',[.67,.0,0],[.23,.14,.14]);blob(animalParts,'#d0c4a0',[.84,-.035,0],[.09,.07,.10]);
 for(const side of [-1,1]){blob(animalParts,'#182f2e',[.75,.055,side*.119],[.028,.028,.016]);blob(animalParts,'#888b5d',[-.47,-.05,side*.42],[.24,.06,.17]);}
 const turtle=finish(animalParts,'Tortue imbriquée');
 const flippers=[];
 for(const side of [-1,1]){
  const parts=[];blob(parts,'#919269',[-.13,-.10,side*.34],[.37,.06,.23]);
  for(let i=0;i<7;i++)blob(parts,'#535e43',[-.3+(i%3)*.14,-.041,side*(.2+Math.floor(i/3)*.12)],[.045,.012,.045]);
  const flipper=finish(parts,'Nageoire de tortue');flippers.push({mesh:flipper,side});
 }
 const tint=new THREE.Mesh(new THREE.CircleGeometry(1,96),new THREE.MeshBasicMaterial({color:'#72c3c0',transparent:true,opacity:.10,depthWrite:false,side:THREE.DoubleSide}));
 tint.rotation.x=-Math.PI/2;tint.scale.set(11,5.4,1);tint.position.set(0,-1.325,-36);tint.name='Fenêtre sur le récif';root.add(tint);
 function update(dt=0){
  time+=Math.min(dt,.1);
  for(const {mesh,fish,swimTime}of schools){
   swimTime.value=time;
   fish.forEach((f,i)=>{
    const a=f.phase+time*(.13+f.school*.012),school=f.school;
    let x,z,y;
    if(school===0){x=-.7+Math.cos(a)*.65;z=-34.8+Math.sin(a)*.42;y=reefFloor(x,z)+.55+Math.sin(a*2)*.1;}
    else if(school===4){x=-4.6+Math.cos(a)*1.3;z=-36.8+Math.sin(a)*.7;y=-2.5+Math.sin(a*2)*.15;}
    else if(school===5){x=Math.cos(time*.1)*4+(i%4)*.35-1;z=-37.7+Math.sin(time*.1)*.65+Math.floor(i/4)*.25;y=-2.2+Math.sin(i)*.12;}
    else {x=Math.cos(a)*(4+school*.9);z=-36.7+Math.sin(a)*(1.6+school*.12);y=-2.2-school*.18+Math.sin(a*2)*.12;}
    y=Math.max(y,reefFloor(x,z)+.45);
    pose.position.set(x,y,z);pose.rotation.set(0,school===5?Math.PI/2:Math.atan2(-Math.cos(a)*2,-Math.sin(a)*5),0);pose.scale.setScalar(f.size);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
   });mesh.instanceMatrix.needsUpdate=true;
  }
  const a=time*.075+.7;turtle.position.set(Math.cos(a)*3,-2.05+Math.sin(a*2)*.12,-37.6+Math.sin(a)*1.1);turtle.rotation.y=Math.atan2(-Math.cos(a)*1.1,-Math.sin(a)*3);
  flippers.forEach(({mesh,side})=>{mesh.position.copy(turtle.position);mesh.quaternion.copy(turtle.quaternion);mesh.translateX(.25);mesh.translateZ(side*.34);mesh.rotateX(Math.sin(time*1.7)*.28*side);});
 }
 update();sphere.dispose();
 return {root,update,setUnderwater(value){tint.visible=!value;},bounds:new THREE.Sphere(new THREE.Vector3(0,-3,-36),12)};
}

// Cut just this small oval out of the existing opaque water. The coast is unchanged.
export function openWaterWindow(model){
 model.traverse(mesh=>{
  if(!mesh.isMesh||!/(^| )water$/.test(mesh.material?.name||''))return;
  mesh.material=mesh.material.clone();mesh.castShadow=false;
  mesh.material.onBeforeCompile=shader=>{
   shader.vertexShader='varying vec3 reefWorld;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nreefWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
   shader.fragmentShader='varying vec3 reefWorld;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif (length((reefWorld.xz - vec2(0.0, -36.0)) / vec2(11.0, 5.4)) < 1.0) discard;');
  };
  mesh.material.customProgramCacheKey=()=> 'reef-water-window-1';mesh.material.needsUpdate=true;
 });
}
