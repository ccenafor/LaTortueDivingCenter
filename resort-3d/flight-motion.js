import * as THREE from './vendor/three.module.js';
import {inReef,reefFloor} from './reef-layout.js?v=20';

// Horizontal movement follows heading, independently of where the user looks vertically.
export function flightDelta(yaw, forward, side, vertical, seconds, speed=2.8){
 const v=new THREE.Vector3(-Math.sin(yaw)*forward+Math.cos(yaw)*side,vertical,-Math.cos(yaw)*forward-Math.sin(yaw)*side);
 if(v.lengthSq()>1)v.normalize();
 return v.multiplyScalar(Math.min(Math.max(seconds,0),.05)*speed);
}
export function limitFlight(position){
 position.x=THREE.MathUtils.clamp(position.x,-55,55);
 const floor=inReef(position.x,position.z)?reefFloor(position.x,position.z)+.45:.25;
 position.y=THREE.MathUtils.clamp(position.y,floor,40);
 position.z=THREE.MathUtils.clamp(position.z,-65,55);
}
