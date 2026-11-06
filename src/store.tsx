import React,{createContext,useContext,useState,useEffect,useCallback} from 'react';
import type {Rocket,RocketInput} from './rockets.ts';
import {createLocalRocket} from './rockets.ts';
import {fetchRockets} from './api.ts';
interface Catalog {items:Rocket[];status:'loading'|'error'|'success';error:string;retry:()=>void;add:(input:RocketInput)=>Rocket}
const Context=createContext<Catalog|null>(null);
export function RocketProvider({children}:{children:React.ReactNode}){
 const [remote,setRemote]=useState<Rocket[]>([]),[local,setLocal]=useState<Rocket[]>([]),[status,setStatus]=useState<Catalog['status']>('loading'),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{const abort=new AbortController();setStatus('loading');setError('');fetchRockets(abort.signal).then(items=>{if(!abort.signal.aborted){setRemote(items);setStatus('success');}}).catch(e=>{if(!abort.signal.aborted){setError(e instanceof Error?e.message:'Could not load rockets.');setStatus('error');}});return()=>abort.abort();},[attempt]);
 const add=useCallback((input:RocketInput)=>{const rocket=createLocalRocket(input);setLocal(xs=>[rocket,...xs]);return rocket;},[]);
 return <Context.Provider value={{items:[...local,...remote],status,error,retry:()=>setAttempt(x=>x+1),add}}>{children}</Context.Provider>;
}
export function useRockets(){const state=useContext(Context);if(!state)throw Error('RocketProvider missing');return state;}
