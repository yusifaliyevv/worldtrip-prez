import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const SmallMap = ({ from, to }) => {
  if (!from || !to) return null;

  const fromPos = [from.lat, from.lon];
  const toPos = [to.lat, to.lon];

  const center = [(fromPos[0] + toPos[0]) / 2, (fromPos[1] + toPos[1]) / 2];

  return (
    <MapContainer
      center={center}
      zoom={2}
      style={{ height: "160px", width: "220px", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={fromPos} icon={icon} />
      <Marker position={toPos} icon={icon} />
      <Polyline positions={[fromPos, toPos]} color="#4A3AFF" />
    </MapContainer>
  );
};

export default SmallMap;
