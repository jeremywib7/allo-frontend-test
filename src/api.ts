import {normalizeRocket,record} from './rockets.ts';
import type {Rocket} from './rockets.ts';
const BASE='https://lldev.thespacedevs.com/2.2.0/config/launcher/';
export const LIST_URL=BASE+'?manufacturer__name=SpaceX&mode=detailed&limit=20';
async function read(url:string,signal:AbortSignal|undefined,request:typeof fetch){const response=await request(url,{signal});if(!response.ok)throw Error(response.status===429?'API rate limit (429). Please wait before retrying.':`API request failed (${response.status}).`);return response.json();}
export async function fetchRockets(signal?:AbortSignal,request:typeof fetch=fetch):Promise<Rocket[]>{
 let url:string|null=LIST_URL;const seen=new Set<string>();const all:Rocket[]=[];
 while(url){if(seen.has(url)||seen.size>=20)throw Error('Invalid pagination loop.');seen.add(url);const data=record(await read(url,signal,request));if(!Array.isArray(data.results))throw Error('Invalid rocket list response.');all.push(...data.results.map(normalizeRocket));if(data.next!=null&&typeof data.next!=='string')throw Error('Invalid pagination.');url=data.next as string|null||null;if(url){const next=new URL(url);if(next.origin!=='https://lldev.thespacedevs.com'||next.pathname!=='/2.2.0/config/launcher/')throw Error('Invalid pagination origin.');}}
 return [...new Map(all.map(r=>[r.id,r])).values()];
}
export async function fetchRocket(id:string,signal?:AbortSignal,request:typeof fetch=fetch):Promise<Rocket>{if(!/^[1-9]\d*$/.test(id))throw Error('Invalid rocket identifier.');const r=normalizeRocket(await read(BASE+id+'/',signal,request));if(r.id!==id)throw Error('Invalid detail identifier.');return r;}
