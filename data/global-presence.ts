export type GlobalPresenceRegion="Americas"|"Europe"|"Asia"|"Africa"|"Oceania"|"Middle East";
export type GlobalPresenceCity={id:string;city:string;country:string;code:string;region:GlobalPresenceRegion;image:string;alt:string;detail:string;coordinates:string};
export const globalPresenceRegions=["All","Americas","Europe","Asia","Africa","Oceania","Middle East"] as const;
export const globalPresenceStats=[{value:"25+",label:"CITIES"},{value:"6",label:"CONTINENTS"},{value:"10K+",label:"STUDENTS"},{value:"98%",label:"SUCCESS RATE"}] as const;
const img=(id:string)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=82`;
const generic="Global academic and research reference point.";
export const globalPresenceCities:GlobalPresenceCity[]=[
["new-york","New York","USA","US","Americas","photo-1496442226666-8d4d0e62e6e9","New York city skyline","74°W  ·  41°N"],
["london","London","UK","GB","Europe","photo-1513635269975-59663e0ac1ad","London city skyline","0°W  ·  51°N"],
["dubai","Dubai","UAE","AE","Middle East","photo-1512453979798-5ea266f8880c","Dubai skyline","55°E  ·  25°N"],
["tokyo","Tokyo","Japan","JP","Asia","photo-1540959733332-eab4deabeeaf","Tokyo city skyline","140°E  ·  36°N"],
["singapore","Singapore","Singapore","SG","Asia","photo-1525625293386-3f8f99389edd","Singapore skyline","104°E  ·  1°N"],
["sydney","Sydney","Australia","AU","Oceania","photo-1660381187645-6d968c6f21e5","Sydney skyline and harbour","151°E  ·  34°S"],
["paris","Paris","France","FR","Europe","photo-1502602898657-3e91760cbb34","Paris city skyline","2°E  ·  49°N"],
["toronto","Toronto","Canada","CA","Americas","photo-1517090504586-fde19ea6066f","Toronto skyline","79°W  ·  44°N"],
["berlin","Berlin","Germany","DE","Europe","photo-1599946347371-68eb71b16afc","Berlin cityscape","13°E  ·  52°N"],
["shanghai","Shanghai","China","CN","Asia","photo-1548919973-5cef591cdbc9","Shanghai skyline","121°E  ·  31°N"],
["sao-paulo","São Paulo","Brazil","BR","Americas","photo-1543059080-f9b1272213d5","São Paulo city skyline","47°W  ·  24°S"],
["amsterdam","Amsterdam","Netherlands","NL","Europe","photo-1534351590666-13e3e96b5017","Amsterdam cityscape","5°E  ·  52°N"],
["melbourne","Melbourne","Australia","AU","Oceania","photo-1514395462725-fb4566210144","Melbourne skyline","145°E  ·  38°S"],
["los-angeles","Los Angeles","USA","US","Americas","photo-1494522358652-f30e61a60313","Los Angeles skyline","118°W  ·  34°N"],
["seoul","Seoul","South Korea","KR","Asia","photo-1546874177-9e664107314e","Seoul city skyline at night","81°E  ·  33°N"],
["zurich","Zurich","Switzerland","CH","Europe","photo-1515488764276-beab7607c1e6","Zurich cityscape","8°E  ·  47°N"],
["mexico-city","Mexico City","Mexico","MX","Americas","photo-1518105779142-d975f22f1b0a","Mexico City skyline","99°W  ·  19°N"],
["nairobi","Nairobi","Kenya","KE","Africa","photo-1690715541830-8146074eab02","Nairobi cityscape","37°E  ·  1°S"],
["istanbul","Istanbul","Turkey","TR","Europe","photo-1524231757912-21f4fe3a7200","Istanbul skyline","29°E  ·  41°N"],
["kuala-lumpur","Kuala Lumpur","Malaysia","MY","Asia","photo-1596422846543-75c6fc197f07","Kuala Lumpur skyline","102°E  ·  3°N"],
["cairo","Cairo","Egypt","EG","Africa","photo-1572252009286-268acec5ca0a","Cairo cityscape","31°E  ·  30°N"],
["chicago","Chicago","USA","US","Americas","photo-1494522358652-f30e61a60313","Chicago skyline","88°W  ·  42°N"],
["barcelona","Barcelona","Spain","ES","Europe","photo-1583422409516-2895a77efded","Barcelona cityscape","2°E  ·  41°N"],
["johannesburg","Johannesburg","South Africa","ZA","Africa","photo-1560253023-3ec5d502959f","Johannesburg skyline","28°E  ·  26°S"],
["vienna","Vienna","Austria","AT","Europe","photo-1516550893923-42d28e5677af","Vienna cityscape","16°E  ·  48°N"]
].map(([id,city,country,code,region,photoId,alt,coordinates])=>({id,city,country,code,region,image:img(photoId),alt,detail:city==="Seoul"?"K-research and innovation redefining the Asian century through elite universities.":generic,coordinates})) as GlobalPresenceCity[];
if(globalPresenceCities.length!==25)throw new Error("Global Presence must contain exactly 25 cities.");
export function getGlobalPresenceCities(region:(typeof globalPresenceRegions)[number]){return region==="All"?globalPresenceCities:globalPresenceCities.filter(c=>c.region===region);}
