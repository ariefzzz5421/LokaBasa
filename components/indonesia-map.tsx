"use client";
import Link from "next/link";
import { useState } from "react";
import { courses, getCourse } from "@/courses/catalog";
import { useProgress } from "@/lib/store";
import { percentage } from "@/lib/progress";
export function IndonesiaMap({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState("jawa");
  const { progress } = useProgress();
  const course = getCourse(selected);
  return (
    <div className={`map-wrap ${compact ? "compact" : ""}`}>
      <svg
        viewBox="0 0 920 420"
        role="img"
        aria-label="Peta ilustratif kepulauan Indonesia. Pilih kursus melalui penanda atau tombol di bawah."
      >
        <defs>
          <pattern
            id="map-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M40 0H0V40" fill="none" stroke="#527e7812" />
          </pattern>
        </defs>
        <path fill="url(#map-grid)" d="M0 0H920V420H0z" />
        <g className="islands" fill="#a7c6ae" stroke="#f8f7ed" strokeWidth="3">
          <path d="M74 50L103 62 132 97 143 128 169 147 187 182 218 208 231 243 213 256 188 231 162 198 148 172 124 154 111 122 89 109 73 76Z" />
          <path d="M240 263L278 267 303 279 347 282 370 292 408 294 443 312 429 324 396 318 366 313 335 312 307 303 275 298 250 282Z" />
          <path d="M337 113L373 92 404 111 435 88 459 120 454 170 429 205 401 224 377 215 351 181 330 166Z" />
          <path d="M507 176L515 145 535 137 550 152 580 128 600 136 572 166 540 168 536 184 564 207 558 224 532 204 520 215 531 250 512 261 500 220 489 235 479 218 498 190Z" />
          <path d="M707 197L735 181 767 203 790 197 804 212 836 223 868 244 872 291 844 278 815 249 799 257 775 237 753 243 735 219 716 223Z" />
          <path d="M454 324l15-6 14 10-16 7Z M488 333l20-5 11 10-24 5Z M523 340l39-3 13 13-43 0Z M562 367l32-10 23 7-36 16Z M606 347l38-9 11 12-25 9Z M620 213l15-11 5 23-10 8Z M647 176l13-10 8 14-8 19Z M664 237l24-5 14 9-22 7Z" />
        </g>
        <text x="317" y="74" className="map-label">
          KALIMANTAN
        </text>
        <text x="468" y="292" className="map-label">
          SULAWESI
        </text>
        <text x="691" y="329" className="map-label">
          PAPUA
        </text>
        <text x="73" y="280" className="map-label">
          SAMUDRA HINDIA
        </text>
        {courses.map((c) => (
          <g
            key={c.id}
            onClick={() => setSelected(c.id)}
            onMouseEnter={() => setSelected(c.id)}
            className={`map-pin ${selected === c.id ? "active" : ""} ${percentage(progress, c) > 0 ? "explored" : ""}`}
            transform={`translate(${c.map.x},${c.map.y})`}
          >
            <circle r="17" className="pin-halo" />
            <circle r="8" />
            <text y={c.id === "ngapak" ? 34 : -25} textAnchor="middle">
              {c.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="map-tabs" aria-label="Pilih wilayah">
        {courses.map((c) => (
          <button
            key={c.id}
            aria-pressed={c.id === selected}
            onClick={() => setSelected(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="map-detail">
        <div>
          <span className="eyebrow">
            DESTINASI PILIHAN · {percentage(progress, course)}% SELESAI
          </span>
          <h3>
            {course.name} <span className="muted">/ {course.dialect}</span>
          </h3>
          <p>
            “{course.phrases[0].text}” · {course.phrases[0].meaning}
          </p>
          {!compact && <p className="muted">{course.culturalNotes}</p>}
        </div>
        <Link className="button" href={`/belajar/${course.id}`}>
          Jelajahi {course.name} <span>↗</span>
        </Link>
      </div>
    </div>
  );
}
