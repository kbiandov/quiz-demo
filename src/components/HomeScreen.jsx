import React from "react";
import SquareButton from "./SquareButton";

export default function HomeScreen({ onGo }){
  const tiles=[{key:"theory",label:"Теория",icon:"📘"},{key:"tests",label:"Тестове",icon:"📝"},{key:"results",label:"Резултати",icon:"✅"},{key:"stats",label:"Статистика",icon:"📊"}];
  return (<div className="mx-auto max-w-4xl p-6"><div className="grid-tiles">{tiles.map(t=>
    (<SquareButton key={t.key} icon={t.icon} label={t.label} onClick={()=>onGo(t.key)} />))}</div></div>);
}