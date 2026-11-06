export function formatCost(cost:number|null):string{return cost===null?'Not available':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0,maximumFractionDigits:2}).format(cost);}
export interface Rocket {id:string;name:string;description:string;imageUrl:string|null;launchCost:number|null;country:string|null;firstFlight:string|null;local:boolean}
export const record=(x:unknown):Record<string,unknown>=>x!==null&&typeof x==='object'&&!Array.isArray(x)?x as Record<string,unknown>:{};
const text=(x:unknown)=>typeof x==='string'&&x.trim()?x.trim():null;
export function imageUrl(x:unknown):string|null {try{const u=new URL(String(x));return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}}
export function validDate(x:string):boolean{if(!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;const date=new Date(x+'T00:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===x;}
export function normalizeRocket(raw:unknown):Rocket{
 const x=record(raw);if(!(typeof x.id==='number'&&Number.isSafeInteger(x.id)&&x.id>0))throw Error('Invalid rocket identifier');
 return {id:String(x.id),name:text(x.full_name)||'Unnamed rocket',description:text(x.description)||'Description not available.',imageUrl:imageUrl(x.image_url),launchCost:typeof x.launch_cost==='number'&&Number.isFinite(x.launch_cost)&&x.launch_cost>=0?x.launch_cost:null,country:text(record(x.manufacturer).country_code),firstFlight:typeof x.maiden_flight==='string'&&validDate(x.maiden_flight)?x.maiden_flight:null,local:false};
}
export function filterRockets(items:Rocket[],query:string):Rocket[]{const q=query.trim().toLowerCase();return items.filter(r=>`${r.name} ${r.description} ${r.country||''}`.toLowerCase().includes(q));}
export interface RocketInput{name:string;description:string;imageUrl:string;launchCost:string;country:string;firstFlight:string}
export function createLocalRocket(input:RocketInput):Rocket{
 const name=input.name.trim(),description=input.description.trim();if(!name||name.length>160||!description||description.length>3000)throw Error('Name (max 160) and description (max 3000) are required.');
 const image=imageUrl(input.imageUrl);if(input.imageUrl.trim()&&!image)throw Error('Image must use an HTTP or HTTPS URL.');
 const cost=input.launchCost.trim()?Number(input.launchCost):null;if(cost!==null&&(!Number.isFinite(cost)||cost<0))throw Error('Launch cost must be a nonnegative number.');
 if(input.firstFlight&&!validDate(input.firstFlight))throw Error('First flight must be a valid date.');
 if(input.country.length>80)throw Error('Country must be at most 80 characters.');
 return {id:`local-${crypto.randomUUID()}`,name,description,imageUrl:image,launchCost:cost,country:input.country.trim()||null,firstFlight:input.firstFlight||null,local:true};
}
