import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { 
  Cloud, 
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Search,
  Loader2,
  Sunrise,
  Sunset,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function Weather({ language = 'english', t = {} }) {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [farmingAdvice, setFarmingAdvice] = useState(null);

  const getWeather = async (searchLocation) => {
    const loc = searchLocation || location;
    if (!loc.trim()) return;

    setIsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current weather data and 5-day forecast for ${loc}, India. 
        Also provide farming advice based on the weather conditions.
        Include specific recommendations for:
        - Sowing/harvesting timing
        - Irrigation needs
        - Pest/disease risk based on humidity
        - Any weather alerts
        
        Respond in ${language} language.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            current: {
              type: "object",
              properties: {
                temperature: { type: "number" },
                feels_like: { type: "number" },
                humidity: { type: "number" },
                wind_speed: { type: "number" },
                condition: { type: "string" },
                uv_index: { type: "number" }
              }
            },
            forecast: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string" },
                  high: { type: "number" },
                  low: { type: "number" },
                  condition: { type: "string" },
                  rain_chance: { type: "number" }
                }
              }
            },
            farming_advice: {
              type: "object",
              properties: {
                sowing_advice: { type: "string" },
                irrigation_advice: { type: "string" },
                pest_risk: { type: "string" },
                general_tips: { type: "array", items: { type: "string" } },
                alerts: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      });

      setWeatherData(result);
      setFarmingAdvice(result.farming_advice);
    } catch (error) {
      console.error('Weather error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Using reverse geocoding would be ideal, but for now we'll use coordinates
          const loc = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
          setLocation(loc);
          getWeather(loc);
        },
        (error) => console.error('Location error:', error)
      );
    }
  };

  const getWeatherIcon = (condition) => {
    const lowerCondition = condition?.toLowerCase() || '';
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return CloudRain;
    if (lowerCondition.includes('cloud')) return Cloud;
    return Sun;
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Cloud className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.weather || 'Weather Update'}</h1>
          <p className="text-sm text-gray-500">Real-time weather & farming advice</p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && getWeather()}
                placeholder="Enter city, district or village name"
                className="pl-10"
              />
            </div>
            <Button onClick={useCurrentLocation} variant="outline" className="gap-2">
              <MapPin className="w-4 h-4" /> Use GPS
            </Button>
            <Button 
              onClick={() => getWeather()}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Get Weather
            </Button>
          </div>
        </CardContent>
      </Card>

      {weatherData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Current Weather */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <h2 className="text-xl font-semibold">{weatherData.location}</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-6xl font-bold">{weatherData.current?.temperature}°C</p>
                  <p className="text-white/80 mt-2">{weatherData.current?.condition}</p>
                  <p className="text-sm text-white/60">Feels like {weatherData.current?.feels_like}°C</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  {React.createElement(getWeatherIcon(weatherData.current?.condition), { className: "w-16 h-16" })}
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Droplets className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="font-bold text-gray-800">{weatherData.current?.humidity}%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Wind className="w-6 h-6 mx-auto text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500">Wind</p>
                  <p className="font-bold text-gray-800">{weatherData.current?.wind_speed} km/h</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Sun className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                  <p className="text-sm text-gray-500">UV Index</p>
                  <p className="font-bold text-gray-800">{weatherData.current?.uv_index || 'N/A'}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Thermometer className="w-6 h-6 mx-auto text-red-500 mb-2" />
                  <p className="text-sm text-gray-500">Feels Like</p>
                  <p className="font-bold text-gray-800">{weatherData.current?.feels_like}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          {weatherData.forecast && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  5-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-5 gap-3">
                  {weatherData.forecast.slice(0, 5).map((day, i) => {
                    const Icon = getWeatherIcon(day.condition);
                    return (
                      <div key={i} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                        <p className="text-sm font-medium text-gray-600 mb-2">{day.day}</p>
                        <Icon className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                        <p className="text-sm text-gray-500">{day.condition}</p>
                        <div className="mt-2">
                          <span className="text-red-500 font-bold">{day.high}°</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-blue-500">{day.low}°</span>
                        </div>
                        {day.rain_chance > 0 && (
                          <p className="text-xs text-blue-500 mt-1">
                            <Droplets className="w-3 h-3 inline mr-1" />
                            {day.rain_chance}%
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Farming Advice */}
          {farmingAdvice && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Alerts */}
              {farmingAdvice.alerts?.length > 0 && (
                <Card className="md:col-span-2 bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-800 mb-2">Weather Alerts</h4>
                        <ul className="space-y-1">
                          {farmingAdvice.alerts.map((alert, i) => (
                            <li key={i} className="text-sm text-orange-700">{alert}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-orange-500" />
                    Sowing Advice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{farmingAdvice.sowing_advice}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    Irrigation Advice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{farmingAdvice.irrigation_advice}</p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Farming Tips for This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {farmingAdvice.general_tips?.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!weatherData && !isLoading && (
        <Card className="p-12 text-center">
          <Cloud className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Get Weather Updates</h3>
          <p className="text-gray-500 mb-4">Enter your location or use GPS to get real-time weather and farming advice</p>
          <Button onClick={useCurrentLocation} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <MapPin className="w-4 h-4" /> Use My Location
          </Button>
        </Card>
      )}
    </div>
  );
}