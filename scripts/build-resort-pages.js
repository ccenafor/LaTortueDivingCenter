const fs = require('node:fs/promises');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {isResortProduction} = require('./resort-3d-context');
const origin = 'https://latortuediving.com';
const locales = {
  fr: {
    url:'/fr/resort-3d/', home:'/fr/', rooms:'/fr/cottages', diving:'/fr/diving',
    title:'Visite 3D du resort à Dauin | La Tortue Diving Center',
    description:'Explorez La Tortue à Dauin en 3D : cottages, chambres, restaurant, plage et récif. Découvrez les espaces du resort et leurs photos avant votre séjour.',
    heading:'Découvrez La Tortue avant votre séjour',
    text:'Des cottages à la plage, repérez les espaces du resort et explorez-les en 3D grâce à notre visite interactive.',
    cta:'Explorer le resort en 3D', footer:'Visite 3D du resort',
    roomLink:'Situer les cottages dans le resort', diveLink:'Explorer le resort et son récif',
    imageAlt:'Vue 3D des cottages, des espaces communs et de la plage de La Tortue à Dauin',
    pageHeading:'Une visite de La Tortue, de la plage aux cottages',
    pageText:'Découvrez l’agencement de La Tortue Diving Center à Dauin, sur l’île de Negros aux Philippines. La visite réunit les cottages vue mer et jardin, le dortoir, la chambre Deluxe, le bar-restaurant et les espaces de plongée. Les photos associées permettent de voir les lieux réels.',
    pageText2:'Suivez le parcours guidé ou explorez librement le resort, la plage et la scène sous-marine du récif.',
    roomsLabel:'Découvrir les chambres', divingLabel:'Découvrir la plongée à Dauin', homeLabel:'Accueil'
  },
  en: {
    url:'/resort-3d/', home:'/', rooms:'/cottages', diving:'/diving',
    title:'3D Resort Tour in Dauin | La Tortue Diving Center',
    description:'Explore La Tortue in Dauin in 3D: cottages, rooms, restaurant, beach and reef. Discover the resort layout and real photos before your stay.',
    heading:'Discover La Tortue before your stay',
    text:'From the cottages to the beach, find your way around the resort and explore in 3d with our interactive tour.',
    cta:'Explore the resort in 3D', footer:'3D resort tour',
    roomLink:'Find the cottages in the resort', diveLink:'Explore the resort and its reef',
    imageAlt:'3D view of the cottages, shared spaces and beach at La Tortue in Dauin',
    pageHeading:'Explore La Tortue, from the beach to the cottages',
    pageText:'Discover the layout of La Tortue Diving Center in Dauin, on Negros Island in the Philippines. The tour brings together the sea-view and garden cottages, dormitory, Deluxe room, bar-restaurant and diving facilities. The accompanying photos show the real spaces.',
    pageText2:'Follow the guided tour or explore the resort, beach and underwater reef scene freely.',
    roomsLabel:'Discover the rooms', divingLabel:'Discover diving in Dauin', homeLabel:'Home'
  }
};
const escape = text => text.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function promo(c) {
  return `<section class="resort-promo sand" aria-labelledby="resort-promo-title"><div class="container resort-promo-grid"><a href="${c.url}" class="resort-promo-image" tabindex="-1" aria-hidden="true"><img src="/resort-3d/assets/preview.webp?v=29" srcset="/resort-3d/assets/preview-600.webp?v=29 600w, /resort-3d/assets/preview.webp?v=29 828w" sizes="(max-width: 720px) 90vw, 50vw" width="828" height="510" alt="" loading="lazy" decoding="async"></a><div class="resort-promo-copy"><h2 id="resort-promo-title">${c.heading}</h2><p>${c.text}</p><a class="btn btn-primary" href="${c.url}">${c.cta} <span aria-hidden="true">↗</span></a></div></div></section>`;
}
function insertBefore(html, marker, content) {
  if (!html.includes(marker)) throw new Error(`Resort integration marker missing: ${marker}`);
  return html.replace(marker, content+marker);
}
async function buildResortPages(root, dist, env=process.env) {
  const {translateResortHtml} = await import(pathToFileURL(path.join(root,'resort-3d/i18n.js')).href);
  const source = await fs.readFile(path.join(root,'resort-3d/index.html'),'utf8');
  const production = isResortProduction(env);
  for (const [locale,c] of Object.entries(locales)) {
    const url=origin+c.url;
    let html=translateResortHtml(source,locale);
    html=html.replace(/<meta name="robots"[^>]*>/,`<meta name="robots" content="${production?'index, follow, max-image-preview:large':'noindex, nofollow, noarchive'}">`)
      .replace(/<title>.*?<\/title>/,`<title>${c.title}</title>`)
      .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escape(c.description)}">`);
    if (!/<base\s/i.test(html)) html=html.replace('<head>','<head><base href="/resort-3d/">');
    const schema={'@context':'https://schema.org','@type':'WebPage','@id':url+'#webpage',url,name:c.title,description:c.description,inLanguage:locale,
      isPartOf:{'@type':'WebSite',url:origin+'/',name:'La Tortue Diving Center'},primaryImageOfPage:origin+'/resort-3d/assets/preview.webp',
      breadcrumb:{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:c.homeLabel,item:origin+c.home},{'@type':'ListItem',position:2,name:c.footer,item:url}]}};
    html=html.replace('</head>',`<link rel="canonical" href="${url}"><link rel="alternate" hreflang="fr" href="${origin}/fr/resort-3d/"><link rel="alternate" hreflang="en" href="${origin}/resort-3d/"><link rel="alternate" hreflang="x-default" href="${origin}/resort-3d/"><meta property="og:type" content="website"><meta property="og:title" content="${c.title}"><meta property="og:description" content="${escape(c.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/resort-3d/assets/preview.webp"><meta property="og:image:alt" content="${c.imageAlt}"><meta property="og:locale" content="${locale==='fr'?'fr_FR':'en_GB'}"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
    html=html.replace('</body>',`<section class="sand resort-tour-context"><div class="container"><h2>${c.pageHeading}</h2><p>${c.pageText}</p><p>${c.pageText2}</p><p><a href="${c.rooms}">${c.roomsLabel}</a> · <a href="${c.diving}">${c.divingLabel}</a></p></div></section></body>`);
    const destination=path.join(dist,c.url,'index.html');
    await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,html,'utf8');
    const prefix=locale==='fr'?'fr/':'';
    const edit=async(file,transform)=>{const p=path.join(dist,prefix+file);await fs.writeFile(p,transform(await fs.readFile(p,'utf8')),'utf8');};
    await edit('index.html',page=>{
      // The home slider is the first section; the preview follows it.
      const index=page.indexOf('</section>');if(index<0)throw new Error('Missing home hero');
      page=page.slice(0,index+10)+'\n'+promo(c)+page.slice(index+10);
      return page.replace('</head>','<link rel="stylesheet" href="/resort-3d/promo.css?v=29"></head>');
    });
    await edit('cottages.html',page=>insertBefore(page,'<div class="room-section">',`<p class="section-cta"><a class="btn btn-outline" href="${c.url}?stop=rooms">${c.roomLink}</a></p>\n`));
    await edit('diving.html',page=>insertBefore(page,'<h2 id="ssi-courses">',`<p class="section-cta"><a class="btn btn-outline" href="${c.url}?stop=reef">${c.diveLink}</a></p>\n`));
    await edit('footer.html',page=>insertBefore(page,`<a href="${locale==='fr'?'/fr/':''}cottages.html">`,`<a href="${c.url}">${c.footer}</a>\n`));
  }
  const sitemap=path.join(dist,'sitemap.xml');
  if(production){const xml=await fs.readFile(sitemap,'utf8');await fs.writeFile(sitemap,xml.replace('</urlset>',Object.values(locales).map(c=>`  <url><loc>${origin+c.url}</loc></url>`).join('\n')+'\n</urlset>'));}
  // Consolidate only explicit document variants; folder URLs are canonical.
  await fs.appendFile(path.join(dist,'_redirects'),'\n/resort-3d/index.html /resort-3d/ 301!\n/fr/resort-3d/index.html /fr/resort-3d/ 301!\n');
}
module.exports={buildResortPages,locales};
