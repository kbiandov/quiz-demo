import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, Play, BarChart3, BookOpen, ListChecks, Home, LogOut, User, Settings } from "lucide-react";
import Papa from "papaparse";

const SHEETS = {
  classes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1460999158&single=true&output=csv",
  subjects: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=567850345&single=true&output=csv",
  lessons: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1551143625&single=true&output=csv",
  questions: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=560252204&single=true&output=csv",
};

const STORAGE_KEYS = { profile:'mathapp_profile_v1', results:'mathapp_results_v1', settings:'mathapp_settings_v1' };

function useLocalStorage(key, initialValue){
  const [value,setValue] = useState(()=>{ try{ const raw=localStorage.getItem(key); return raw? JSON.parse(raw): initialValue; }catch{ return initialValue; } });
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(value)); }catch{} },[key,value]);
  return [value,setValue];
}
async function fetchCSV(url){
  return new Promise((resolve,reject)=>{
    Papa.parse(url,{download:true,header:true,skipEmptyLines:true, complete:(res)=>resolve(res.data), error:(err)=>reject(err)});
  });
}
function useSheetsData(){
  const [data,setData] = useState({classes:[],subjects:[],lessons:[],questions:[]});
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  useEffect(()=>{ let c=false; (async()=>{
    setLoading(true); setError(null);
    try{ const [classes,subjects,lessons,questions]=await Promise.all([fetchCSV(SHEETS.classes),fetchCSV(SHEETS.subjects),fetchCSV(SHEETS.lessons),fetchCSV(SHEETS.questions)]);
      if(!c) setData({classes,subjects,lessons,questions});
    }catch(e){ if(!c) setError(e?.message||'Грешка при зареждане'); }
    finally{ if(!c) setLoading(false); }
  })(); return ()=>{c=true}; },[]);
  return {...data,loading,error};
}
const normalizeId=(v)=> v==null? null: String(v).trim();
function groupBy(arr,fn){ return arr.reduce((a,x)=>{ const k=fn(x); (a[k]=a[k]||[]).push(x); return a; },{}); }

function HeaderBar({ title, profile, onHome, onLogout, onOpenSettings }){
  return (<div className='sticky top-0 z-10 bg-white/80 backdrop-blur border-b'>
    <div className='mx-auto max-w-4xl px-4 py-3 flex items-center justify-between'>
      <div className='flex items-center gap-2'><Button variant='ghost' size='icon' onClick={onHome}><Home className='h-5 w-5'/></Button><h1 className='text-lg font-semibold'>{title}</h1></div>
      <div className='flex items-center gap-2 text-sm text-slate-600'><User className='h-4 w-4'/><span>{profile?.name||'Гост'} · {profile?.classId?`Клас: ${profile.classId}`:'Без клас'}</span>
        <Button variant='outline' size='sm' onClick={onLogout} className='ml-2'><LogOut className='h-4 w-4 mr-2'/>Смени профил</Button>
        <Button variant='ghost' size='icon' onClick={onOpenSettings} title='Настройки' className='group'><Settings className='h-6 w-6 text-gray-700 transition-transform group-hover:rotate-90 group-hover:text-blue-500'/></Button></div>
    </div></div>);
}
function SquareButton({icon:Icon,label,onClick}){ return (<button onClick={onClick} className='group flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition w-full aspect-square'><Icon className='h-10 w-10 mb-3'/><span className='text-sm font-medium'>{label}</span></button>); }

function Onboarding({ classes, onDone }){
  const [name,setName] = useState(''); const [classId,setClassId] = useState('');
  const canContinue = name.trim().length>=2 && classId;
  return (<div className='min-h-screen bg-gradient-to-b from-white to-slate-50'><div className='mx-auto max-w-md px-4 py-10'>
    <h1 className='text-2xl font-bold mb-2'>Добре дошъл! 🎓</h1><p className='text-slate-600 mb-6'>Нека те опознаем, за да ти подберем правилните тестове.</p>
    <div className='space-y-4'>
      <div><label className='block text-sm font-medium mb-1'>Име / прякор</label><Input placeholder='напр. Алекс' value={name} onChange={(e)=>setName(e.target.value)}/></div>
      <div><label className='block text-sm font_medium mb-1'>Кой клас си?</label>
        <select className='w-full rounded-lg border border-slate-300 px-3 py-2' value={classId} onChange={(e)=>setClassId(e.target.value)}>
          <option value=''>Избери клас</option>
          {classes.map(c=>(<option key={normalizeId(c.id)||c.name} value={normalizeId(c.id)||c.name}>{c.name||c.title||c.class||c.id}</option>))}
        </select></div>
      <Button className='w-full' onClick={()=>onDone({name:name.trim(), classId})} disabled={!canContinue}>Продължи</Button>
    </div><p className='text-xs text-slate-500 mt-6'>* Запазваме само име/прякор и клас на устройството ти.</p>
  </div></div>);
}

function TheoryScreen(){ return (<div className='max-w-3xl mx-auto p-6 text-slate-700'><h2 className='text-xl font-semibold mb-3'>Теория</h2><p>Тук може да показваме резюмета по уроци или да вградим външни материали.</p></div>); }
function StatCard({label,value}){ return (<Card><CardContent className='p-4 text-center'><div className='text-2xl font-bold'>{value}</div><div className='text-xs text-slate-500'>{label}</div></CardContent></Card>); }

export default function App(){
  const { classes, lessons, questions, loading, error } = useSheetsData();
  const [profile,setProfile] = useLocalStorage(STORAGE_KEYS.profile, null);
  const [route,setRoute] = useState('home');
  useEffect(()=>{ if(!profile && !loading) setRoute('onboarding'); },[profile,loading]);

  if (loading) return (<div className='min-h-screen grid place-items-center'>Зареждане…</div>);
  if (error) return (<div className='min-h-screen grid place-items-center p-6'><div className='max-w-md text-center'><div className='text-xl font-semibold mb-2'>Възникна грешка</div><div className='text-slate-600 mb-4'>{String(error)}</div><Button onClick={()=>location.reload()}>Презареди</Button></div></div>);
  if (route==='onboarding' || !profile) return <Onboarding classes={classes} onDone={(p)=>{ setProfile(p); setRoute('home'); }} />;

  return (<div className='min-h-screen bg-gradient-to-b from-white to-slate-50'>
    <HeaderBar title='Начало' profile={profile} onHome={()=>setRoute('home')} onLogout={()=>{setProfile(null); setRoute('onboarding')}} onOpenSettings={()=>{}} />
    <div className='mx-auto max-w-4xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
      <SquareButton icon={BookOpen} label='Теория' onClick={()=>{}}/>
      <SquareButton icon={ListChecks} label='Тестове' onClick={()=>{}}/>
      <SquareButton icon={CheckCircle} label='Резултати' onClick={()=>{}}/>
      <SquareButton icon={BarChart3} label='Статистика' onClick={()=>{}}/>
    </div>
  </div>);
}
