import React, { useState } from "react";
import useWeather from "../Hooks/useWeather";
import useWeatherForecast from "../Hooks/useWeatherForecast";

export default function Body({ selectedCity }) {
  const weatherData = useWeather(selectedCity);
  const { forecast, loading, error } = useWeatherForecast(selectedCity);
  const [tempUnit, setTempUnit] = useState("celsius");
  const [windUnit, setWindUnit] = useState("m/s");
  const [visibiliti, setVisibiliti] = useState("km");

    function formatDate(dt) {
    const date = new Date(dt * 1000);
    const day= date.toLocaleDateString("en-En", { day:"numeric"})
    const month= date.toLocaleDateString("en-En", { month:"short"})
    const weekday= date.toLocaleDateString("en-En", { weekday:"short"})
    
    return ` ${weekday} ${day} ${month}` 
  }

  const displayTemp = (temp) => {
    const value = tempUnit === "celsius"
      ? Math.round (temp)
      : Math.round((temp * 9) / 5 + 32);

      const symbol = tempUnit === "celsius" ? "°C" : "°F";
      return `${value} ${symbol}` 
  };

  function displayWind(speed) {
    if (!speed) return "--";

    switch (windUnit) {
      case "km/h":
        return (speed * 3.6).toFixed(1);
      case "mph":
        return (speed * 2.23694).toFixed(1);
      default:
        return speed.toFixed(1); // m/s por defecto
    }
  }
  function displayvisibility(visibility) {
    if (!visibility) return "--";

    switch (visibiliti) {
      case "km":
        return visibility.toFixed(1);
      case "miles":
        return (visibility * 0.6).toFixed(1);
      default:
        return visibility.toFixed(1);
    }
  }

  if (error) {
    return (
      <div className="pb-5 pt-8 bg-[#100e1d] flex flex-col justify-center items-center md:w-full md:px-[60px]">
        <p className="text-white">
          Error loading weather data: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <aside className="pb-5 pt-8 bg-[#100e1d] flex flex-col justify-center items-center md:w-full md:px-[60px]">
        {/* Temperature Unit Toggle */}
        <div className="w-64 flex justify-end items-center gap-2 mb-4 md:justify-end md:w-[500px] lg:w-[700px]">
          <button
            onClick={() => {
              setTempUnit("celsius");
              setWindUnit("ms");
              setVisibiliti("km");
            }}
            className={`cursor-pointer rounded-full w-12 h-12 font-bold text-2xl flex justify-center items-center ${
              tempUnit === "celsius" ? "bg-white" : "bg-[#585676] text-white"
            }`}
            aria-label="Mostrar temperatura en Celsius"
          >
            °C
          </button>
          <button
            onClick={() => {
              setTempUnit("fahrenheit");
              setWindUnit("mph");
              setVisibiliti("miles");
            }}
            className={`cursor-pointer rounded-full w-12 h-12 text-2xl flex justify-center items-center font-semibold ${
              tempUnit === "fahrenheit"
                ? "bg-white text-black"
                : "bg-[#585676] text-white"
            }`}
            aria-label="Mostrar temperatura en Fahrenheit"
          >
            °F
          </button>
        </div>
        {/* Forecast Section */}
        <div className="grid grid-cols-2 gap-6 md:flex flex-wrap">
          {loading ? (
            <p className="text-white col-span-2 text-center">
              Loading forecast...
            </p>
          ) : forecast && forecast.length > 0 ? (
            forecast.map((day, index) => (
              <div
                key={day.dt}
                className="flex flex-col justify-between items-center bg-[#1e213a] w-[7.5rem] h-40 p-1.5"
              >
                <h3 className="text-white mb-2 font-semibold">
                  {index === 0 ? "Tomorrow" : formatDate(day.dt)}
                </h3>
                {day.weather?.[0]?.icon && (
                  <img
                    className="w-15"
                    src={`/weather/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description || "Weather condition"}
                  />
                )}
                <div className="flex gap-2">
                  <span className="text-white font-semibold">
                    {displayTemp(day.temp.max)}
                  </span>
                  <span className="text-white">
                    {displayTemp(day.temp.min)}°
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No forecast data available</p>
          )}
        </div>

        <h2 className="h-7 text-[#E7E7EB] text-2xl font-bold my-5 md:w-full md:max-w-2xl md:flex md:justify-start">
          Today's Highlights
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-2.5">
          {/* Wind Status */}
          <div className="w-[328px] h-48 bg-[#1E213A] flex flex-col items-center justify-center">
            <h3 className="text-base text-center text-[#E7E7EB]">
              Wind status
            </h3>
            <div className="flex">
              <h3 className="text-[#E7E7EB] text-6xl font-bold">
                {weatherData?.wind?.speed
                  ? displayWind(weatherData.wind.speed)
                  : "--"}
              </h3>
              <h4 className="text-[#E7E7EB] text-4xl mb-2 ml-1">{windUnit}</h4>
            </div>
            <div className="flex items-center gap-2 text-white pt-3  ">
              {weatherData?.wind?.deg !== undefined ? (
                <img
                  src="/public/navigation.svg"
                  alt="wind direction"
                  style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
                  className=" bg-gray-600  rounded-full w-9 p-2"
                />
                
              ) : (
                <p className="text-white">No wind data</p>
              )}
              <p>SE</p>
            </div>
          </div>

          {/* Humidity */}
          <div className="w-[328px] h-48 bg-[#1E213A] flex flex-col items-center justify-center">
            <h3 className="text-base text-center text-[#E7E7EB]">Humidity</h3>
            <div className="flex flex-col gap-1.5 justify-center items-center">
              <div className="flex items-center gap-1">
                <h3 className="text-[#E7E7EB] text-6xl font-bold">
                  {weatherData?.main?.humidity ?? "--"}
                </h3>
                <h4 className="text-[#E7E7EB] text-4xl mb-2 ml-1">%</h4>
              </div>
              <div className="w-[100%] font-bold text-xs flex justify-between text-[#A09FB1]">
                <p>0</p>
                <p>50</p>
                <p>100</p>
              </div>
              <div className="flex items-center w-full h-2 bg-[#E7E7EB] rounded-3xl mt-2">
                <div
                  className="h-2 bg-[#FFEC65] rounded-3xl transition-all duration-500"
                  style={{ width: `${weatherData?.main?.humidity ?? 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="w-full max-w-[328px] h-[180px] bg-[#1E213A] flex flex-col items-center justify-center py-4">
            <h3 className="text-base text-center text-[#E7E7EB]">Visibility</h3>
            <div className="flex">
              <h3 className="text-[#E7E7EB] text-6xl font-bold">
                {weatherData?.visibility
                  ? displayvisibility(weatherData.visibility / 1000)
                  : "--"}
              </h3>
              <h4 className="text-[#E7E7EB] text-4xl mb-2 ml-1">
                {visibiliti}
              </h4>
            </div>
          </div>

          {/* Air Pressure */}
          <div className="w-full max-w-[328px] h-[180px] bg-[#1E213A] flex flex-col items-center justify-center p-4">
            <h3 className="text-base text-center text-[#E7E7EB]">
              Air Pressure
            </h3>
            <div className="flex">
              <h3 className="text-[#E7E7EB] text-6xl font-bold">
                {weatherData?.main?.pressure ?? "--"}
              </h3>
              <h4 className="text-[#E7E7EB] text-4xl mb-2 ml-1">mb</h4>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
