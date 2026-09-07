import * as THREE from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {DRACOLoader} from './vendor/DRACOLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {createFreeNavigation} from './free-navigation.js?v=2';
import {stops} from './stops.js?v=site-1';
const $=id=>document.getElementById(id),vec=a=>new THREE.Vector3(...a);
let current=0,currentView='outside',cutOn=false,photoIndex=0,canopyVisible=true,planMode=false;
let model,ready=false,playing=false,elapsed=0,transition=null,completed=false;
let navigation;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene=new THREE.Scene();scene.background=new THREE.Color('#e7edf5');scene.fog=new THREE.Fog('#e7edf5',75,150);
const camera=new THREE.PerspectiveCamera(45,1,.05,180);
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('view'),antialias:true});}catch(e){$('loading').textContent='WebGL indisponible. Les photos et les rendus restent disponibles.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
// A neutral daylight environment gives metal cylinders, taps and mirrors readable reflections.
const reflectionFaces=Array.from({length:6},(_,i)=>{const c=document.createElement('canvas');c.width=c.height=32;const ctx=c.getContext('2d');const g=ctx.createLinearGradient(0,0,0,32);g.addColorStop(0,i===3?'#929187':'#e9efed');g.addColorStop(1,'#8d9998');ctx.fillStyle=g;ctx.fillRect(0,0,32,32);return c;});
const reflectionCube=new THREE.CubeTexture(reflectionFaces);reflectionCube.colorSpace=THREE.SRGBColorSpace;reflectionCube.needsUpdate=true;
const environmentGenerator=new THREE.PMREMGenerator(renderer);const environmentMap=environmentGenerator.fromCubemap(reflectionCube);scene.environment=environmentMap.texture;reflectionCube.dispose();environmentGenerator.dispose();
scene.add(new THREE.HemisphereLight(0xe4efff,0x564a32,1.8));
const sun=new THREE.DirectionalLight(0xffefd2,2.8);sun.position.set(-12,25,-16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:1,far:80});sun.shadow.bias=-.0006;scene.add(sun);
const controls=new OrbitControls(camera,$('view'));controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=1.5;controls.maxDistance=120;controls.maxPolarAngle=Math.PI*.48;controls.enablePan=false;
controls.addEventListener('start',()=>pause());
function resize(){const w=$('stage').clientWidth,h=$('stage').clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe($('stage'));
const pins=stops.map((s,i)=>{
 const p=document.createElement('button');p.className='pin';p.textContent=s.room&&/^Room/.test(s.short)?s.short.replace('Room ','R'):String(i+1);
 p.setAttribute('aria-label',`Aller à ${s.name}`);p.onclick=()=>{pause();go(i===current&&i!==0?0:i);};$('pins').append(p);
 const n=document.createElement('button');n.textContent=`${i+1}. ${s.short}`;n.onclick=p.onclick;$('stops').append(n);
 if(s.room){const option=document.createElement('option');option.value=i;option.textContent=s.short==='Clim'?'Chambre climatisée':s.name;$('roomSelect').append(option);}
 return p;
});
function photoList(){const s=stops[current];return [...(s.extraPhotos||[]),...s.photos];}
function showPhoto(){
 const list=photoList();photoIndex=(photoIndex+list.length)%list.length;const p=list[photoIndex],fromSite=typeof p==='string';
 $('photo').src=fromSite?p:`assets/photos/photo-${String(p).padStart(3,'0')}.webp`;
 $('photo').alt=`${stops[current].name} — photo ${photoIndex+1}`;
 $('photoCount').textContent=`${photoIndex+1} / ${list.length}`;
}
function setCanopy(on){canopyVisible=on;if(model)model.traverse(o=>{if(o.userData.part==='CANOPY')o.visible=on;});$('trees').setAttribute('aria-pressed',String(on));$('trees').textContent=on?'Masquer les feuillages':'Afficher les feuillages';}
function setCut(on){
 const s=stops[current],zones=s.cutZones||[s.cutZone];cutOn=!!on&&!!s.cutZone;
 const chosen=s.views?.[currentView]?.cutParts;
 if(model)model.traverse(o=>{const p=o.userData.part||'';const standard=/ROOF|FRONT|CEILING/.test(p);if(standard||p.startsWith('AIR_'))o.visible=!(cutOn&&zones.includes(o.userData.zone)&&(chosen?chosen.includes(p):standard));});
 $('cut').disabled=!s.cutZone;$('cut').setAttribute('aria-pressed',String(cutOn));$('cut').textContent=cutOn?'Fermer la coupe':'Ouvrir la coupe';
}
function moveTo(pos,target,instant=false){
 const p=vec(pos),t=vec(target);if($('stage').clientWidth<600)p.sub(t).multiplyScalar(currentView==='bath'?1.12:1.24).add(t);
 if(instant||reduced){camera.position.copy(p);controls.target.copy(t);transition=null;}
 else transition={start:performance.now(),a:camera.position.clone(),b:controls.target.clone(),p,t};
}
function applyView(mode,instant=false){
 if(navigation?.active)navigation.setActive(false);
 const s=stops[current],v=s.views?.[mode];currentView=mode;planMode=false;$('planview').setAttribute('aria-pressed','false');
 setCut(v?.cut??(v?mode!=='outside':s.cut));setCanopy(v?.hideCanopy?false:!cutOn);
 for(const name of ['outside','inside','reverse','bath']){$(name).hidden=!s.views?.[name];$(name).textContent=s.views?.[name]?.label||name;$(name).setAttribute('aria-pressed',String(mode===name));}
 $('spaceViews').hidden=!s.views;$('cut').hidden=!!s.views;
 $('viewStatus').textContent=s.room?`${s.name} · ${v?.label||'Intérieur'}${cutOn?' · '+(v?.cutLabel||'toiture et façade retirées'):''}`:(v?`${v.label}${cutOn?' · vue ouverte':''}`:'');
 if(v?.photo!==undefined&&v.photo!==null){const n=photoList().indexOf(v.photo);if(n>=0)photoIndex=n;}
 showPhoto();camera.fov=v?.fov||45;camera.updateProjectionMatrix();moveTo(v?.pos||s.pos,v?.target||s.target,instant);
}
function go(i,instant=false){
 if(navigation?.active)navigation.setActive(false);
 current=(i+stops.length)%stops.length;elapsed=0;completed=false;photoIndex=0;const s=stops[current];
 document.body.classList.toggle('close-view',current!==0);$('title').textContent=s.name;
 $('counter').textContent=`${String(current+1).padStart(2,'0')} / ${stops.length}`;$('roomSelect').value=s.room?String(current):'';
 for(const buttons of [pins,[...$('stops').children]])buttons.forEach((p,j)=>{p.setAttribute('aria-current',String(j===current));p.setAttribute('aria-pressed',String(j===current));});
 applyView(s.defaultView||(s.cut?'inside':'outside'),instant);$('tourStatus').textContent=`${playing?'Parcours en cours':'Étape'} · ${current+1}/${stops.length} · ${s.name}`;
}
function pause(){playing=false;transition=null;$('play').textContent=completed?'Rejouer le parcours':'Reprendre le parcours';$('tourStatus').textContent=`En pause · ${stops[current].name}`;}
$('roomSelect').onchange=()=>{if($('roomSelect').value!==''){pause();go(Number($('roomSelect').value));}};
for(const name of ['outside','inside','reverse','bath'])$(name).onclick=()=>{pause();applyView(name);};
$('play').onclick=()=>{if(!ready)return;if(navigation.active)applyView(currentView);if(playing){pause();return;}if(completed)go(0);playing=true;$('play').textContent='Mettre en pause';$('tourStatus').textContent=`Parcours en cours · ${current+1}/${stops.length}`;};
$('prev').onclick=()=>{pause();go(current-1);};$('next').onclick=()=>{pause();go(current+1);};$('home').onclick=()=>{pause();go(0);};
$('cut').onclick=()=>{pause();setCut(!cutOn);setCanopy(!cutOn);};$('trees').onclick=()=>{pause();setCanopy(!canopyVisible);};
for(const [id,factor]of [['closer',.8],['farther',1.25]])$(id).onclick=()=>{pause();const d=camera.position.clone().sub(controls.target);d.setLength(THREE.MathUtils.clamp(d.length()*factor,1.5,120));camera.position.copy(controls.target).add(d);};
$('view').addEventListener('keydown',e=>{if(navigation.active)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();pause();go(current+(e.key==='ArrowRight'?1:-1));}if(e.key==='Escape')pause();});
$('planview').onclick=()=>{pause();if(planMode){go(0);return;}go(0,true);setCanopy(false);planMode=true;$('planview').setAttribute('aria-pressed','true');document.body.classList.add('close-view');camera.position.set(0,$('stage').clientWidth<600?112:85,-1.99);controls.target.set(0,0,-2);$('tourStatus').textContent='Vue de dessus · entrée en bas, plage en haut';};
$('photoOpen').onclick=()=>{pause();$('largePhoto').src=$('photo').src;$('largePhoto').alt=$('photo').alt;$('lightbox').showModal();};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
$('photoPrev').onclick=()=>{pause();photoIndex--;showPhoto();};$('photoNext').onclick=()=>{pause();photoIndex++;showPhoto();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
navigation=createFreeNavigation({camera,controls,canvas:$('view'),panel:$('flightControls'),toggle:$('freeWalk'),
 onEnter(){const pending=transition;pause();if(pending&&current!==0){camera.position.copy(pending.p);camera.lookAt(pending.t);}planMode=false;$('planview').setAttribute('aria-pressed','false');document.body.classList.add('close-view');
  if(current===0){camera.position.set(0,1.7,20);camera.lookAt(0,1.7,-20);}
  camera.fov=65;camera.updateProjectionMatrix();$('tourStatus').textContent='Exploration libre · Échap pour retrouver la vue guidée';
 },onExit(){navigation.setActive(false);applyView(currentView);$('freeWalk').focus({preventScroll:true});$('tourStatus').textContent='Vue guidée · '+stops[current].name;}});
$('freeWalk').onclick=()=>{if(!ready)return;if(navigation.active){navigation.setActive(false);applyView(currentView);}else navigation.setActive(true);};
go(0,true);resize();
new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('./vendor/draco/')).load('assets/resort.glb?v=14-2',g=>{
 model=g.scene;model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.material.side=THREE.DoubleSide;
  if(o.userData.part==='LOGO FACE'){o.material.transparent=true;o.material.depthWrite=false;o.material.alphaTest=.02;o.castShadow=false;}
  if(o.userData.part==='net'){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.13;o.material.depthWrite=false;o.castShadow=false;}
 }});scene.add(model);ready=true;setCut(cutOn);setCanopy(canopyVisible);$('loading').hidden=true;$('freeWalk').disabled=false;
},undefined,()=>{$('loading').textContent='Le modèle ne peut pas être chargé. Les photos restent consultables. Réessayer en rechargeant la page.';});
let last=performance.now();function frame(now){
 const dt=Math.min((now-last)/1000,.1);last=now;
 if(playing){elapsed+=dt;if(elapsed>=9){if(current===stops.length-1){playing=false;completed=true;elapsed=9;$('play').textContent='Rejouer le parcours';$('tourStatus').textContent='Parcours terminé';}else go(current+1);}}
 $('progress').value=elapsed;
 if(transition){let t=Math.min((now-transition.start)/1000,1);t=t*t*(3-2*t);camera.position.lerpVectors(transition.a,transition.p,t);controls.target.lerpVectors(transition.b,transition.t,t);if(t===1)transition=null;}
 if(navigation.active)navigation.update(dt);else controls.update();pins.forEach((p,i)=>{const v=vec(stops[i].pin).project(camera);p.style.left=`${(v.x*.5+.5)*$('stage').clientWidth}px`;p.style.top=`${(-v.y*.5+.5)*$('stage').clientHeight}px`;p.hidden=navigation.active||!ready||v.z>1||v.z< -1||Math.abs(v.x)>.9||Math.abs(v.y)>.8||(cutOn&&i!==current)||(i===14&&i!==current);});
 renderer.render(scene,camera);requestAnimationFrame(frame);
}requestAnimationFrame(frame);
