import assert from 'node:assert/strict';
import {createRenderLoop} from '../resort-3d/render-loop.js';

const queued=new Map();let id=0,continuous=false,frames=[];
const loop=createRenderLoop((now,dt)=>{frames.push(dt);return continuous;},{
 request(fn){queued.set(++id,fn);return id;},cancel(id){queued.delete(id);}
});
function tick(now){const [id,fn]=queued.entries().next().value;queued.delete(id);fn(now);}
loop.invalidate();loop.invalidate();assert.equal(queued.size,1,'coalesce simultaneous changes');
tick(100);assert.equal(queued.size,0,'idle scene stops');
continuous=true;loop.invalidate();tick(5000);assert.equal(frames.at(-1),0,'no jump after idle');
tick(5016);assert.equal(frames.at(-1),.016);assert.equal(queued.size,1);
loop.setEnabled(false);assert.equal(queued.size,0,'hidden scene cancels work');
loop.invalidate();assert.equal(queued.size,0,'hidden changes do not render');
loop.setEnabled(true);tick(20000);assert.equal(frames.at(-1),0,'resume resets clock');
continuous=false;tick(20016);assert.equal(queued.size,0);
console.log('PASS: idle, coalescing, animation, hidden cancellation and resume.');
