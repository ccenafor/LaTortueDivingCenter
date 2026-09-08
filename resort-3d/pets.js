import * as THREE from './vendor/three.module.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';

// Coordinates are metres, +Z is the nose. Locations are in the open central court.
export const petDefinitions=[
 {name:'Dolly',kind:'dog',type:'dolly',origin:[.1,.08,-3],radius:.7,phase:0,photo:'Dolly-la-tortue-diving-center-dauin.webp'},
 {name:'Panda',kind:'dog',type:'panda',origin:[1.7,.08,-.6],radius:.55,phase:1.4,photo:'Panda-la-tortue-diving-center-dauin.webp'},
 {name:'Blossom',kind:'cat',type:'blossom',origin:[-1.9,.08,-6.5],radius:.5,phase:2.7,photo:'Blossom-la-tortue-diving-center.webp'},
 {name:'Bubbles',kind:'cat',type:'bubbles',origin:[-1.6,.08,2.5],radius:.55,phase:4.1,photo:'bubbles-la-tortue-diving-center-dauin.webp'},
 {name:'Buttercup',kind:'cat',type:'buttercup',origin:[1.7,.08,5.5],radius:.6,phase:5.3,photo:'buttercup-la-tortue-diving-center-dauin.webp'}
];
const white='#e9e4d7',black='#242727',tabby='#655e4d',ginger='#b58043',pink='#bd7778';
export function shouldAnimatePets({enabled,reduced,hidden,close,visible}){return enabled&&!reduced&&!hidden&&close&&visible;}

