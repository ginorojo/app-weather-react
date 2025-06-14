import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Body from './components/Body.jsx';
import useWeather from './Hooks/useWeather.jsx';

export default function App() {
  const [selectedCity, setSelectedCity] = useState("La Serena");
  const weatherData = useWeather(selectedCity);

  // Función para obtener ciudad por geolocalización
  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a83e5861802436d8cbe35d5ec980d681&units=metric`
            );
            
            if (!response.ok) throw new Error("Weather fetch failed");
            const data = await response.json();
            setSelectedCity(data.name); // Esto actualizará el clima automáticamente
          } catch (error) {
            console.error("Error fetching weather by location:", error);
          }
        },
        (error) => {
          alert("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      alert("Tu navegador no admite geolocalización.");
    }
  };

  return (
    <div
    style={{ fontFamily: 'Raleway, sans-serif' }} 
    className='flex flex-col md:flex-row'>
      <Header
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        weatherData={weatherData}
        handleGetCurrentLocation={handleGetCurrentLocation} 
      />
      <Body
        selectedCity={selectedCity}
        weatherData={weatherData}
      />
    </div>
  );
}