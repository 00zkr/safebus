import { MapPin } from 'lucide-react';

const TILE_SIZE = 256;
const ZOOM = 12;

function lonToTileX(lng, zoom) {
  return Math.floor(((lng + 180) / 360) * 2 ** zoom);
}

function latToTileY(lat, zoom) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom);
}

export default function BusMap({ buses = [] }) {
  const locatedBuses = buses
    .map((bus) => ({ ...bus, lat: Number(bus.current_lat), lng: Number(bus.current_lng) }))
    .filter((bus) => Number.isFinite(bus.lat) && Number.isFinite(bus.lng));

  if (locatedBuses.length === 0) {
    return (
      <section className="map-panel empty-map">
        <MapPin size={22} />
        <span>No bus locations available yet.</span>
      </section>
    );
  }

  const centerLat = locatedBuses.reduce((sum, bus) => sum + bus.lat, 0) / locatedBuses.length;
  const centerLng = locatedBuses.reduce((sum, bus) => sum + bus.lng, 0) / locatedBuses.length;
  const centerTileX = lonToTileX(centerLng, ZOOM);
  const centerTileY = latToTileY(centerLat, ZOOM);
  const tiles = [];

  for (let y = -1; y <= 1; y += 1) {
    for (let x = -1; x <= 1; x += 1) {
      tiles.push({
        x,
        y,
        src: `https://tile.openstreetmap.org/${ZOOM}/${centerTileX + x}/${centerTileY + y}.png`
      });
    }
  }

  const centerWorldX = ((centerLng + 180) / 360) * 2 ** ZOOM * TILE_SIZE;
  const centerLatRad = (centerLat * Math.PI) / 180;
  const centerWorldY =
    ((1 - Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) / Math.PI) / 2) *
    2 ** ZOOM *
    TILE_SIZE;

  function markerStyle(bus) {
    const worldX = ((bus.lng + 180) / 360) * 2 ** ZOOM * TILE_SIZE;
    const latRad = (bus.lat * Math.PI) / 180;
    const worldY =
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 2 ** ZOOM * TILE_SIZE;

    return {
      left: `${450 + (worldX - centerWorldX)}px`,
      top: `${300 + (worldY - centerWorldY)}px`
    };
  }

  return (
    <section className="map-panel">
      <div className="section-title">
        <h2>Live Bus Map</h2>
        <span>{locatedBuses.length} bus markers</span>
      </div>
      <div className="tile-map" role="img" aria-label="Live bus locations on OpenStreetMap tiles">
        <div className="tile-grid">
          {tiles.map((tile) => (
            <img
              key={`${tile.x}-${tile.y}`}
              alt=""
              src={tile.src}
              style={{
                left: `${(tile.x + 1) * TILE_SIZE + 66}px`,
                top: `${(tile.y + 1) * TILE_SIZE - 84}px`
              }}
            />
          ))}
        </div>
        {locatedBuses.map((bus) => (
          <div key={bus.id} className={`map-marker marker-${bus.status}`} style={markerStyle(bus)} title={bus.name}>
            <MapPin size={26} />
            <span>{bus.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
