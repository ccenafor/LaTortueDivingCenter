import * as THREE from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {DRACOLoader} from './vendor/DRACOLoader.js';
import {createFreeNavigation,createOrbitNavigation} from './free-navigation.js?v=reef-20';
import {stops} from './stops.js?v=reef-18';
import {createRenderLoop} from './render-loop.js?v=1';
import {shouldAnimateReef,inReef} from './reef-layout.js?v=20';
const $=id=>document.getElementById(id),vec=a=>new THREE.Vector3(...a);
let current=0,currentView='outside',cutOn=false,photoIndex=0,canopyVisible=true,planMode=false;
let model,ready=false,playing=false,elapsed=0,transition=null,completed=false;
let navigation;
let reef=null,reefLoading=null,reefFailed=false,reefMotion=true,reefTick=0,underwater=false;
const reefFrustum=new THREE.Frustum(),reefProjection=new THREE.Matrix4();
const reefSphere=new THREE.Sphere(new THREE.Vector3(0,-3,-36),12);
const reefBox=new THREE.Box3(new THREE.Vector3(-11,-5,-41.4),new THREE.Vector3(11,-1.3,-30.6));
const loop=createRenderLoop(frame);
let dirty=true,stageVisible=true;
function invalidate(){dirty=true;loop.invalidate();}
function invalidateShadows(){renderer.shadowMap.needsUpdate=true;invalidate();}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
motionPreference.addEventListener('change',()=>{syncReefMotion();invalidate();});
const scene=new THREE.Scene();scene.background=new THREE.Color('#e7edf5');scene.fog=new THREE.Fog('#e7edf5',75,150);
const camera=new THREE.PerspectiveCamera(45,1,.05,180);
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('view'),antialias:true});}catch(e){$('loading').textContent='WebGL indisponible. Les photos et les rendus restent disponibles.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('view').addEventListener('webglcontextrestored',invalidateShadows);
// A neutral daylight environment gives metal cylinders, taps and mirrors readable reflections.
const reflectionFaces=Array.from({length:6},(_,i)=>{const c=document.createElement('canvas');c.width=c.height=32;const ctx=c.getContext('2d');const g=ctx.createLinearGradient(0,0,0,32);g.addColorStop(0,i===3?'#929187':'#e9efed');g.addColorStop(1,'#8d9998');ctx.fillStyle=g;ctx.fillRect(0,0,32,32);return c;});
const reflectionCube=new THREE.CubeTexture(reflectionFaces);reflectionCube.colorSpace=THREE.SRGBColorSpace;reflectionCube.needsUpdate=true;
const environmentGenerator=new THREE.PMREMGenerator(renderer);const environmentMap=environmentGenerator.fromCubemap(reflectionCube);scene.environment=environmentMap.texture;reflectionCube.dispose();environmentGenerator.dispose();
scene.add(new THREE.HemisphereLight(0xe4efff,0x564a32,1.8));
const sun=new THREE.DirectionalLight(0xffefd2,2.8);sun.position.set(-12,25,-16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:1,far:80});sun.shadow.bias=-.0006;scene.add(sun);
const controls=createOrbitNavigation(camera,$('view'));
controls.addEventListener('start',()=>pause());
let stageWidth=1,stageHeight=1;
controls.addEventListener('change',invalidate);
function resize(){stageWidth=Math.max(1,$('stage').clientWidth);stageHeight=Math.max(1,$('stage').clientHeight);renderer.setSize(stageWidth,stageHeight,false);camera.aspect=stageWidth/stageHeight;camera.updateProjectionMatrix();invalidate();}
function syncVisibility(){loop.setEnabled(!document.hidden&&stageVisible);}
new IntersectionObserver(([entry])=>{stageVisible=entry.isIntersecting;syncVisibility();}).observe($('stage'));
new ResizeObserver(resize).observe($('stage'));
const pins=stops.map((s,i)=>{
 const p=document.createElement('button');p.className='pin';p.textContent=s.room&&/^Room/.test(s.short)?s.short.replace('Room ','R'):String(i+1);
 p.setAttribute('aria-label',`Aller à ${s.name}`);p.onclick=()=>{pause();go(i===current&&i!==0?0:i);};$('pins').append(p);
 const n=document.createElement('button');n.textContent=`${i+1}. ${s.short}`;n.onclick=p.onclick;$('stops').append(n);
 if(s.room){const option=document.createElement('option');option.value=i;option.textContent=s.short==='Clim'?'Chambre climatisée':s.name;$('roomSelect').append(option);}
 return p;
});
function updateStepSelection(){
 const free=!!navigation?.active,s=stops[current];
 $('counter').textContent=free?'LIBRE':`${String(current+1).padStart(2,'0')} / ${stops.length}`;
 $('roomSelect').value=!free&&s.room?String(current):'';
 for(const buttons of [pins,[...$('stops').children]])buttons.forEach((p,j)=>{const selected=!free&&j===current;p.setAttribute('aria-current',String(selected));p.setAttribute('aria-pressed',String(selected));});
}
function photoList(){const s=stops[current];return [...(s.extraPhotos||[]),...s.photos];}
function showPhoto(){
 const list=photoList();photoIndex=(photoIndex+list.length)%list.length;const p=list[photoIndex],fromSite=typeof p==='string';
 $('photo').src=fromSite?p:`assets/photos/photo-${String(p).padStart(3,'0')}.webp`;
 $('photo').alt=`${stops[current].name} — photo ${photoIndex+1}`;
 $('photoCount').textContent=`${photoIndex+1} / ${list.length}`;
}
function setCanopy(on){invalidateShadows();canopyVisible=on;if(model)model.traverse(o=>{if(o.userData.part==='CANOPY')o.visible=on;});$('trees').setAttribute('aria-pressed',String(on));$('trees').textContent=on?'Masquer les feuillages':'Afficher les feuillages';}
function setCut(on){
 invalidateShadows();
 const s=stops[current],zones=s.cutZones||[s.cutZone];cutOn=!!on&&!!s.cutZone;
 const chosen=s.views?.[currentView]?.cutParts;
 if(model)model.traverse(o=>{const p=o.userData.part||'';const standard=/ROOF|FRONT|CEILING/.test(p);if(standard||p.startsWith('AIR_'))o.visible=!(cutOn&&zones.includes(o.userData.zone)&&(chosen?chosen.includes(p):standard));});
 $('cut').disabled=!s.cutZone;$('cut').setAttribute('aria-pressed',String(cutOn));$('cut').textContent=cutOn?'Fermer la coupe':'Ouvrir la coupe';
}
function moveTo(pos,target,instant=false){
 invalidate();
 const p=vec(pos),t=vec(target);if($('stage').clientWidth<600&&!stops[current].reef)p.sub(t).multiplyScalar(currentView==='bath'?1.12:1.24).add(t);
 if(instant||reduced){camera.position.copy(p);controls.target.copy(t);transition=null;}
 else transition={start:performance.now(),a:camera.position.clone(),b:controls.target.clone(),p,t};
}
function applyView(mode,instant=false){
 if(navigation?.active)navigation.setActive(false);
 const s=stops[current],v=s.views?.[mode];currentView=mode;planMode=false;$('planview').setAttribute('aria-pressed','false');
 $('reefControls').hidden=!s.reef;controls.maxPolarAngle=s.reef?Math.PI*.85:Math.PI*.48;
 if(s.reef){reefFailed=false;ensureReef();}
 reef?.setUnderwater(!!s.reef&&mode==='inside');
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
 updateStepSelection();
 applyView(s.defaultView||(s.cut?'inside':'outside'),instant);$('tourStatus').textContent=`${playing?'Parcours en cours':'Étape'} · ${current+1}/${stops.length} · ${s.name}`;
}
function pause(){invalidate();playing=false;transition=null;$('play').textContent=completed?'Rejouer le parcours':'Reprendre le parcours';$('tourStatus').textContent=`En pause · ${stops[current].name}`;}
$('roomSelect').onchange=()=>{if($('roomSelect').value!==''){pause();go(Number($('roomSelect').value));}};
for(const name of ['outside','inside','reverse','bath'])$(name).onclick=()=>{pause();applyView(name);};
$('play').onclick=()=>{if(!ready)return;if(navigation.active)applyView(currentView);if(playing){pause();return;}if(completed)go(0);playing=true;loop.invalidate();$('play').textContent='Mettre en pause';$('tourStatus').textContent=`Parcours en cours · ${current+1}/${stops.length}`;};
$('prev').onclick=()=>{pause();go(current-1);};$('next').onclick=()=>{pause();go(current+1);};$('home').onclick=()=>{pause();go(0);};
$('cut').onclick=()=>{pause();setCut(!cutOn);setCanopy(!cutOn);};$('trees').onclick=()=>{pause();setCanopy(!canopyVisible);};
for(const [id,factor]of [['closer',.8],['farther',1.25]])$(id).onclick=()=>{pause();const d=camera.position.clone().sub(controls.target);d.setLength(THREE.MathUtils.clamp(d.length()*factor,1.5,120));camera.position.copy(controls.target).add(d);};
$('view').addEventListener('keydown',e=>{if(navigation.active)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();pause();go(current+(e.key==='ArrowRight'?1:-1));}if(e.key==='Escape')pause();});
$('planview').onclick=()=>{pause();if(planMode){go(0);return;}go(0,true);setCanopy(false);planMode=true;$('planview').setAttribute('aria-pressed','true');document.body.classList.add('close-view');camera.position.set(0,$('stage').clientWidth<600?112:85,-1.99);controls.target.set(0,0,-2);$('tourStatus').textContent='Vue de dessus · entrée en bas, plage en haut';};
$('photoOpen').onclick=()=>{pause();$('largePhoto').src=$('photo').src;$('largePhoto').alt=$('photo').alt;$('lightbox').showModal();};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
$('photoPrev').onclick=()=>{pause();photoIndex--;showPhoto();};$('photoNext').onclick=()=>{pause();photoIndex++;showPhoto();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();syncVisibility();});
function ensureReef(){
 if(!ready||reef||reefLoading||reefFailed)return;
 $('reefStatus').textContent='Chargement du récif…';
 reefLoading=import('./reef.js?v=22-1').then(({createReef,openWaterWindow})=>{
  reef=createReef();scene.add(reef.root);openWaterWindow(model);
  reef.setUnderwater(!!stops[current].reef&&currentView==='inside');
  $('reefStatus').textContent='';invalidateShadows();
 }).catch(error=>{reefFailed=true;$('reefStatus').textContent='Le récif n’a pas pu être chargé. Sélectionner à nouveau Le récif pour réessayer.';console.error('Reef loading failed',error);}).finally(()=>{reefLoading=null;});
}
function syncReefMotion(){
 const suppressed=motionPreference.matches;
 $('reefMotion').disabled=suppressed;
 $('reefMotion').setAttribute('aria-pressed',String(reefMotion&&!suppressed));
 $('reefMotion').textContent=suppressed?'Mouvements réduits activés':reefMotion?'Mettre les animaux en pause':'Animer les animaux';
}
$('reefMotion').onclick=()=>{reefMotion=!reefMotion;syncReefMotion();invalidate();};
syncReefMotion();
navigation=createFreeNavigation({camera,controls,canvas:$('view'),panel:$('flightControls'),toggle:$('freeWalk'),onChange:invalidate,onModeChange:updateStepSelection,
 onEnter(){const pending=transition;pause();if(pending&&current!==0){camera.position.copy(pending.p);camera.lookAt(pending.t);}planMode=false;$('planview').setAttribute('aria-pressed','false');document.body.classList.add('close-view');
  if(current===0){camera.position.set(0,1.7,20);camera.lookAt(0,1.7,-20);}
  camera.fov=65;camera.updateProjectionMatrix();$('tourStatus').textContent='Exploration libre · Échap pour retrouver la vue guidée';
 },onExit(){navigation.setActive(false);applyView(currentView);$('freeWalk').focus({preventScroll:true});$('tourStatus').textContent='Vue guidée · '+stops[current].name;}});
