import type { Course, Exercise, Phrase } from "@/types";
const sources = {
  jawa: [
    {
      title: "Kamus Bahasa Jawa–Indonesia, Balai Bahasa DIY",
      url: "https://kbji.kemendikdasmen.go.id/terjemahan/list",
    },
  ],
  sunda: [
    {
      title: "Kamus Indonesia–Sunda–Cerbon, Balai Bahasa Jawa Barat",
      url: "https://repositori.kemendikdasmen.go.id/34665/1/Buku-Kamus19-Lengkap_compressed.pdf",
    },
  ],
  batak: [
    {
      title: "Kamus Pelajar Toba, Balai Bahasa Sumatera Utara",
      url: "https://balaibahasasumut.kemendikdasmen.go.id/bahasa/batak-toba/",
    },
  ],
  manado: [
    {
      title: "Kamus Manado–Indonesia",
      url: "https://repositori.kemendikdasmen.go.id/2932/",
    },
  ],
  papua: [
    {
      title: "Peta Bahasa, Badan Bahasa",
      url: "https://petabahasa.kemendikdasmen.go.id/",
    },
  ],
  medan: [
    {
      title: "Balai Bahasa Provinsi Sumatera Utara",
      url: "https://balaibahasasumut.kemendikdasmen.go.id/",
    },
  ],
  ngapak: [
    {
      title: "Peta Bahasa Jawa Tengah, Badan Bahasa",
      url: "https://petabahasa.kemendikdasmen.go.id/bahasasastra/provinsi_bahasa.php?id=14",
    },
  ],
};
// Seed content is editorial demo material, NOT native-speaker verified.
// Sources are review references, not claims of sentence-level verification.
const seeds = [
  {
    id: "jawa",
    name: "Jawa",
    language: "Jawa",
    dialect: "Ngoko · Jawa Tengah",
    region: "Jawa Tengah & Yogyakarta",
    nativeName: "Basa Jawa",
    accent: "jawa",
    tagline: "Dari sapaan, jadi seduluran.",
    map: { x: 355, y: 300 },
    note: "Ngoko untuk teman akrab atau sebaya. Untuk orang yang lebih tua atau belum akrab, pelajari bentuk krama dan ikuti kebiasaan setempat.",
    rows: [
      ["Piye kabare?", "Apa kabar?", "pi-ye ka-ba-re", "Sapaan"],
      ["Sugeng enjing", "Selamat pagi", "su-geng en-jing", "Sapaan"],
      ["Matur nuwun", "Terima kasih", "ma-tur nu-wun", "Sapaan"],
      ["Jenengku Budi", "Namaku Budi", "je-neng-ku bu-di", "Kenalan"],
      ["Aku arep mangan", "Aku mau makan", "a-ku a-rep ma-ngan", "Makan"],
      ["Aku ngombe banyu", "Aku minum air", "a-ku ngom-be ba-nyu", "Makan"],
      ["Pira regane?", "Berapa harganya?", "pi-ra re-ga-ne", "Belanja"],
      [
        "Aku arep menyang pasar",
        "Aku mau ke pasar",
        "a-ku a-rep me-nyang pa-sar",
        "Perjalanan",
      ],
      ["Iki kancaku", "Ini temanku", "i-ki kan-ca-ku", "Teman"],
    ],
  },
  {
    id: "sunda",
    name: "Sunda",
    language: "Sunda",
    dialect: "Priangan · pengantar",
    region: "Jawa Barat",
    nativeName: "Basa Sunda",
    accent: "sunda",
    tagline: "Obrolan hangat di tanah Priangan.",
    map: { x: 297, y: 284 },
    note: "Tingkat tutur bergantung pada lawan bicara. Punten dapat dipakai untuk permisi atau meminta maaf; konteks menentukan maknanya.",
    rows: [
      ["Kumaha damang?", "Apa kabar?", "ku-ma-ha da-mang", "Sapaan"],
      ["Wilujeng enjing", "Selamat pagi", "wi-lu-jeng en-jing", "Sapaan"],
      ["Hatur nuhun", "Terima kasih", "ha-tur nu-hun", "Sapaan"],
      ["Punten", "Permisi", "pun-ten", "Sapaan"],
      [
        "Abdi hoyong tuang",
        "Saya ingin makan",
        "ab-di ho-yong tu-ang",
        "Makan",
      ],
      ["Cai", "Air", "ca-i", "Makan"],
      ["Sabaraha?", "Berapa?", "sa-ba-ra-ha", "Belanja"],
      ["Abdi", "Saya", "ab-di", "Kenalan"],
      ["Réréncangan", "Teman", "ré-rén-ca-ngan", "Teman"],
    ],
  },
  {
    id: "batak",
    name: "Batak",
    language: "Batak Toba",
    dialect: "Toba · pengantar",
    region: "Danau Toba, Sumatera Utara",
    nativeName: "Hata Batak Toba",
    accent: "batak",
    tagline: "Sapaan yang menyatukan.",
    map: { x: 143, y: 122 },
    note: "Kursus ini memperkenalkan Batak Toba. Karo, Simalungun, Pakpak, dan Mandailing memiliki tradisi bahasa sendiri; materi ini tidak mewakili semuanya.",
    rows: [
      ["Horas", "Salam", "ho-ras", "Sapaan"],
      ["Mauliate", "Terima kasih", "ma-u-li-a-te", "Sapaan"],
      ["Ahu", "Saya", "a-hu", "Kenalan"],
      ["Ho", "Kamu", "ho", "Kenalan"],
      ["Mangan", "Makan", "ma-ngan", "Makan"],
      ["Aek", "Air", "a-ek", "Makan"],
      ["Inang", "Ibu", "i-nang", "Keluarga"],
      ["Amang", "Ayah", "a-mang", "Keluarga"],
      ["Dongan", "Teman", "do-ngan", "Teman"],
    ],
  },
  {
    id: "ngapak",
    name: "Ngapak",
    language: "Jawa",
    dialect: "Banyumasan · pengantar",
    region: "Banyumas & sekitarnya",
    nativeName: "Basa Banyumasan",
    accent: "ngapak",
    tagline: "Akrab, apa adanya.",
    map: { x: 322, y: 313 },
    note: "Ngapak adalah sebutan populer untuk ragam tutur, termasuk Banyumasan. Pengucapan dan pilihan kata bervariasi; aja disamaratakan atau dijadikan bahan ejekan.",
    rows: [
      [
        "Kepriwe kabare?",
        "Bagaimana kabarnya?",
        "ke-pri-we ka-ba-re",
        "Sapaan",
      ],
      ["Matur nuwun", "Terima kasih", "ma-tur nu-wun", "Sapaan"],
      ["Inyong", "Saya", "i-nyong", "Kenalan"],
      ["Kowe", "Kamu", "ko-we", "Kenalan"],
      ["Mangan", "Makan", "ma-ngan", "Makan"],
      ["Banyu", "Air", "ba-nyu", "Makan"],
      ["Sega", "Nasi", "se-ga", "Makan"],
      ["Dolan", "Bermain / berkunjung", "do-lan", "Perjalanan"],
      ["Kanca", "Teman", "kan-ca", "Teman"],
    ],
  },
  {
    id: "manado",
    name: "Manado",
    language: "Melayu Manado",
    dialect: "Manado · pengantar",
    region: "Sulawesi Utara",
    nativeName: "Bahasa Melayu Manado",
    accent: "manado",
    tagline: "Baku kenal, baku sayang.",
    map: { x: 571, y: 147 },
    note: "Dalam Melayu Manado, kita berarti saya, bukan kita dalam bahasa Indonesia. Materi ini bukan bahasa Minahasa dan tidak mewakili semua bahasa Sulawesi Utara.",
    rows: [
      ["Kita", "Saya", "ki-ta", "Kenalan"],
      ["Ngana", "Kamu", "nga-na", "Kenalan"],
      ["Torang", "Kita / kami", "to-rang", "Kenalan"],
      ["Makan", "Makan", "ma-kan", "Makan"],
      ["Aer", "Air", "a-er", "Makan"],
      ["Ruma", "Rumah", "ru-ma", "Keluarga"],
      ["Deng", "Dan / dengan", "deng", "Teman"],
      ["Jo", "Saja", "jo", "Slang"],
      ["Nda", "Tidak", "nda", "Slang"],
    ],
  },
  {
    id: "papua",
    name: "Papua",
    language: "Melayu Papua",
    dialect: "Melayu Papua · pengantar",
    region: "Papua · ragam pergaulan",
    nativeName: "Melayu Papua",
    accent: "papua",
    tagline: "Kenali ragam, dekatkan jarak.",
    map: { x: 791, y: 229 },
    note: "Papua memiliki banyak bahasa yang berbeda. Kursus ini hanya pengantar Melayu Papua sebagai bahasa pergaulan, bukan satu bahasa yang mewakili seluruh Papua.",
    rows: [
      ["Sa", "Saya", "sa", "Kenalan"],
      ["Ko", "Kamu", "ko", "Kenalan"],
      ["Tong", "Kita / kami", "tong", "Kenalan"],
      ["Dorang", "Mereka", "do-rang", "Kenalan"],
      ["Tra", "Tidak", "tra", "Slang"],
      ["Su", "Sudah", "su", "Slang"],
      ["Pace", "Sapaan untuk laki-laki dewasa", "pa-ce", "Sapaan"],
      ["Mace", "Sapaan untuk perempuan dewasa", "ma-ce", "Sapaan"],
      ["Baku", "Saling", "ba-ku", "Teman"],
    ],
  },
  {
    id: "medan",
    name: "Medan",
    language: "Indonesia",
    dialect: "Ragam percakapan Medan",
    region: "Medan, Sumatera Utara",
    nativeName: "Bahasa Indonesia ragam Medan",
    accent: "medan",
    tagline: "Cerita baru di sudut kota.",
    map: { x: 162, y: 87 },
    note: "Medan adalah kota multibahasa. Materi ini tentang ragam Indonesia percakapan Medan, bukan satu bahasa etnis. Arti kata seperti kereta bergantung konteks setempat.",
    rows: [
      ["Kek mana?", "Bagaimana?", "kek ma-na", "Sapaan"],
      ["Kawan", "Teman", "ka-wan", "Teman"],
      ["Kali", "Sangat (penegas)", "ka-li", "Slang"],
      ["Kereta", "Sepeda motor (konteks Medan)", "ke-re-ta", "Perjalanan"],
      ["Pajak", "Pasar (konteks Medan)", "pa-jak", "Belanja"],
      ["Cakap", "Bicara", "ca-kap", "Kenalan"],
      ["Awak", "Saya / kita (bergantung konteks)", "a-wak", "Kenalan"],
      ["Cemana?", "Bagaimana?", "ce-ma-na", "Sapaan"],
      ["Kedai", "Warung / toko kecil", "ke-dai", "Belanja"],
    ],
  },
];
export const categories = [
  "Sapaan",
  "Kenalan",
  "Makan",
  "Belanja",
  "Perjalanan",
  "Keluarga",
  "Teman",
  "Romance",
  "Emergency",
  "Slang",
  "Humor",
];
export const courses: Course[] = seeds.map((s) => {
  const phrases: Phrase[] = s.rows.map((r, i) => ({
    id: `${s.id}-p${i}`,
    courseId: s.id,
    text: r[0],
    meaning: r[1],
    pronunciation: r[2],
    category: r[3],
    formality:
      s.id === "sunda" || (s.id === "jawa" && [1, 2].includes(i))
        ? "Sopan"
        : "Percakapan akrab",
    context: s.note,
    verificationStatus: "needs_native_review",
  }));
  const units = [
    "Sapa & kenalan",
    "Cerita sehari-hari",
    "Lebih dekat dengan warga",
  ].map((title, u) => ({
    id: `${s.id}-u${u}`,
    title,
    description: [
      "Mulai dari satu sapaan sederhana.",
      "Bekal kecil untuk percakapan nyata.",
      "Pahami kata, rasa, dan konteksnya.",
    ][u],
    lessons: [0, 1, 2].map((n) => {
      const i = u * 3 + n,
        p = phrases[i],
        others = phrases.filter((q) => q.id !== p.id),
        pair = others[(i + 1) % others.length];
      const choices = [p.meaning, ...others.slice(0, 3).map((q) => q.meaning)]
        .filter((v, j, a) => a.indexOf(v) === j)
        .sort((a, b) => a.localeCompare(b));
      const exercises: Exercise[] = [
        {
          id: `${p.id}-t`,
          phraseId: p.id,
          type: "translation",
          prompt: "Apa arti ungkapan ini?",
          options: choices,
          answer: p.meaning,
          explanation: `“${p.text}” berarti “${p.meaning}”. ${s.note}`,
        },
        {
          id: `${p.id}-l`,
          phraseId: p.id,
          type: "listening",
          prompt: "Dengarkan. Ungkapan mana yang kamu dengar?",
          options: [p.text, ...others.slice(0, 2).map((q) => q.text)].sort(),
          answer: p.text,
          explanation: `Kamu mendengar “${p.text}” — ${p.meaning}.`,
        },
        {
          id: `${p.id}-a`,
          phraseId: p.id,
          type: "arrange",
          prompt: `Susun ungkapan untuk “${p.meaning}”.`,
          words: p.text.split(" ").reverse(),
          answer: p.text,
        },
        {
          id: `${p.id}-m`,
          phraseId: p.id,
          type: "matching",
          pairs: [
            { text: p.text, meaning: p.meaning },
            { text: pair.text, meaning: pair.meaning },
          ],
        },
        {
          id: `${p.id}-s`,
          phraseId: p.id,
          type: "speaking",
          prompt: "Dengar, ucapkan, lalu dengarkan suaramu.",
        },
        {
          id: `${p.id}-c`,
          phraseId: p.id,
          type:
            i % 3 === 0
              ? "culture"
              : i % 3 === 1
                ? "quick-response"
                : "conversation",
          prompt:
            i % 3 === 0
              ? "Apa kebiasaan belajar yang tepat untuk ungkapan ini?"
              : `Kamu ingin menyampaikan “${p.meaning}”. Pilih ungkapannya.`,
          options:
            i % 3 === 0
              ? [
                  "Sesuaikan dengan lawan bicara dan konteks",
                  "Pakai untuk semua orang tanpa melihat konteks",
                  "Anggap semua daerah memakai ragam yang sama",
                ]
              : [p.text, pair.text],
          answer:
            i % 3 === 0 ? "Sesuaikan dengan lawan bicara dan konteks" : p.text,
          explanation: s.note,
        },
      ];
      return {
        id: `${s.id}-l${i}`,
        title: [
          "Sapaan pertama",
          "Kata yang menghangatkan",
          "Kenalan, yuk",
          "Mulai bercerita",
          "Di meja makan",
          "Dengar & pahami",
          "Kata di sekitar kita",
          "Bicara lebih dekat",
          "Tantangan perjalanan",
        ][i],
        kind: (
          [
            "lesson",
            "vocabulary",
            "checkpoint",
            "conversation",
            "speaking",
            "listening",
            "culture",
            "lesson",
            "boss",
          ] as const
        )[i],
        phraseIds: [p.id, pair.id],
        exercises,
      };
    }),
  }));
  return {
    ...s,
    writingConventions:
      "Aksara Latin; ejaan dan tanda diakritik mengikuti materi perintis. Variasi lokal perlu ditinjau.",
    pronunciationRules:
      "Panduan suku kata adalah pendekatan tertulis, bukan IPA. Suara sintetis bukan rujukan aksen daerah.",
    culturalNotes: s.note,
    verificationStatus: "needs_native_review",
    sources: sources[s.id as keyof typeof sources],
    units,
    phrases,
  };
});
export const getCourse = (id: string) =>
  courses.find((c) => c.id === id) || courses[0];
export const allPhrases = courses.flatMap((c) => c.phrases);
export const lessonsOf = (c: Course) => c.units.flatMap((u) => u.lessons);
