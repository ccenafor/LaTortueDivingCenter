import * as THREE from './vendor/three.module.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
import {reefFloor,fishTypes,reefBounds,reefEdge,inReef} from './reef-layout.js?v=20';

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
 function rod(list,color,a,b,r1,r2=r1,segments=7){
  const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av);
  const g=new THREE.CylinderGeometry(r2,r1,d.length(),segments);rotation.setFromUnitVectors(up,d.normalize());
  piece(list,g,color,av.add(bv).multiplyScalar(.5).toArray(),[1,1,1],rotation);g.dispose();
 }
 function finish(list,name,instanced=0){
  const geometry=mergeGeometries(list);list.forEach(g=>g.dispose());
  const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,side:THREE.DoubleSide});
  const mesh=instanced?new THREE.InstancedMesh(geometry,material,instanced):new THREE.Mesh(geometry,material);
  mesh.name=name;mesh.castShadow=false;mesh.receiveShadow=false;root.add(mesh);return mesh;
 }
 // Broad near-shore slope. Colours and ripples are geometry, avoiding texture downloads.
 const points=[],colors=[],indices=[],rings=20,segments=96;
 for(let r=0;r<=rings;r++)for(let j=0;j<=segments;j++){
  const a=j/segments*Math.PI*2,k=r/rings,[x,z]=reefEdge(a,k);
  points.push(x,reefFloor(x,z),z);const c=new THREE.Color('#a8ad94');c.multiplyScalar(.9+.1*Math.sin(x*4+z*9)**2);colors.push(c.r,c.g,c.b);
  if(r<rings&&j<segments){const n=r*(segments+1)+j;indices.push(n,n+1,n+segments+1,n+1,n+segments+2,n+segments+1);}
 }
 const floor=new THREE.BufferGeometry();floor.setAttribute('position',new THREE.Float32BufferAttribute(points,3));floor.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));floor.setIndex(indices);floor.computeVertexNormals();staticParts.push(floor);
 // Join the submerged slope to the waterline: no open gap beneath the shoreline.
 const bankPoints=[],bankColors=[],bankIndices=[];
 for(let j=0;j<=segments;j++){
  const a=j/segments*Math.PI*2,[x,z]=reefEdge(a);
  bankPoints.push(x,-1.335,z,x,reefFloor(x,z)-.015,z);
  for(const color of ['#67a6a5','#939f88']){const c=new THREE.Color(color);bankColors.push(c.r,c.g,c.b);}
  if(j<segments){const n=j*2;bankIndices.push(n,n+1,n+2,n+1,n+3,n+2);}
 }
 const bank=new THREE.BufferGeometry();bank.setAttribute('position',new THREE.Float32BufferAttribute(bankPoints,3));bank.setAttribute('color',new THREE.Float32BufferAttribute(bankColors,3));bank.setIndex(bankIndices);bank.computeVertexNormals();staticParts.push(bank);
 // Spaced coastal colonies leave sandy gaps between the five shared coral shapes.
 // Varied scale, rotation and colour break repetition without duplicating geometry.
 const coralSphere=new THREE.SphereGeometry(1,8,5);
 const coralBlob=(list,color,p,s)=>piece(list,coralSphere,color,p,s);
 const colonies=Array.from({length:5},()=>[]);
 // Uneven colonies grow around irregular reef heads, separated by a winding
 // sandy channel. Rejection sampling avoids both rows and evenly spaced points.
 const heads=[[-7.4,-34.8,1.4,.85,0],[-5.8,-38.3,1.5,1.1,2],[-2.7,-35.9,1.2,1.4,1],[-2.5,-32.7,1.3,.65,3],[3.1,-33.3,1.5,.65,4],[5.6,-35.6,1.5,1.15,0],[6.3,-38.4,1.3,.95,2],[2.3,-39.7,1.4,.65,3],[-1.8,-39.6,1.1,.7,4]];
 const placed=[];
 for(let attempt=0;attempt<6000&&placed.length<120;attempt++){
  const [cx,cz,rx,rz,family]=heads[Math.floor(random()*heads.length)];
  const a=random()*Math.PI*2,r=Math.sqrt(random()),scattered=random()<.24;
  const x=scattered?Math.cos(a)*r*10.3:cx+Math.cos(a)*r*rx*1.45,z=scattered?-36+Math.sin(a)*r*4.8:cz+Math.sin(a)*r*rz*1.4;
  const size=.52+Math.pow(random(),.8)*.63;
  const channel=.55+1.25*Math.sin((z+37)*.8);
  if(!inReef(x,z,-.45)||Math.abs(x-channel)<.45)continue;
  if(placed.some(p=>Math.hypot(x-p.x,z-p.z)<.55*(size+p.size)))continue;
  const type=random()<.62?family:Math.floor(random()*5);
  const colony={x,z,size,angle:random()*6.28,stretchX:.75+random()*.5,stretchZ:.75+random()*.5,leanX:(random()-.5)*.18,leanZ:(random()-.5)*.18,shade:.83+random()*.26};
  placed.push(colony);colonies[type].push(colony);
 }
 // Low, irregular shared substrate connects the heads instead of giving every
 // coral its own identical circular plinth.
 for(const [x,z,rx,rz]of heads)for(let j=0;j<3;j++){
  const px=x+(random()-.5)*rx,pz=z+(random()-.5)*rz;
  blob(staticParts,j%2?'#8b9680':'#879386',[px,reefFloor(px,pz)-.03,pz],[.5+random()*.5,.10+random()*.12,.35+random()*.45]);
 }
 const coralNames=['Corail ramifié doré','Corail ramifié mauve','Corail en plateaux','Corail massif','Corail en rosettes'];
 const coralColors=['#c5a675','#9c8d9d','#849e8d','#a3a074','#b5907c'];
 colonies.forEach((instances,type)=>{
  const parts=[],color=coralColors[type];
  coralBlob(parts,'#798873',[.04,.035,-.03],[.31,.12,.26]);
  if(type<2){
   for(let j=0;j<11;j++){
    const a=j*2.4,r=Math.sqrt((j+.5)/11)*.57,x=Math.cos(a)*r,z=Math.sin(a)*r,h=.45+random()*.35;
    rod(parts,color,[x,-.04,z],[x,h,z],.055,.027,5);
    for(const side of [-1,1]){
     const tip=[x+Math.cos(a+side)*.21,h+.16,z+Math.sin(a+side)*.21];
     rod(parts,color,[x,h*.60,z],tip,.035,.012,5);
     coralBlob(parts,type?'#c7b9c6':'#e6d7aa',tip,[.024,.033,.024]);
    }
   }
  }else if(type===2){
   for(let j=0;j<5;j++)coralBlob(parts,j%2?'#a3b09a':color,[(j%2-.5)*.32,.18+j*.12,(j%3-1)*.16],[.70-j*.075,.055,.54-j*.045]);
  }else if(type===3){
   coralBlob(parts,color,[0,.30,0],[.71,.38,.63]);
   for(let j=0;j<12;j++){
    const a=j*2.4,r=Math.sqrt((j+.5)/12)*.63;
    coralBlob(parts,j%2?'#bdb286':'#8c976c',[Math.cos(a)*r,.35+.31*Math.sqrt(1-r*r/.5),Math.sin(a)*r*.88],[.095,.045,.09]);
   }
  }else{
   for(let j=0;j<13;j++){
    const a=j*2.4,r=Math.sqrt((j+.5)/13)*.5;
    rotation.setFromAxisAngle(new THREE.Vector3(Math.cos(a),0,Math.sin(a)),.45);
    piece(parts,coralSphere,j%2?'#c2a18e':color,[Math.cos(a)*r,.22+j*.027,Math.sin(a)*r],[.32,.065,.30],rotation);
   }
  }
  const mesh=finish(parts,coralNames[type],instances.length);mesh.userData.coral=true;
  instances.forEach(({x,z,size,angle,stretchX,stretchZ,leanX,leanZ,shade},i)=>{
   const y=reefFloor(x,z),height=Math.min(size,(-1.55-y)/1.08);
   pose.position.set(x,y,z);pose.rotation.set(leanX,angle,leanZ);pose.scale.set(size*stretchX,height,size*stretchZ);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
   mesh.setColorAt(i,new THREE.Color(shade,shade,.98*shade));
  });mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
 });
 coralSphere.dispose();
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
 const surface=new THREE.Shape();for(let j=0;j<=segments;j++){const [x,z]=reefEdge(j/segments*Math.PI*2);if(j===0)surface.moveTo(x,-z);else surface.lineTo(x,-z);}
 const tint=new THREE.Mesh(new THREE.ShapeGeometry(surface),new THREE.MeshBasicMaterial({color:'#72c3c0',transparent:true,opacity:.10,depthWrite:false,side:THREE.DoubleSide}));
 tint.rotation.x=-Math.PI/2;tint.position.y=-1.325;tint.name='Fenêtre sur le récif';root.add(tint);
 function update(dt=0){
  time+=Math.min(dt,.1);
  for(const {mesh,fish,swimTime}of schools){
   swimTime.value=time;
   fish.forEach((f,i)=>{
    const a=f.phase+time*(.13+f.school*.012),school=f.school;
    let x,z,y,dx,dz;
    if(school===0){dx=-Math.sin(a)*.65;dz=Math.cos(a)*.42;x=-.7+Math.cos(a)*.65;z=-34.8+Math.sin(a)*.42;y=reefFloor(x,z)+.55+Math.sin(a*2)*.1;}
    else if(school===4){dx=-Math.sin(a)*1.3;dz=Math.cos(a)*.7;x=-4.6+Math.cos(a)*1.3;z=-36.8+Math.sin(a)*.7;y=-2.5+Math.sin(a*2)*.15;}
    else if(school===5){dx=-Math.sin(time*.1)*4;dz=Math.cos(time*.1)*.65;x=Math.cos(time*.1)*4+(i%4)*.35-1;z=-37.7+Math.sin(time*.1)*.65+Math.floor(i/4)*.25;y=-2.2+Math.sin(i)*.12;}
    else {dx=-Math.sin(a)*(4+school*.9);dz=Math.cos(a)*(1.6+school*.12);x=Math.cos(a)*(4+school*.9);z=-36.7+Math.sin(a)*(1.6+school*.12);y=-2.2-school*.18+Math.sin(a*2)*.12;}
    y=Math.max(y,reefFloor(x,z)+1.1);
    pose.position.set(x,y,z);pose.rotation.set(0,Math.atan2(-dz,dx),0);pose.scale.setScalar(f.size);pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
   });mesh.instanceMatrix.needsUpdate=true;
  }
  const a=time*.075+.7;turtle.position.set(Math.cos(a)*3,-2.05+Math.sin(a*2)*.12,-37.6+Math.sin(a)*1.1);turtle.rotation.y=Math.atan2(-Math.cos(a)*1.1,-Math.sin(a)*3);
  flippers.forEach(({mesh,side})=>{mesh.position.copy(turtle.position);mesh.quaternion.copy(turtle.quaternion);mesh.translateX(.25);mesh.translateZ(side*.34);mesh.rotateX(Math.sin(time*1.7)*.28*side);});
 }
 update();sphere.dispose();
 return {root,update,setUnderwater(value){tint.visible=!value;},bounds:new THREE.Sphere(new THREE.Vector3(0,-3,reefBounds.z),16)};
}

// Reveal the near-shore coral strip through the existing opaque water.
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
  mesh.material.customProgramCacheKey=()=> 'reef-water-window-3';mesh.material.needsUpdate=true;
 });
}
