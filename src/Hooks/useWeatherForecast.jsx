import { useState, useEffect } from "react";

export default function useWeatherForecast(city) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const API_KEY = "a83e5861802436d8cbe35d5ec980d681"; 
    const abortController = new AbortController();

    async function getForecast() {
      setLoading(true);
      setError(null);

      try {
        // 1. Obtener coordenadas (igual que en useWeather)
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`,
          { signal: abortController.signal }
        );
        
        const geoData = await geoRes.json();
        if (!geoData?.length) throw new Error("Ciudad no encontrada");

        
        const { lat, lon } = geoData[0];
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`,
          { signal: abortController.signal }
        );

        if (!forecastRes.ok) throw new Error("Error en el pronóstico");
        
        const forecastData = await forecastRes.json();
        
        const dailyForecast = processForecastData(forecastData.list);
        setForecast(dailyForecast.slice(0, 5)); 
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Error fetching forecast:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    getForecast();
    return () => abortController.abort();
  }, [city]);

  return { forecast, loading, error };
}

// Helper para agrupar por día
function processForecastData(list) {
  const daily = {};
  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!daily[date]) {
      daily[date] = {
        dt: item.dt,
        temp: { max: item.main.temp_max, min: item.main.temp_min },
        weather: item.weather
      };
    } else {
      // Actualizar máximos/mínimos
      if (item.main.temp_max > daily[date].temp.max) daily[date].temp.max = item.main.temp_max;
      if (item.main.temp_min < daily[date].temp.min) daily[date].temp.min = item.main.temp_min;
    }
  });
  return Object.values(daily);
}