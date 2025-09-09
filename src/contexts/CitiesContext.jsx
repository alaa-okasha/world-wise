import { createContext, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/created":
      return { ...state, cities: [...state.cities, action.payload] };
    case "cities/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState(() => {
  //   const stored = localStorage.getItem("cities");
  //   return stored ? JSON.parse(stored) : [];
  // });
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("cities");
    if (stored) {
      dispatch({ type: "cities/loaded", payload: JSON.parse(stored) });
    }
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      localStorage.setItem("cities", JSON.stringify(cities));
    }
  }, [cities]);

  function getCity(id) {
    dispatch({ type: "loading" });
    const numericId = Number(id);
    const city = cities.find((city) => city.id === numericId);
    dispatch({ type: "city/loaded", payload: city || {} });
  }
  function createCity(newCity) {
    console.log(newCity);

    dispatch({ type: "cities/created", payload: newCity });
  }
  function deleteCity(id) {
    dispatch({ type: "cities/deleted", payload: id });
    if (currentCity?.id === id) dispatch({ type: "city/loaded", payload: {} });
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
