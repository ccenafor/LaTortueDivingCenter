const en={
  'Ensemble':'Overview',
  'Resort 3D | La Tortue':'Resort 3D | La Tortue',
  'Visite interactive du resort La Tortue et photos des chambres et espaces communs.':'Explore La Tortue resort in 3D, with photos of the rooms and shared spaces.',
  'Exploration du resort':'Resort exploration',
  'Vue 3D. Glisser pour tourner. Clic droit glissé ou deux doigts pour déplacer la vue, pincer pour zoomer. Utiliser les boutons des étapes pour naviguer au clavier.':'3D view. Drag to rotate. Right-drag or two fingers to pan, pinch to zoom. Use the stop buttons to navigate by keyboard.',
  'Points de visite':'Tour stops','Commandes de déplacement libre':'Free navigation controls',
  'Glisser pour regarder · WASD / ZQSD pour avancer et se décaler · Flèches ← → pour tourner · R/F pour monter/descendre · I/K pour regarder en haut/bas · Maj pour accélérer · Échap pour quitter':'Drag to look around · WASD to move · ← → to turn · R/F to move up/down · I/K to look up/down · Shift to move faster · Escape to exit',
  'Déplacement':'Movement','Hauteur':'Height','Avancer':'Move forward','Se déplacer à gauche':'Move left','Reculer':'Move back','Se déplacer à droite':'Move right','Monter':'Move up','Descendre':'Move down',
  'Chargement du modèle 3D…':'Loading the 3D model…','Explorer librement':'Explore freely','Quitter le mode libre':'Exit free mode','↺ Vue d’ensemble':'↺ Overview','Revenir à la vue d’ensemble':'Return to overview','Zoom avant':'Zoom in','Zoom arrière':'Zoom out','Vue de dessus':'Top view','Masquer les feuillages':'Hide foliage','Afficher les feuillages':'Show foliage','Ouvrir la pièce':'Open room','Fermer la coupe':'Close cutaway',
  'Glisser : tourner · Clic droit / 2 doigts : déplacer · Molette : zoomer':'Drag: rotate · Right-click / two fingers: pan · Scroll: zoom',
  'EXPLORER':'EXPLORE','Les 6 intérieurs':'The 6 interiors','Choisir une chambre…':'Choose a room…','Étapes de la visite':'Tour stops','Le resort':'The resort','Vues de cet espace':'Views of this space','Extérieur':'Exterior','Intérieur':'Interior','Angle opposé':'Opposite angle','Salle d’eau':'Bathroom','Mettre les animaux en pause':'Pause animals','Animer les animaux':'Animate animals','Mouvements réduits activés':'Reduced motion enabled','Agrandir la photo de référence':'Enlarge reference photo','Photo précédente':'Previous photo','Photo suivante':'Next photo','Étape précédente':'Previous stop','Démarrer le parcours':'Start the tour','Reprendre le parcours':'Resume the tour','Mettre en pause':'Pause tour','Rejouer le parcours':'Replay the tour','Étape suivante':'Next stop','Progression de l’étape':'Stop progress','15 étapes · environ 1 min 45 · pause à tout moment':'15 stops · around 1 min 45 · pause at any time','Photos de la section':'Photos from this area','Fermer ✕':'Close ✕','Le lecteur 3D nécessite JavaScript.':'The 3D viewer requires JavaScript.',
  'Le resort':'The resort','La plage':'The beach','Cottage vue mer 1':'Seaview Cottage 1','Cottage Familial vue mer 2':'Family Seaview Cottage 2','Cottage vue mer 3':'Seaview Cottage 3','Pétanque et espace de détente':'Pétanque and relaxation area','Cottage Jardin':'Garden Cottage','Le dortoir':'Dormitory','Le bar-restaurant':'Bar & restaurant','Entrée et parking':'Entrance & parking','Plongée et local matériel':'Diving & equipment room','Chambre Deluxe':'Deluxe Room','La zone de réunion':'Meeting area','Toilettes et douches':'Toilets & showers','Le récif de La Tortue':'La Tortue reef',
  'Plage':'Beach','Détente':'Relaxation','Jardin':'Garden','Dortoir':'Dormitory','Bar':'Bar','Entrée':'Entrance','Plongée':'Diving','Réunion':'Meeting','Sanitaires':'Bathrooms','Le récif':'The reef','Cottage 1':'Cottage 1','Cottage 2':'Cottage 2','Cottage 3':'Cottage 3','Deluxe':'Deluxe',
  'Passage & douchette':'Walkway & foot shower','Abri complet':'Full shelter','Bar ouvert':'Open bar','Plan du bar':'Bar plan','Entrée complète':'Full entrance','Enseigne ronde':'Round sign','Préparation':'Preparation','Local matériel':'Equipment room','Depuis l’entrée':'From the entrance','Bâtiment':'Building','Plan ouvert':'Open plan','Plage & récif':'Beach & reef','Sous l’eau':'Underwater','Vers le resort':'Towards the resort'
  ,'WebGL indisponible. Les photos et les rendus restent disponibles.':'WebGL is unavailable. Photos and rendered views remain available.'
  ,'Aller à {name}':'Go to {name}','LIBRE':'FREE','{name} — photo {number}':'{name} — photo {number}'
  ,'toiture et façade retirées':'roof and facade removed','vue ouverte':'open view','toiture et mur côté entrée retirés':'roof and entrance-side wall removed','toiture et mur arrière retirés':'roof and rear wall removed','toiture et cloisons hautes retirées':'roof and upper partitions removed'
  ,'Parcours en cours':'Tour in progress','Étape':'Stop','En pause':'Paused','Vue de dessus · entrée en bas, plage en haut':'Top view · entrance at the bottom, beach at the top','Chargement du récif…':'Loading the reef…','Le récif n’a pas pu être chargé. Sélectionner à nouveau Le récif pour réessayer.':'The reef could not be loaded. Select The reef again to try once more.'
  ,'Exploration libre du resort. Glisser pour regarder, WASD ou ZQSD pour se déplacer.':'Free exploration of the resort. Drag to look around; use WASD to move.','Exploration libre · Échap pour retrouver la vue guidée':'Free exploration · Escape to return to the guided view','Vue guidée':'Guided view','Le modèle ne peut pas être chargé. Les photos restent consultables. Réessayer en rechargeant la page.':'The model could not be loaded. Photos are still available. Try reloading the page.','Parcours terminé':'Tour complete','Entrée du resort La Tortue':'La Tortue resort entrance'
};

export const translations={fr:{},en};
export function localeOf(locale){return String(locale||'fr').toLowerCase().startsWith('en')?'en':'fr';}
export function t(locale,key,params={}){
 const value=localeOf(locale)==='en'?(en[key]||key):key;
 return value.replace(/\{(\w+)\}/g,(_,name)=>params[name]??`{${name}}`);
}
export function localizeStop(stop,index,locale){
 if(localeOf(locale)==='fr')return stop;
 const views=stop.views&&Object.fromEntries(Object.entries(stop.views).map(([key,value])=>[key,{...value,label:t(locale,value.label)}]));
 return {...stop,name:t(locale,stop.name),short:t(locale,stop.short),views};
}

// Pure string transformation for the static template used by the build. Runtime labels are
// translated independently so it is safe to use this from Node without browser globals.
export function translateResortHtml(html,locale){
 if(localeOf(locale)==='fr')return html;
 let result=html.replace('<html lang="fr">','<html lang="en">');
 for(const [from,to] of Object.entries(en))result=result.split(from).join(to);
 return result;
}
