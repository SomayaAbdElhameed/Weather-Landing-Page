interface WeatherCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function WeatherCard({ icon, label, value }: WeatherCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <div className="text-white/80 mb-2">{icon}</div>
      <div className="text-sm text-blue-100 mb-1">{label}</div>
      <div className="text-white">{value}</div>
    </div>
  );
}
