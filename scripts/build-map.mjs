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
const pathData = geoPath(projection).digits(2)(indonesia);
const origins = Object.fromEntries(
  Object.entries(points).map(([id, lonlat]) => [
    id,
    {
      coordinates: lonlat,
      position: projection(lonlat).map((n) => Math.round(n * 100) / 100),
      place: places[id],
    },
  ]),
);
fs.writeFileSync(
  "data/geography.json",
  JSON.stringify(
    {
      source: "Natural Earth, 1:50m via world-atlas 2.0.2",
      url: "https://www.naturalearthdata.com/about/terms-of-use/",
      path: pathData,
      points: origins,
    },
    null,
    2,
  ),
);
fs.writeFileSync("data/course-origins.json", JSON.stringify(origins, null, 2));
fs.mkdirSync("public/maps", { recursive: true });
fs.writeFileSync(
  "public/maps/indonesia-mini.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 470"><path d="${pathData}" fill="#8ebaa2" stroke="#f7fbf4" stroke-width="4" stroke-linejoin="round"/></svg>`,
);
