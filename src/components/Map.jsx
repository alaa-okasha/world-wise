import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return (
    <div className={styles.mapContainer}>
      <h1>map</h1>
      <p>
        Position:{lat},{lng}
      </p>
      <button onClick={() => setSearchParams({ lat: 50, lng: 25 })}>
        change position
      </button>
    </div>
  );
}

export default Map;
