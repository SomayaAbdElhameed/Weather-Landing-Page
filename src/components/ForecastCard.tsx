
interface ForecastCardProps {
  day: string;
  high: number;
  low: number;
  condition: string;
}



const settings = {
dots: false,
infinite: false,
slidesToShow: 4,
slidesToScroll: 1,
arrows: true,
responsive: [
{ breakpoint: 1024, settings: { slidesToShow: 2 } },
{ breakpoint: 768, settings: { slidesToShow: 1 } },
],
};

const weatherIcons = {
  Clear: "https://www.gstatic.com/weather/conditions/v1/svg/cloudy_light.svg",
  Clouds: "https://www.gstatic.com/weather/conditions/v1/svg/mostly_cloudy_day_light.svg",
  Sunny: "https://www.gstatic.com/weather/conditions/v1/svg/sunny_light.svg",
  Rain: "https://www.gstatic.com/weather/conditions/v1/svg/rain_showers_light.svg",
  LightRain:"https://www.gstatic.com/weather/conditions/v1/svg/drizzle_light.svg",
  Thunderstorm: "/icons/thunder.svg",
  Fog:"https://wecast.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcold.978fdde0.png&w=256&q=75",
 Haze:"https://www.gstatic.com/weather/conditions/v1/svg/mostly_clear_night_light.svg",
};

export function ForecastCard({ day, high, low, condition }: ForecastCardProps) {
  const getWeatherIcon = () => {
    const iconSrc = weatherIcons[condition as keyof typeof weatherIcons] || weatherIcons.Clear;
    return <img src={iconSrc} alt={condition} className="w-12 h-12" />;
  };

  return (


 
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
      <div className="text-white mb-3">{day}</div>
      <div className="text-white mb-4 flex justify-center">{getWeatherIcon()}</div>
      <div className="text-blue-100 text-sm mb-2">{condition}</div>
      <div className="text-white mb-1">{high}°</div>
      <div className="text-blue-200 text-sm">{low}°</div>
    </div>


  );
}
