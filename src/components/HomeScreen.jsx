import SquareButton from './SquareButton';

export default function HomeScreen({ onGo, profile }){
  // Debug logging
  console.log('HomeScreen render:', { onGo, profile, SquareButton: typeof SquareButton });
  
  const tiles = [
    {key:"theory", label:"Теория", icon:"📘"},
    {key:"tests", label:"Тестове", icon:"📝"},
    {key:"results", label:"Резултати", icon:"✅"},
    {key:"stats", label:"Статистика", icon:"📊"}
  ];
  
  // Ensure onGo is a function
  if (typeof onGo !== 'function') {
    console.error('HomeScreen: onGo prop must be a function');
    return <div>Error: Invalid navigation function</div>;
  }
  
  // Fallback if SquareButton is not available
  if (typeof SquareButton !== 'function') {
    console.error('HomeScreen: SquareButton component is not available, using fallback');
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
            <button 
              key={t.key} 
              onClick={() => onGo(t.key)}
              className="square group flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition w-full"
            >
              <div className="text-3xl mb-2">{t.icon}</div>
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
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