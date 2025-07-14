import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Özəl ikon üçün URL-lər (istəyə görə dəyişə bilərsən)
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // təyyarə ikonu (nümunə)
  iconSize: [32, 32],
  iconAnchor: [16, 32],  // ikonun altında dayanacaq nöqtə
  popupAnchor: [0, -32], // popupların mövqeyi
});

const TravelMap = ({ from, to }) => {
  const fromPos = [from.lat, from.lon];
  const toPos = [to.lat, to.lon];
  const center = [(from.lat + to.lat) / 2, (from.lon + to.lon) / 2];

  return (
    <MapContainer
      center={center}
      zoom={4}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={fromPos} icon={customIcon}>
        <Popup>
          {from.city} ({from.country})
        </Popup>
      </Marker>

      <Marker position={toPos} icon={customIcon}>
        <Popup>
          {to.city} ({to.country})
        </Popup>
      </Marker>

      <Polyline positions={[fromPos, toPos]} color="#4A3AFF" weight={4} />
    </MapContainer>
  );
};

export default TravelMap;
