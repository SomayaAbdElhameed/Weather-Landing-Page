import { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Mock weather data
const mockWeatherData = {
  location: 'San Francisco',
  country: 'US',
  temp: 18,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  pressure: 1013,
  forecast: [
    { day: 'Thu', high: 20, low: 15, condition: 'Sunny' },
    { day: 'Fri', high: 19, low: 14, condition: 'Partly Cloudy' },
    { day: 'Sat', high: 17, low: 13, condition: 'Rainy' },
    { day: 'Sun', high: 21, low: 16, condition: 'Sunny' },
    { day: 'Mon', high: 22, low: 17, condition: 'Sunny' },
  ]
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
export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState(mockWeatherData);
  const [forecastView, setForecastView] = useState<'today' | 'weekly'>('weekly');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const API_KEY = "e62a633bad892a30e84cd534383beb3b";

    try {
      // Fetch current weather
      const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery)}&appid=${API_KEY}&units=metric&lang=ar`

      );

      if (!currentResponse.ok) {
        throw new Error('City not found');
      }

      const currentData = await currentResponse.json();

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(searchQuery)}&appid=${API_KEY}&units=metric`
      );

      if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
      }

      const forecastData = await forecastResponse.json();

      // Process forecast data (group by day)
      const dailyForecasts = forecastData.list.reduce((acc: any[], item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!acc.find(d => d.date === date)) {
          acc.push({
            date,
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
            weather: item.weather[0].main
          });
        } else {
          const existing = acc.find(d => d.date === date);
          existing.temp_max = Math.max(existing.temp_max, item.main.temp_max);
          existing.temp_min = Math.min(existing.temp_min, item.main.temp_min);
        }
        return acc;
      }, []).slice(0, 5);

      // Update weather state
      setWeather({
        location: currentData.name,
        country: currentData.sys.country,
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : 10,
        pressure: currentData.main.pressure,
        forecast: dailyForecasts.map((day: any, index: number) => ({
          day: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wen'][new Date(day.date).getDay()],
          high: Math.round(day.temp_max),
          low: Math.round(day.temp_min),
          condition: day.weather
        }))
      });

      console.log('Weather data updated for:', searchQuery);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Error fetching weather data. Please check the city name and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920"
          alt="Weather background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-white mb-2">Weather Forecast</h1>
          <p className="text-blue-100">Get accurate weather information for any location</p>
        </header>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            
          </div>
        </form>

        {/* Current Weather */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-white" />
            <span className="text-white">{weather.location}, {weather.country}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img style={{width:'120px'}}
                src={weatherIcons[weather.condition as keyof typeof weatherIcons] || weatherIcons.Clear}
                alt={weather.condition}
                className="w-24 h-24 mb-4"
              />
              <div className="text-7xl text-white mb-2">{weather.temp}°C</div>
              <div className="text-2xl text-blue-100">{weather.condition}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <WeatherCard
                icon={<Wind className="w-6 h-6" />}
                label="Wind Speed"
                value={`${weather.windSpeed} km/h`}
              />
              <WeatherCard
                icon={<Droplets className="w-6 h-6" />}
                label="Humidity"
                value={`${weather.humidity}%`}
              />
              <WeatherCard
                icon={<Eye className="w-6 h-6" />}
                label="Visibility"
                value={`${weather.visibility} km`}
              />
              <WeatherCard
                icon={<Gauge className="w-6 h-6" />}
                label="Pressure"
                value={`${weather.pressure} mb`}
              />
            </div>
          </div>
        </div>

        {/* Forecast Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setForecastView('today')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              forecastView === 'today'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setForecastView('weekly')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              forecastView === 'weekly'
                ? 'bg-blue-800 text-white shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Weekly
          </button>
        </div>

        {/* Forecast */}
        <div>
          <h2 className="text-white mb-4">
            {forecastView === 'today' ? 'Today\'s Forecast' : '5-Day Forecast'}
          </h2>
          <div className={`grid gap-4 ${forecastView === 'today' ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-2 md:grid-cols-5'}`}>
            {(forecastView === 'today' ? weather.forecast.slice(0, 1) : weather.forecast).map((day, index) => (
              <ForecastCard
                key={index}
                day={day.day}
                high={day.high}
                low={day.low}
                condition={day.condition}
              />
            ))}

          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-white/80">
          <h4>&copy; 2026 Weather Forecast  by  Somaya AbdElhameid</h4>
        </footer>
      </div>
    </div>
  );
}


