import fs from "node:fs";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
const world = JSON.parse(
  fs.readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"),
);
const indonesia = feature(world, world.objects.countries).features.find(
  (f) => f.id === "360",
);
const projection = geoMercator().fitExtent(
  [
    [30, 45],
    [970, 410],
  ],
  indonesia,
);
const points = {
  jawa: [110.37, -7.8],
  sunda: [107.61, -6.91],
  batak: [98.85, 2.62],
  ngapak: [109.24, -7.42],
  manado: [124.84, 1.47],
  papua: [140.72, -2.53],
  medan: [98.67, 3.59],
};
const places = {
  jawa: "Yogyakarta",
  sunda: "Bandung · Priangan",
  batak: "Danau Toba",
  ngapak: "Purwokerto · Banyumas",
  manado: "Manado",
  papua: "Jayapura",
  medan: "Kota Medan",
};
fs.writeFileSync(
  "data/geography.json",
  JSON.stringify({
    source: "Natural Earth, 1:50m via world-atlas 2.0.2",
    url: "https://www.naturalearthdata.com/about/terms-of-use/",
    path: geoPath(projection).digits(2)(indonesia),
    points: Object.fromEntries(
      Object.entries(points).map(([id, lonlat]) => [
        id,
        {
          coordinates: lonlat,
          position: projection(lonlat).map((n) => Math.round(n * 100) / 100),
          place: places[id],
        },
      ]),
    ),
  }),
);
