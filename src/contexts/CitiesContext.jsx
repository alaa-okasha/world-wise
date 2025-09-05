import { createContext, useState, useEffect, useContext } from "react";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState(() => {
    const stored = localStorage.getItem("cities");
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  function getCity(id) {
    setIsLoading(true);
    const numericId = Number(id);
    const city = cities.find((city) => city.id === numericId);
    setCurrentCity(city || {});
    setIsLoading(false);
  }
  function createCity(newCity) {
    console.log(newCity);

    setCities((prev) => [...prev, newCity]);
  }
  function deleteCity(id) {
    setCities((prev) => prev.filter((city) => city.id !== id));
    if (currentCity?.id === id) setCurrentCity({});
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("cities context was used outside of the context provider");

  return context;
}

export { CitiesProvider, useCities };
