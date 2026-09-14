import fs from "node:fs";
import sharp from "sharp";
const entries = {
  sunda: ["Kebun teh bandung.jpg", "Kebun teh di kawasan Bandung"],
  batak: ["The Supervolcano of Lake Toba.jpg", "Danau Toba, Sumatera Utara"],
  ngapak: [
    "Baturraden overview from ridge, Purwokerto, 2015-03-23.jpg",
    "Baturraden, Banyumas",
  ],
  jawa: ["Tugu Jogja Landmark Kota Jogja.jpg", "Tugu Yogyakarta"],
  manado: [
    "Manado Bay and Bunaken Island.JPG",
    "Teluk Manado dan Pulau Bunaken",
  ],
  papua: ["Kota Jayapura, Papua.jpg", "Kota Jayapura, Papua"],
  medan: ["Istana Maimun, Medan.jpg", "Istana Maimun, Medan"],
};
const url =
  "https://commons.wikimedia.org/w/api.php?" +
  new URLSearchParams({
    action: "query",
    format: "json",
    titles: Object.values(entries)
      .map((e) => "File:" + e[0])
      .join("|"),
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "960",
  });
const data = await (await fetch(url)).json();
fs.mkdirSync("public/regions", { recursive: true });
const clean = (s) =>
  (s || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .trim();
const result = {};
for (const [id, [title, alt]] of Object.entries(entries)) {
  const page = Object.values(data.query.pages).find(
    (p) => p.title === "File:" + title,
  );
  if (!page?.imageinfo) throw new Error(title);
  const info = page.imageinfo[0],
    m = info.extmetadata;
  if (!/CC|Public domain/.test(m.LicenseShortName?.value || ""))
    throw new Error("License " + title);
  const response = await fetch(info.thumburl || info.url);
  if (!response.ok) throw new Error(response.status + " " + title);
  await sharp(Buffer.from(await response.arrayBuffer()))
    .rotate()
    .resize(960, 540, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile("public/regions/" + id + ".webp");
  result[id] = {
    src: "/regions/" + id + ".webp",
    alt,
    author: clean(m.Artist?.value),
    license: clean(m.LicenseShortName?.value),
    licenseUrl:
      m.LicenseUrl?.value ||
      "https://creativecommons.org/publicdomain/mark/1.0/",
    source: info.descriptionurl,
    changes: "Dipotong 16:9, ukuran disesuaikan, dikonversi ke WebP.",
  };
  console.log(id, result[id].license, result[id].author);
}
fs.writeFileSync("data/region-media.json", JSON.stringify(result, null, 2));
