export type TileCoordinate = {
  x: number;
  y: number;
  z: number;
};

export function lonLatToTile(longitude: number, latitude: number, z: number): TileCoordinate {
  const latRad = (latitude * Math.PI) / 180;
  const n = 2 ** z;
  const x = Math.floor(((longitude + 180) / 360) * n);
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );

  return { x, y, z };
}

export function waybackTileUrl(releaseNum: number, tile: TileCoordinate) {
  return `https://wayback.maptiles.arcgis.com/arcgis/rest/services/world_imagery/wmts/1.0.0/default028mm/mapserver/tile/${releaseNum}/${tile.z}/${tile.y}/${tile.x}`;
}