export function createPets(){
 const root=new THREE.Group();root.name='Dolly, Panda, Blossom, Bubbles and Buttercup';
 const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9});
 const sphere=new THREE.SphereGeometry(1,16,10),small=new THREE.SphereGeometry(1,8,6);
 const color=new THREE.Color(),matrix=new THREE.Matrix4(),rotation=new THREE.Quaternion();
 function add(parts,g,shade,p=[0,0,0],scale=[1,1,1],coat){
  const copy=g.clone();copy.deleteAttribute('uv');const pos=copy.attributes.position,c=new Float32Array(pos.count*3);
  for(let i=0;i<pos.count;i++){color.set(coat?coat(pos.getX(i),pos.getY(i),pos.getZ(i)):shade);c.set([color.r,color.g,color.b],i*3);}
  copy.setAttribute('color',new THREE.BufferAttribute(c,3));
  matrix.compose(new THREE.Vector3(...p),rotation.identity(),new THREE.Vector3(...scale));copy.applyMatrix4(matrix);parts.push(copy);
 }
 const ell=(parts,shade,p,scale,coat,detail=false)=>add(parts,detail?small:sphere,shade,p,scale,coat);
 function tube(parts,points,r,shade){
  const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),12,r,6,false);add(parts,g,shade);g.dispose();
 }
 function ear(parts,x,y,z,w,h,fold,shade){
  const g=new THREE.BufferGeometry();
  const v=[x-w,y,z, x+w,y,z, x+w*.15,y+h,z+fold, x-w,y,z-.035, x+w,y,z-.035, x+w*.15,y+h,z+fold-.025];
  g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex([0,1,2,5,4,3,0,3,4,0,4,1,1,4,5,1,5,2,2,5,3,2,3,0]);g.computeVertexNormals();add(parts,g,shade);g.dispose();
 }
 function finish(parts,parent,name){
  const g=mergeGeometries(parts);parts.forEach(p=>p.dispose());const mesh=new THREE.Mesh(g,material);mesh.name=name;
  // Contact shadows below each pet move without redrawing the resort shadow map.
  mesh.castShadow=false;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 const pets=petDefinitions.map(def=>{
  const animal=new THREE.Group();animal.name=def.name;animal.userData.pet=def.name;root.add(animal);
  const dog=def.kind==='dog',panda=def.type==='panda';
  const H=dog?(panda?.37:.5):.23,L=dog?(panda?.29:.4):.23,W=dog?(panda?.145:.18):.10;
  const body=[],face=[];
  const coat=(x,y,z)=>{
   if(dog)return y<-.28||z>.65?white:black;
   if(y<.05)return white;
   if(def.type==='buttercup')return x>.3&&z<-.1?ginger:black;
   if(def.type==='blossom'&&x>.2&&z>.1)return ginger;
   return Math.sin(z*17+x*8)>.65?'#373a32':tabby;
  };
  ell(body,black,[0,H,0],[W,H*.4,L],coat);
  ell(body,white,[0,H+.025,L*.65],[W*.84,H*.5,L*.38]);
  if(panda){
   // Layered ruff, feathered flanks and haunches rather than a smooth pitbull silhouette.
   for(let i=0;i<13;i++){const a=i/13*Math.PI*2;ell(body,white,[Math.cos(a)*.12,H+.06+Math.sin(a)*.12,L*.73],[.055,.095,.075]);}
   for(const side of [-1,1])for(let j=0;j<5;j++)ell(body,black,[side*W*.83,H-.01,-L*.65+j*.09],[.07,.115,.09]);
  }
  const headY=dog?H+.2:H+.11,headZ=L*.87,headW=dog?(panda?.14:.18):.108;
  const faceCoat=(x,y,z)=>{
   if(dog)return y<-.28||(Math.abs(x)<(panda?.15:.10)&&z>.15)?white:black;
   if(y<-.12||Math.abs(x)<.20)return white;
   if(def.type==='buttercup')return x<0?black:(y>.26?ginger:white);
   if(def.type==='blossom'&&x>.23)return ginger;
   return Math.sin(y*24+x*7)>.6?'#393d35':tabby;
  };
  ell(face,black,[0,0,0],[headW,dog?.16:.10,dog?.18:.09],faceCoat);
  const muzzle=dog?(panda?.125:.14):.037,front=dog?.15:.07;
  ell(face,white,[-muzzle*.35,-.065,front],[muzzle*.72,dog?.078:.038,dog?.12:.043]);
  ell(face,white,[muzzle*.35,-.065,front],[muzzle*.72,dog?.078:.038,dog?.12:.043]);
  ell(face,dog?'#141a1d':pink,[0,-.033,front+(dog?.109:.039)],[dog?.057:.018,dog?.036:.012,dog?.031:.011],null,true);
  if(dog){
   ell(face,'#3b2227',[0,-.13,front-.018],[muzzle*.68,.03,.074]);
   ell(face,pink,[0,-.154,front+.02],[.039,.018,.059]);
  }else{
   for(const side of [-1,1])for(let j=0;j<3;j++)tube(face,[[side*.035,-.05+j*.011,.092],[side*.10,-.045+j*.016,.08],[side*.17,-.044+j*.022,.07]],.0013,'#c9c5b8');
  }
  for(const side of [-1,1]){
   const ex=side*headW*.65,ey=dog?.037:.022,ez=dog?.132:.075;
   ell(face,'#202522',[ex,ey,ez],[dog?.036:.032,dog?.032:.023,.015],null,true);
   ell(face,dog?'#875d32':'#91ada0',[ex,ey,ez+.011],[dog?.025:.025,dog?.023:.018,.009]);
   ell(face,'#101b20',[ex,ey,ez+.018],[dog?.012:.006,.016,.006],null,true);
   ell(face,'#ffffff',[ex-.006,ey+.008,ez+.023],[.004,.004,.003],null,true);
   if(!dog){ear(face,side*.078,.07,-.025,.057,.135,-.013,def.type==='buttercup'&&side>0?ginger:tabby);ear(face,side*.078,.084,-.002,.035,.09,-.015,pink);}
   else if(panda){ear(face,side*.12,.10,-.015,.06,.19,-.05,black);ear(face,side*.12,.13,.004,.031,.105,-.045,'#675553');}
   else {ell(face,black,[side*.178,.06,-.025],[.063,.105,.09]);ear(face,side*.168,.115,.005,.056,-.105,.10,black);}
  }
  if(def.type==='dolly'){
   const collar=new THREE.TorusGeometry(.151,.021,6,20);collar.rotateX(-Math.PI/2);add(body,collar,'#aa4434',[0,H+.12,L*.59],[1,1,1]);collar.dispose();
   ell(body,'#879ca0',[0,H-.025,L*.77],[.024,.035,.01],null,true);
  }
  finish(body,animal,def.name+' coat');const head=new THREE.Group();head.position.set(0,headY,headZ);animal.add(head);finish(face,head,def.name+' face');
  const legs=[];
  for(const side of [-1,1])for(const fore of [-1,1]){
   const limb=new THREE.Group();limb.position.set(side*W*.72,H,fore*L*.65);animal.add(limb);const parts=[];
   ell(parts,coat(side,.5,fore),[0,-H*.22,0],[W*.35,H*.36,W*.39]);
   ell(parts,white,[0,-H*.65,.008],[W*.23,H*.30,W*.26]);
   ell(parts,white,[0,-H+.025,.032],[W*.34,.03,W*.47]);
   finish(parts,limb,def.name+' leg');legs.push({limb,phase:side*fore});
  }
  const tail=new THREE.Group();tail.position.set(0,H+.04,-L*.84);animal.add(tail);const tailParts=[];
  const tailCurve=panda?[[0,0,0],[0,.20,-.16],[0,.34,-.15],[0,.31,.02]]:dog?[[0,0,0],[0,.05,-.20],[0,.18,-.37]]:[[0,0,0],[0,.15,-.12],[0,.34,-.10],[0,.37,-.04]];
  tube(tailParts,tailCurve,panda?.065:dog?.025:.022,dog?black:tabby);
  if(panda)ell(tailParts,white,[0,.32,-.025],[.073,.063,.09]);
  finish(tailParts,tail,def.name+' tail');
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(1,20),new THREE.MeshBasicMaterial({color:'#34352f',transparent:true,opacity:.16,depthWrite:false}));
  shadow.rotation.x=-Math.PI/2;shadow.scale.set(W*1.6,L*1.4,1);shadow.position.y=.001;animal.add(shadow);
  animal.position.fromArray(def.origin);return {...def,root:animal,legs,head,tail,height:headY,time:0};
 });
 sphere.dispose();small.dispose();
 function update(dt){
  for(const pet of pets){
   pet.time+=dt;
   // Slow loops with a four-second pause: no random wandering into buildings.
   const cycle=pet.time%24,walk=cycle<20,travel=Math.floor(pet.time/24)*20+Math.min(cycle,20),a=pet.phase+travel*.075;
   pet.root.position.set(pet.origin[0]+Math.sin(a)*pet.radius,pet.origin[1],pet.origin[2]+Math.cos(a)*pet.radius*.65);
   pet.root.rotation.y=Math.atan2(Math.cos(a),-.65*Math.sin(a));
   const gait=walk?Math.sin(pet.time*5)*.20:0;
   for(const {limb,phase}of pet.legs)limb.rotation.x=gait*phase;
   pet.head.rotation.y=Math.sin(pet.time*.65+pet.phase)*.07;
   pet.tail.rotation.z=Math.sin(pet.time*(pet.kind==='dog'?3:1.1)+pet.phase)*(pet.kind==='dog'?.14:.07);
  }
 }
 update(0);
 return {root,pets,update};
}
