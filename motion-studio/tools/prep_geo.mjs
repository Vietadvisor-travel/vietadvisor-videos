import fs from 'fs'; import {feature} from 'topojson-client';
const topo=JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const fc=feature(topo,topo.objects.countries);
const want={'704':'VN','156':'CN','418':'LA','116':'KH','764':'TH','104':'MM','458':'MY','608':'PH','158':'TW','360':'ID','096':'BN','702':'SG','050':'BD','356':'IN'};
const out={};
for(const f of fc.features){const k=want[f.id]; if(!k) continue; const g=f.geometry; const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;
 out[k]=polys.map(p=>p[0].map(([x,y])=>[+x.toFixed(3),+y.toFixed(3)])).filter(r=>r.some(([x,y])=>x>85&&x<128&&y>-3&&y<32));}
fs.writeFileSync('engine/geo_data.js','/* Natural Earth 1:50m (public domain) */\nconst GEO='+JSON.stringify(out)+';');
