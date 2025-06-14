import { useState, useEffect } from "react";

export default function useWeather(selectedCity) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (!selectedCity) return;
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(selectedCity)}&appid=a83e5861802436d8cbe35d5ec980d681&units=metric`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setWeatherData(data);
        console.log("Weather data fetched:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedCity]);

  return weatherData;
}


