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
    roomHeading:'Explorez les chambres en 3D',
    roomText:'Situez les cottages par rapport à la plage et aux espaces communs, puis découvrez leur intérieur dans notre visite interactive.',
    roomLink:'Visiter les chambres en 3D',
    diveHeading:'De la plage au récif, en 3D',
    diveText:'Repérez l’espace plongée, l’accès à la plage et explorez le récif dans notre visite interactive du resort.',
    diveLink:'Explorer le récif en 3D',
    imageAlt:'Vue 3D des cottages, des espaces communs et de la plage de La Tortue à Dauin',
    homeLabel:'Accueil'
  },
  en: {
    url:'/resort-3d/', home:'/', rooms:'/cottages', diving:'/diving',
    title:'3D Resort Tour in Dauin | La Tortue Diving Center',
    description:'Explore La Tortue in Dauin in 3D: cottages, rooms, restaurant, beach and reef. Discover the resort layout and real photos before your stay.',
    heading:'Discover La Tortue before your stay',
    text:'From the cottages to the beach, find your way around the resort and explore in 3d with our interactive tour.',
    cta:'Explore the resort in 3D', footer:'3D resort tour',
    roomHeading:'Explore the rooms in 3D',
    roomText:'Find the cottages in relation to the beach and shared spaces, then step inside with our interactive tour.',
    roomLink:'Tour the rooms in 3D',
    diveHeading:'From the beach to the reef, in 3D',
    diveText:'Find the diving facilities and beach access, then explore the reef with our interactive resort tour.',
    diveLink:'Explore the reef in 3D',
    imageAlt:'3D view of the cottages, shared spaces and beach at La Tortue in Dauin',
    homeLabel:'Home'
  }
};
const escape = text => text.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function promo(c, featured=false) {
  return `<section class="resort-promo sand${featured?' resort-promo-featured':''}" aria-labelledby="resort-promo-title"><div class="container resort-promo-grid"><a href="${c.url}" class="resort-promo-image" tabindex="-1" aria-hidden="true"><img src="/resort-3d/assets/preview.webp?v=29" srcset="/resort-3d/assets/preview-600.webp?v=29 600w, /resort-3d/assets/preview.webp?v=29 828w" sizes="(max-width: 720px) 90vw, 50vw" width="828" height="510" alt="" loading="lazy" decoding="async"></a><div class="resort-promo-copy"><h2 id="resort-promo-title">${c.heading}</h2><p>${c.text}</p><a class="btn btn-primary" href="${c.url}">${c.cta} <span aria-hidden="true">↗</span></a></div></div></section>`;
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
    const destination=path.join(dist,c.url,'index.html');
    await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,html,'utf8');
    const prefix=locale==='fr'?'fr/':'';
    const edit=async(file,transform)=>{const p=path.join(dist,prefix+file);await fs.writeFile(p,transform(await fs.readFile(p,'utf8')),'utf8');};
    const afterHero=(page,content)=>{
      const index=page.indexOf('</section>');if(index<0)throw new Error('Missing page hero');
      page=page.slice(0,index+10)+'\n'+content+page.slice(index+10);
      return page.replace('</head>','<link rel="stylesheet" href="/resort-3d/promo.css?v=30"></head>');
    };
    await edit('index.html',page=>insertBefore(page,'<div id="footer-placeholder">',promo(c)+'\n').replace('</head>','<link rel="stylesheet" href="/resort-3d/promo.css?v=30"></head>'));
    await edit('cottages.html',page=>afterHero(page,promo({...c,heading:c.roomHeading,text:c.roomText,cta:c.roomLink},true)));
    await edit('footer.html',page=>insertBefore(page,`<a href="${locale==='fr'?'/fr/':''}cottages.html">`,`<a href="${c.url}">${c.footer}</a>\n`));
  }
  const sitemap=path.join(dist,'sitemap.xml');
  if(production){const xml=await fs.readFile(sitemap,'utf8');await fs.writeFile(sitemap,xml.replace('</urlset>',Object.values(locales).map(c=>`  <url><loc>${origin+c.url}</loc></url>`).join('\n')+'\n</urlset>'));}
  // Consolidate only explicit document variants; folder URLs are canonical.
  await fs.appendFile(path.join(dist,'_redirects'),'\n/resort-3d/index.html /resort-3d/ 301!\n/fr/resort-3d/index.html /fr/resort-3d/ 301!\n');
}
module.exports={buildResortPages,locales};
