const {readFileSync}=require('node:fs');
const vm=require('node:vm');const assert=require('node:assert/strict');
const source=readFileSync('resort-3d/viewer.js','utf8');
const images=[],timers=new Map();let serial=0;
const state={list:['a.webp','b.webp','c.webp','d.webp'],open:false};
const context={Map,JSON,Image:class{constructor(){images.push(this)} decode(){return Promise.resolve()}},document:{hidden:false},navigator:{connection:{}},galleryWidths:{'b.webp':[600,1600]},photoList:()=>state.list,$:()=>({open:state.open}),setTimeout:fn=>{timers.set(++serial,fn);return serial},clearTimeout:id=>timers.delete(id)};
vm.createContext(context);vm.runInContext('let photoIndex=0;'+source.slice(source.indexOf('const photoSizes='),source.indexOf('function showPhoto(){')),context);
function warm(){vm.runInContext('warmPhotos()',context);for(const [id,fn] of timers){timers.delete(id);fn()}}
warm();assert.equal(images.length,3);assert.equal(images[0].src,'b.webp');assert.match(images[0].srcset,/b-600.webp 600w/);assert.equal(images[0].fetchPriority,'low');warm();assert.equal(images.length,3,'no repeated preload');
state.open=true;warm();assert.equal(images.at(-1).srcset,'','lightbox warms full resolution');
context.navigator.connection.saveData=true;state.list=['e.webp','f.webp','g.webp'];warm();assert.equal(images.length,4,'save-data disables speculative downloads');
context.navigator.connection.saveData=false;
for(let i=0;i<12;i++){state.list=[`x${i}.webp`,`y${i}.webp`,`z${i}.webp`];warm()}
assert.equal(vm.runInContext('photoCache.size',context),8,'decoded references bounded');
console.log('PASS adjacent preloading, responsive source, deduplication, lightbox, save-data and bounded cache');
