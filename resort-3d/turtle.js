import * as THREE from './vendor/three.module.js';
import {mergeGeometries,mergeVertices} from './vendor/BufferGeometryUtils.js';

// A small, texture-free sea turtle: three draw calls, articulated at the shoulders.
export function createTurtle(){
 const root=new THREE.Group();root.name='Tortue marine';
 const body=[],sphere=new THREE.SphereGeometry(1,16,10),detail=new THREE.SphereGeometry(1,8,5);
 const matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),color=new THREE.Color();
 const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.76,side:THREE.DoubleSide});
 function add(parts,geometry,hex,p=[0,0,0],s=[1,1,1]){
  const g=geometry.clone();g.deleteAttribute('uv');
  matrix.compose(new THREE.Vector3(...p),q.identity(),new THREE.Vector3(...s));g.applyMatrix4(matrix);
  color.set(hex);const c=new Float32Array(g.attributes.position.count*3);
  for(let i=0;i<c.length;i+=3){c[i]=color.r;c[i+1]=color.g;c[i+2]=color.b;}
  g.setAttribute('color',new THREE.BufferAttribute(c,3));parts.push(g);
 }
 const ellipsoid=(parts,hex,p,s,small=false)=>add(parts,small?detail:sphere,hex,p,s);
 function mesh(parts,name){
  const merged=mergeGeometries(parts),geometry=mergeVertices(merged);merged.dispose();parts.forEach(g=>g.dispose());
  const result=new THREE.Mesh(geometry,material);result.name=name;root.add(result);return result;
 }
 // Clip a convex outline against the nearest-site cells. Shrinking each cell
 // reveals fine seams on the smooth shell instead of raised decorative blobs.
 function cells(outline,sites){
  return sites.map(([sx,sz],i)=>{
   let polygon=outline.map(p=>[...p]);
   sites.forEach(([tx,tz],j)=>{
    if(i===j||!polygon.length)return;
    const nx=tx-sx,nz=tz-sz,d=(tx*tx+tz*tz-sx*sx-sz*sz)/2,next=[];
    for(let k=0;k<polygon.length;k++){
     const a=polygon[k],b=polygon[(k+1)%polygon.length],da=a[0]*nx+a[1]*nz-d,db=b[0]*nx+b[1]*nz-d;
     if(da<=0)next.push(a);
     if((da<0)!==(db<0)){const t=da/(da-db);next.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
    }polygon=next;
   });return polygon;
  });
 }
 function patch(parts,polygon,height,hex,shrink=.96,steps=2){
  if(polygon.length<3)return;
  const center=polygon.reduce((s,p)=>[s[0]+p[0]/polygon.length,s[1]+p[1]/polygon.length],[0,0]);
  const edge=polygon.map(p=>[center[0]+(p[0]-center[0])*shrink,center[1]+(p[1]-center[1])*shrink]);
  const positions=[],indices=[];
  function vertex(a){positions.push(a[0],height(a[0],a[1]),a[1]);return positions.length/3-1;}
  function triangle(a,b,c,n){
   if(!n){indices.push(vertex(a),vertex(c),vertex(b));return;}
   const ab=[(a[0]+b[0])/2,(a[1]+b[1])/2],bc=[(b[0]+c[0])/2,(b[1]+c[1])/2],ca=[(c[0]+a[0])/2,(c[1]+a[1])/2];
   triangle(a,ab,ca,n-1);triangle(ab,b,bc,n-1);triangle(ca,bc,c,n-1);triangle(ab,bc,ca,n-1);
  }
  for(let i=0;i<edge.length;i++)triangle(center,edge[i],edge[(i+1)%edge.length],steps);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();
  // Smooth dome normals keep the scutes part of one shell rather than separate tiles.
  if(height===shellHeight){const normals=g.attributes.normal;for(let i=0;i<positions.length/3;i++){const x=positions[i*3],y=positions[i*3+1],z=positions[i*3+2],n=new THREE.Vector3(x/(.63*.63),(y+.015)/(.24*.24),z/(.46*.46)).normalize();normals.setXYZ(i,n.x,n.y,n.z);}}
  add(parts,g,hex);g.dispose();
 }
 function shellHeight(x,z){return -.009+.24*Math.sqrt(Math.max(0,1-(x/.63)**2-(z/.46)**2));}
 const dome=new THREE.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI/2);
 add(body,dome,'#484c32',[0,-.015,0],[.63,.24,.46]);dome.dispose();
 ellipsoid(body,'#c4b78e',[0,-.074,0],[.59,.087,.425]);
 const outline=Array.from({length:64},(_,i)=>{const a=i/64*Math.PI*2;return [Math.cos(a)*.628,Math.sin(a)*.458];});
 const sites=[...[-.44,-.23,-.01,.21,.43].map(x=>[x,0])];
 for(const side of [-1,1])for(const x of [-.36,-.12,.13,.36])sites.push([x,side*.265]);
 for(let i=0;i<20;i++){const a=i/20*Math.PI*2;sites.push([Math.cos(a)*.595,Math.sin(a)*.425]);}
 const palette=['#747849','#807b4c','#6c7446','#8a8050','#727044'];
 cells(outline,sites).forEach((polygon,i)=>patch(body,polygon,shellHeight,palette[i%palette.length],i<13?.965:.945,2));
 // Narrow amber shell edge, not a thick floating ring.
 const rimPoints=Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return new THREE.Vector3(Math.cos(a)*.623,-.019,Math.sin(a)*.454);});
 const rim=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPoints),64,.012,5,false);add(body,rim,'#ac9c66');rim.dispose();
 // Neck, tapered head, small beak and a pale jaw.
 ellipsoid(body,'#a49c72',[.60,-.045,0],[.20,.09,.115]);
 ellipsoid(body,'#9a9569',[.78,-.015,0],[.17,.108,.11]);
 ellipsoid(body,'#d0c298',[.805,-.073,0],[.14,.039,.095]);
 ellipsoid(body,'#a89c72',[.921,-.04,0],[.045,.055,.076],true);
 for(const side of [-1,1]){
  ellipsoid(body,'#c9ba8c',[.826,.025,side*.093],[.033,.035,.017],true);
  ellipsoid(body,'#162f2d',[.832,.028,side*.105],[.024,.026,.012],true);
  ellipsoid(body,'#f1e7cc',[.840,.037,side*.114],[.005,.006,.003],true);
  for(let j=0;j<4;j++)ellipsoid(body,'#525a3e',[.62+j*.065,.061+Math.sin(j)*.015,side*(.035+j*.009)],[.026,.006,.022],true);
  ellipsoid(body,'#51583b',[.913,-.024,side*.025],[.007,.005,.009],true);
 }
 // Flippers are tapered paddles with a thin loft and a quiet mosaic pattern.
 function paddle(parts,side,scale=1,offset=[0,0,0]){
  const shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(.16,.12,.10,.38,-.08,.64);shape.bezierCurveTo(-.18,.81,-.34,.94,-.39,.90);shape.bezierCurveTo(-.37,.76,-.25,.43,-.18,.18);shape.quadraticCurveTo(-.10,.025,0,0);
  const outline=shape.getPoints(8).map(v=>[v.x*scale,v.y*scale]);
  const top=(x,z)=>.010+.023*Math.sin(Math.PI*Math.min(1,z/(.95*scale)));
  const local=[];patch(local,outline,top,'#b6ad80',1,1);patch(local,outline,()=>-.017,'#c9bf98',1,0);
  const skinSites=[[0,.05],[.065,.18],[-.07,.15],[.012,.32],[-.105,.29],[-.15,.43],[-.045,.47],[-.21,.56],[-.12,.65],[-.29,.73],[-.265,.85]].map(([x,z])=>[x*scale,z*scale]);
  cells(outline,skinSites).forEach((polygon,i)=>patch(local,polygon,(x,z)=>top(x,z)+.002,i%3?'#596344':'#70734a',.90,0));
  local.forEach(g=>{
   const pos=g.attributes.position;for(let i=0;i<pos.count;i++)pos.setXYZ(i,pos.getX(i)+offset[0],pos.getY(i)+offset[1],pos.getZ(i)*side+offset[2]);
   g.computeVertexNormals();parts.push(g);
  });
 }
 for(const side of [-1,1])paddle(body,side,.44,[-.45,-.09,side*.28]);
 ellipsoid(body,'#8d8e60',[-.63,-.085,0],[.11,.025,.037],true);
 const bodyMesh=mesh(body,'Carapace, tête et nageoires arrière');bodyMesh.userData.turtle=true;
 const flippers=[];
 for(const side of [-1,1]){
  const parts=[];paddle(parts,side);const fin=mesh(parts,'Nageoire avant');fin.position.set(.32,-.07,side*.33);flippers.push({fin,side});
 }
 sphere.dispose();detail.dispose();
 function update(time){
  flippers.forEach(({fin,side})=>{fin.rotation.x=side*(Math.sin(time*1.55)*.25-.08);fin.rotation.y=side*Math.cos(time*1.55)*.045;});
 }
 update(0);return {root,update};
}
