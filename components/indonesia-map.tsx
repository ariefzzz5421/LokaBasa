"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { courses, getCourse } from "@/courses/catalog";
import { useProgress } from "@/lib/store";
import { percentage } from "@/lib/progress";
import geography from "@/data/geography.json";
import { RegionImage } from "./region-image";
const labels: Record<string, [number, number]> = {
  medan: [142, 30],
  batak: [218, 142],
  sunda: [236, 357],
  ngapak: [351, 423],
  jawa: [458, 388],
  manado: [677, 91],
  papua: [907, 180],
};
export function IndonesiaMap({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState("jawa");
  const { progress } = useProgress();
  const course = getCourse(selected);
  const grid = useId();
  const place = geography.points[selected as keyof typeof geography.points];
  return (
    <div className={`map-wrap geographic-map ${compact ? "compact" : ""}`}>
      <div className="map-caption">
        <span>KEPULAUAN INDONESIA</span>
        <span>7 pintu menuju cerita baru</span>
      </div>
      <svg
        viewBox="0 0 1000 470"
        role="group"
        aria-label="Peta Indonesia dengan lokasi perwakilan kursus"
      >
        <defs>
          <pattern
            id={grid}
            width="45"
            height="45"
            patternUnits="userSpaceOnUse"
          >
            <path d="M45 0H0V45" fill="none" stroke="#b3cbc33a" />
          </pattern>
          <linearGradient id={`${grid}-land`} x2="0" y2="1">
            <stop stopColor="#bdd6b4" />
            <stop offset="1" stopColor="#81b79c" />
          </linearGradient>
        </defs>
        <path fill={`url(#${grid})`} d="M0 0H1000V470H0Z" />
        <path
          className="geographic-land"
          d={geography.path}
          fill={`url(#${grid}-land)`}
          stroke="#f9fcf2"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <g className="map-ocean" aria-hidden="true">
          <text x="408" y="168">
            KALIMANTAN
          </text>
          <text x="587" y="321">
            SULAWESI
          </text>
          <text x="789" y="333">
            PAPUA
          </text>
          <text x="89" y="285">
            SAMUDRA HINDIA
          </text>
          <text x="713" y="47">
            SAMUDRA PASIFIK
          </text>
        </g>
        {courses.map((c) => {
          const point = geography.points[c.id as keyof typeof geography.points];
          const [x, y] = point.position;
          const [lx, ly] = labels[c.id];
          const active = c.id === selected;
          return (
            <g key={c.id} className={`geo-marker ${active ? "active" : ""}`}>
              <path
                d={`M${x} ${y}L${lx} ${ly + 16}`}
                className="marker-leader"
              />
              <circle
                cx={x}
                cy={y}
                r={active ? 12 : 8}
                className="marker-halo"
              />
              <circle cx={x} cy={y} r="4" className="marker-dot" />
              <g
                role="button"
                tabIndex={0}
                aria-label={`${c.name}, ${point.place}`}
                aria-pressed={active}
                className="geo-label"
                transform={`translate(${lx},${ly})`}
                onClick={() => setSelected(c.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(c.id);
                  }
                }}
              >
                <rect x="-46" y="-17" width="92" height="34" rx="17" />
                <text textAnchor="middle" y="5">
                  {percentage(progress, c) > 0 ? "✓ " : ""}
                  {c.name}
                </text>
              </g>
            </g>
          );
        })}
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
        <div className="map-photo">
          <RegionImage variant={selected} />
        </div>
        <div>
          <span className="eyebrow">
            {place.place} · {percentage(progress, course)}% SELESAI
          </span>
          <h3>{course.name}</h3>
          <p className="muted">{course.dialect}</p>
          <p>
            “{course.phrases[0].text}” · {course.phrases[0].meaning}
          </p>
          {!compact && <p className="muted">{course.culturalNotes}</p>}
          <Link className="button" href={`/belajar/${course.id}`}>
            Jelajahi {course.name} ↗
          </Link>
        </div>
      </div>
      <p className="map-footnote">
        Penanda menunjukkan lokasi perwakilan, bukan batas penutur bahasa.
        Papua: ragam Melayu Papua; Batak: fokus Toba.{" "}
        <Link href="/kredit">Sumber peta & foto ↗</Link>
      </p>
    </div>
  );
}
