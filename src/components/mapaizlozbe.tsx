"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Popravka za ikonicu koja nekad nestane u React-u
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapaIzlozbe() {
  const pozicija: [number, number] = [45.2517, 19.8450];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={pozicija} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={pozicija} icon={icon}>
          <Popup>
             <b>Galerija Matice srpske</b> <br /> 
             Sledeća izložba: Portreti (15.03.)
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}