import { useId } from "react";
export function Mascot({
  mood = "happy",
  className = "",
}: {
  mood?: "happy" | "thinking" | "celebrate";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 180 190"
      className={`mascot ${className} ${mood}`}
      role="img"
      aria-label={`Komo, komodo teman belajar ${mood === "thinking" ? "sedang berpikir" : "ceria"}`}
    >
      <ellipse cx="93" cy="173" rx="58" ry="9" fill="#204b4920" />
      <path d="M115 148Q179 165 155 102Q157 149 124 127" fill="#21897c" />
      <path
        d="M57 116L39 105 46 91 68 100M115 113L145 85 156 96 134 130"
        stroke="#238f80"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M61 144L58 171M111 145L118 171"
        stroke="#207c72"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M44 51Q31 20 66 22L116 29Q145 34 137 79L122 104Q140 154 102 162L70 158Q40 153 51 104Q27 85 44 51"
        fill="#43aa92"
      />
      <path d="M53 38L60 22 73 28 83 15 99 29 113 22 123 36" fill="#207c72" />
      <ellipse cx="87" cy="125" rx="27" ry="31" fill="#c8dfa0" />
      <path d="M45 74Q81 88 130 65L129 93Q87 113 47 94" fill="#badea1" />
      <ellipse cx="68" cy="61" rx="12" ry="16" fill="#fffaf0" />
      <ellipse cx="108" cy="58" rx="12" ry="16" fill="#fffaf0" />
      <ellipse cx="72" cy="63" rx="5" ry="8" fill="#163f3e" />
      <ellipse cx="112" cy="60" rx="5" ry="8" fill="#163f3e" />
      <path
        d="M79 89Q94 100 111 84"
        fill="none"
        stroke="#234d43"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="53" cy="83" r="7" fill="#edaa85" />
      <path d="M54 104L116 100 108 118 69 115" fill="#f6bb49" />
      <path d="M100 114L120 131 105 134 95 117" fill="#e2a230" />
      <circle cx="119" cy="80" r="2" fill="#306b53" />
    </svg>
  );
}
export function Landscape({
  variant = "jawa",
  className = "",
}: {
  variant?: string;
  className?: string;
}) {
  const id = useId().replaceAll(":", "");
  const coastal = ["papua", "manado", "batak"].includes(variant);
  return (
    <svg
      viewBox="0 0 600 300"
      preserveAspectRatio="xMidYMid slice"
      className={`landscape ${className}`}
      role="img"
      aria-label={
        variant === "medan"
          ? "Ilustrasi suasana kota Medan"
          : coastal
            ? "Ilustrasi danau dan perbukitan Indonesia"
            : "Ilustrasi pegunungan, sawah, dan rumah di Jawa"
      }
    >
      <defs>
        <linearGradient id={id} x2="0" y2="1">
          <stop stopColor="#dbece4" />
          <stop offset="1" stopColor="#f6edca" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M0 0H600V300H0z" />
      <circle cx="465" cy="65" r="31" fill="#f7ca69" />
      <g fill="#fffaf0" opacity=".75">
        <path d="M56 66q0-17 21-15 13-25 35-3 30-2 28 18Z" />
        <path d="M358 44q0-10 16-9 14-18 29-2 18-2 23 12Z" />
      </g>
      <path
        d="M0 194L101 80 161 146 242 42 366 178 428 117 600 204V300H0"
        fill="#9ec2aa"
      />
      <path d="M170 146L242 42 339 149 275 113 241 89 211 133" fill="#c7d8ba" />
      <path d="M0 211Q135 141 243 186T600 182V300H0" fill="#629d7d" />
      <path
        d="M0 235Q164 167 340 226T600 214V300H0"
        fill={coastal ? "#75b6b0" : "#bdd09b"}
      />
      <path
        d="M0 274Q212 192 394 258T600 247V300H0"
        fill={coastal ? "#acd0c1" : "#e2dda9"}
      />
      {!coastal && variant !== "medan" && (
        <>
          <g stroke="#93b18a" strokeWidth="3" fill="none">
            <path d="M0 272Q170 198 304 240M0 287Q175 214 356 268M40 300Q216 231 421 300" />
          </g>
          <path d="M355 197H452V253H355" fill="#ecce98" />
          <path d="M334 201L386 163 414 167 468 201Z" fill="#ac7051" />
          <path
            d="M367 206V246M384 206V250M435 206V249"
            stroke="#835c40"
            strokeWidth="4"
          />
          <path d="M398 222H418V253H398" fill="#715b44" />
        </>
      )}
      {variant === "medan" && (
        <g>
          <path
            d="M270 183h55v94h-55zM339 163h47v114h-47zM395 205h68v72h-68z"
            fill="#e6c591"
          />
          <path d="M265 183l34-19 34 19M331 162l31-23 31 23" fill="#af7452" />
          <path
            d="M280 201h12v18h-12zM303 201h12v18h-12zM350 183h12v18h-12zM370 183h9v18h-9zM408 220h35v15h-35z"
            fill="#56816c"
          />
          <path
            d="M299 249h12v28h-12zM357 240h13v37h-13zM421 247h14v30h-14z"
            fill="#735d42"
          />
        </g>
      )}
      {variant === "batak" && (
        <g>
          <path d="M280 252h100l-20 13h-58z" fill="#815d41" />
          <path d="M325 213v39h42z" fill="#faf2d0" />
        </g>
      )}
      {variant === "sunda" && (
        <g fill="none" stroke="#629d7d" strokeWidth="4">
          <path d="M67 231q83-37 161-9M91 247q83-37 161-9M119 263q83-37 161-9" />
        </g>
      )}
      <g fill="#336e59">
        <path d="M43 250Q8 200 39 169Q50 147 62 181Q87 211 61 236V275H45Z" />
        <path d="M516 270Q487 220 519 190Q535 169 546 208Q570 241 540 263V293H521Z" />
      </g>
      <g fill="#f3f4d2" opacity=".8">
        <path d="M270 92q8-8 16 0 8-8 16 0-16-5-16 4-4-8-16-4" />
        <path d="M308 77q6-7 12 0 6-7 12 0-12-3-12 3-4-6-12-3" />
      </g>
    </svg>
  );
}
