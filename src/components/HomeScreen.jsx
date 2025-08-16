import SquareButton from './SquareButton';

export default function HomeScreen({ onGo, profile }){
  const tiles = [
    {key:"theory", label:"Теория", icon:"📘"},
    {key:"tests", label:"Тестове", icon:"📝"},
    {key:"results", label:"Резултати", icon:"✅"},
    {key:"stats", label:"Статистика", icon:"📊"}
  ];
  
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="user-info mb-4">
        <span>
          Здравей, {profile ? (profile.name || "Гост") : "Гост"} · 
          {profile?.classId ? `Клас: ${profile.classId}` : "Без клас"}
        </span>
      </div>
      <div className="grid-tiles">
        {tiles.map(t => (
          <SquareButton 
            key={t.key} 
            icon={t.icon} 
            label={t.label} 
            onClick={() => onGo(t.key)} 
          />
        ))}
      </div>
    </div>
  );
}