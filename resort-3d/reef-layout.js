// Illustrative house-reef vignette, not surveyed sanctuary boundaries or bathymetry.
export const reefBounds = {x:0, z:-36, radiusX:11, radiusZ:5.4, waterY:-1.33};
export function inReef(x,z,margin=0){
 return (Math.abs(x)/(reefBounds.radiusX+margin))**2+(Math.abs(z-reefBounds.z)/(reefBounds.radiusZ+margin))**2<1;
}
export function reefFloor(x,z){
 const slope=Math.max(0,Math.min(1,(-z-30.6)/10.8));
 return -1.95-2.6*slope+.07*Math.sin(x*2+z)*Math.cos(z*2);
}
export const fishTypes = [
 {name:'Poissons-clowns',body:'#e97b29',fin:'#542d23',pattern:'clown',count:5,length:.48,height:.22},
 {name:'Poissons-papillons',body:'#f3d64d',fin:'#e8b62b',pattern:'butterfly',count:5,length:.58,height:.38},
 {name:'Poissons-chirurgiens',body:'#3985af',fin:'#f4c64a',pattern:'surgeon',count:7,length:.62,height:.32},
 {name:'Poissons-perroquets',body:'#42a998',fin:'#528bc0',pattern:'parrot',count:4,length:.78,height:.36},
 {name:'Poissons-cardinaux',body:'#dca26d',fin:'#b57753',pattern:'cardinal',count:8,length:.35,height:.16},
 {name:'Banc de petits poissons argentés',body:'#bcd8d9',fin:'#7aa6b1',pattern:'silver',count:12,length:.36,height:.12}
];
export function shouldAnimateReef({visible,enabled,reduced,close,hidden}){
 return visible&&enabled&&!reduced&&close&&!hidden;
}

// Compact oval window on the reef, close to the original coastal cutaway.
export function reefEdge(angle,scale=1){
 const c=Math.cos(angle),s=Math.sin(angle);
 return [c*reefBounds.radiusX*scale,reefBounds.z+s*reefBounds.radiusZ*scale];
}
