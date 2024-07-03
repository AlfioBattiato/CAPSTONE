import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CustomMap = ({ travel }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    console.log("Travel data in CustomMap:", travel);

    const startMarker = L.marker([travel.lat, travel.lon], {
      icon: L.icon({
        iconUrl: "/assets/maps/ico22.png",
        iconSize: [40, 40],
      }),
    }).addTo(map);

    if (travel.metas && Array.isArray(travel.metas)) {
      travel.metas.forEach((meta, index) => {
        const iconUrl = index === travel.metas.length - 1 ? "/assets/maps/blue.png" : "/assets/maps/ico20.png";
        L.marker([meta.lat, meta.lon], {
          icon: L.icon({
            iconUrl,
            iconSize: [40, 40],
          }),
        }).addTo(map);
      });

      const route = [[travel.lat, travel.lon], ...travel.metas.map((meta) => [meta.lat, meta.lon])];
      L.polyline(route, { color: "blue" }).addTo(map);

      map.fitBounds(route);
    }
  }, [map, travel]);

  return null;
};

const MapImage = ({ travel }) => {
  console.log("Travel data in MapImage:", travel);

  return (
    <MapContainer
      center={[travel.lat, travel.lon]}
      zoom={5}
      style={{ height: "200px", width: "100%" }}
      scrollWheelZoom={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CustomMap travel={travel} />
    </MapContainer>
  );
};

export default MapImage;