$('freeWalk').onclick=()=>{if(!ready)return;if(navigation.active){navigation.setActive(false);applyView(currentView);}else navigation.setActive(true);};
go(0,true);resize();
const draco=new DRACOLoader().setDecoderPath('./vendor/draco/');
new GLTFLoader().setDRACOLoader(draco).load('assets/resort.glb?v=17-1',g=>{
 draco.dispose();model=g.scene;model.traverse(o=>{o.updateMatrix();o.matrixAutoUpdate=false;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.material.side=THREE.DoubleSide;
  if(o.userData.part==='LOGO FACE'){o.material.transparent=true;o.material.depthWrite=false;o.material.alphaTest=.02;o.castShadow=false;}
  if(o.userData.part==='net'){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.13;o.material.depthWrite=false;o.castShadow=false;}
 }});scene.add(model);ready=true;setCut(cutOn);setCanopy(canopyVisible);$('loading').hidden=true;$('freeWalk').disabled=false;
},undefined,error=>{console.error('Resort 3D: model loading failed',error);draco.dispose();$('loading').textContent='Le modèle ne peut pas être chargé. Les photos restent consultables. Réessayer en rechargeant la page.';});
// Reuse pin vectors and viewport measurements; update overlays only when the view changes.
const pinPositions=stops.map(s=>vec(s.pin)),projected=new THREE.Vector3();
function frame(now,dt){
 if(playing){elapsed+=dt;if(elapsed>=9){if(current===stops.length-1){playing=false;completed=true;elapsed=9;$('play').textContent='Rejouer le parcours';$('tourStatus').textContent='Parcours terminé';}else go(current+1);}}
 $('progress').value=elapsed;
 if(transition){dirty=true;let t=Math.min((now-transition.start)/1000,1);t=t*t*(3-2*t);camera.position.lerpVectors(transition.a,transition.p,t);controls.target.lerpVectors(transition.b,transition.t,t);if(t===1)transition=null;}
 if(navigation.active)navigation.update(dt);else controls.update();
 camera.updateMatrixWorld();
 const submerged=!!reef&&camera.position.y< -1.34&&inReef(camera.position.x,camera.position.z);
 if(submerged!==underwater){underwater=submerged;scene.background.set(underwater?'#699fa4':'#e7edf5');scene.fog.color.copy(scene.background);scene.fog.near=underwater?6:75;scene.fog.far=underwater?38:150;reef?.setUnderwater(underwater);dirty=true;}
 reefFrustum.setFromProjectionMatrix(reefProjection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
 const reefVisible=reefFrustum.intersectsBox(reefBox);
 if(ready&&reefVisible)ensureReef();
 const animateReef=!!reef&&shouldAnimateReef({visible:reefVisible,enabled:reefMotion,reduced:motionPreference.matches,close:(!!stops[current].reef||navigation.active)&&camera.position.distanceToSquared(reefSphere.center)<28*28,hidden:document.hidden||!stageVisible});
 if(animateReef){reefTick+=dt;if(reefTick>=1/30){reef.update(reefTick);reefTick=0;dirty=true;}}else reefTick=0;
 if(dirty){
  dirty=false;
  // Projection must use the current camera matrix, including in free navigation.
  camera.updateMatrixWorld();
  pins.forEach((p,i)=>{const v=projected.copy(pinPositions[i]).project(camera);p.style.left=`${(v.x*.5+.5)*stageWidth}px`;p.style.top=`${(-v.y*.5+.5)*stageHeight}px`;p.hidden=navigation.active||!ready||v.z>1||v.z< -1||Math.abs(v.x)>.9||Math.abs(v.y)>.8||(cutOn&&i!==current)||(i===14&&i!==current);});
  renderer.render(scene,camera);
 }
 return playing||!!transition||navigation.moving||animateReef;
}
