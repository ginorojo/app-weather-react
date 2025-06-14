import React, { useState } from "react";
import cities from "/public/cities.json";

export default function Header({
  selectedCity,
  setSelectedCity,
  weatherData,
  handleGetCurrentLocation,
}) {
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
    setShowSuggestions(false);
  };

  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    if (searchText.trim() === "") return;
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleCityClick = (city) => {
    setSelectedCity(city.name);
    setShowModal(false);
    setShowSuggestions(false);
    setSearchText("");
  };

  return (
    <div className="bg-[#1e213a]">
      <aside className="md:w-[400px] relative">
        <div className="pt-5 flex  justify-around items-end">
          <button
            className="bg-[#6e707a] w-[200px] h-[40px] cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <p className="text-white">Search for places</p>
          </button>
          <button
            className="cursor-pointer flex justify-center items-center bg-[#6e707a] w-10 h-10 rounded-full"
            onClick={handleGetCurrentLocation}
          >
            <img
              className="relative w-7 bg-[#6e707a] rounded-full "
              src="/public/location.svg"
              alt=""
            />
          </button>
        </div>
        {showModal && (
          <div className="absolute inset-0 bg-[#1e213a]  z-50">
            <button>
              <img
                className="absolute top-3 right-5 w-7 cursor-pointer hover:w-8"
                src="/public/close.svg"
                alt="Close"
                onClick={() => setShowModal(false)}
              />
            </button>
            <div className="flex justify-around items-center pt-6  ">
              <div className="flex justify-center items-center border-2 border-gray-400 w-50 gap-0.5 pl-4  ">
                <img className="w-5 " src="search.svg" alt="" />
                <input
                  className="border-none focus:outline-none  h-10 placeholder: text-white"
                  type="text"
                  name="search"
                  placeholder="Search location"
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
              </div>
              <button
                className="cursor-pointer bg-blue-600 text-white rounded h-10 w-25"
                onClick={handleSearchButtonClick}
              >
                Search
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className=" bg-[#1e213a]">
                <ul className="max-h-40 overflow-y-auto pl-5 pt-2.5 ">
                  {suggestions.map((city, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-700 cursor-pointer text-white"
                      onClick={() => handleCityClick(city)}
                    >
                      {city.name}, {city.country_code}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="md:w-[400px] bg-[#1e213a] w-full h-[250px] relative flex flex-col justify-center items-center ">
          <img
            className="md:w-[400px] bg-[#1e213a] w-full h-[250px] opacity-10 "
            src="/public/others/Cloud-background.png"
            alt=""
          />
          <div className=" flex  justify-center absolute items-center w-2/5 ">
            {weatherData && weatherData.weather && (
              <img
                src={`/weather/${weatherData.weather[0].icon}.png`}
                alt={weatherData.weather[0].description}
              />
            )}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <h2 className="font-medium text-9xl text-[#E7E7EB] my-8">
            {weatherData ? Math.round(weatherData.main.temp) : "--"}
          </h2>
          <h3 className=" mt-6 text-6xl text-[#A09FB1] font-medium">°C</h3>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className=" capitalize pt-6 pb-12 text-3xl text-[#A09FB1] font-semibold">
            {weatherData ? weatherData.weather[0].description : "--"}
          </h2>
          <div className="flex justify-center items-center gap-5">
            <p className=" text-sm text-[#88869D] font-medium mb-6">Today</p>
            <p className=" text-sm text-[#88869D] font-medium mb-6">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          <div className=" text-[#88869D] text-sm flex justify-center items-center gap-2 mb-6">
            <img className="w-5" src="location_on.svg" alt="" />
            <p>{selectedCity}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
