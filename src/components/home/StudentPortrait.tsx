import React from 'react';
import { cn } from '../../lib/utils';

/**
 * The three students in the hero.
 *
 * These are flat illustrations, not photographs — deliberately. Drop a real
 * photo in by passing `photo`; the frame, mask and overflow behaviour are
 * identical either way, so swapping is a one-prop change:
 *
 *   import amira from '@/assets/students/amira.png';
 *   <StudentPortrait variant="hijab" photo={amira} … />
 *
 * A photo should be a cut-out PNG (transparent background) shot roughly
 * waist-up, so the subject breaks past the top of the frame the same way the
 * illustrations do.
 */

export type StudentVariant = 'short-hair' | 'hijab' | 'curls';

export interface StudentPortraitProps {
  /**
   * Declared explicitly because this project has no `@types/react` installed,
   * so JSX does not contribute React's own `key` attribute. `Card` carries the
   * same workaround.
   */
  key?: string | number;
  variant: StudentVariant;
  /** Frame colour — one of the brand accents. */
  panel: string;
  /** Optional cut-out photograph replacing the illustration. */
  photo?: string;
  alt: string;
  className?: string;
}

interface Palette {
  skin: string;
  skinShadow: string;
  hair: string;
  hairDark: string;
  top: string;
  topDark: string;
  accessory: string;
}

/**
 * Each student gets their own palette. Kept as data rather than baked into the
 * paths so tone and clothing can be adjusted without touching the drawing.
 */
const PALETTES: Record<StudentVariant, Palette> = {
  'short-hair': {
    skin: '#c98c5e',
    skinShadow: '#b0764c',
    hair: '#2a1c14',
    hairDark: '#1a110c',
    top: '#e8f0f7',
    topDark: '#cfdeeb',
    accessory: '#2ba0ff',
  },
  hijab: {
    skin: '#d59a6c',
    skinShadow: '#bd8257',
    hair: '#ff705d',
    hairDark: '#e05a49',
    top: '#fdf3ec',
    topDark: '#ecdccf',
    // Blue, not green: this student stands on the green panel.
    accessory: '#2ba0ff',
  },
  curls: {
    skin: '#8a5533',
    skinShadow: '#6f4127',
    hair: '#241610',
    hairDark: '#170d09',
    top: '#f5e211',
    topDark: '#dcca0d',
    accessory: '#2c2e2a',
  },
};

/** Simple, low-detail faces — enough to read as a person, no uncanny valley. */
function Face({ palette }: { palette: Palette }) {
  return (
    <g>
      {/* neck */}
      <path d="M86 118 h28 v26 q-14 10 -28 0 z" fill={palette.skinShadow} />
      {/* head */}
      <ellipse cx="100" cy="86" rx="30" ry="34" fill={palette.skin} />
      {/* ears */}
      <ellipse cx="70" cy="88" rx="5" ry="8" fill={palette.skin} />
      <ellipse cx="130" cy="88" rx="5" ry="8" fill={palette.skin} />
      {/* eyes */}
      <ellipse cx="89" cy="84" rx="3.4" ry="4" fill="#2c2e2a" />
      <ellipse cx="111" cy="84" rx="3.4" ry="4" fill="#2c2e2a" />
      {/* brows */}
      <path
        d="M83 74 q6 -3 12 0"
        stroke={palette.hairDark}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M105 74 q6 -3 12 0"
        stroke={palette.hairDark}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* smile */}
      <path
        d="M90 99 q10 9 20 0"
        stroke="#2c2e2a"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function ShortHairStudent({ palette }: { palette: Palette }) {
  return (
    <g>
      {/* shoulders */}
      <path d="M40 210 q6 -52 60 -66 q54 14 60 66 z" fill={palette.top} />
      <path d="M76 148 q24 16 48 0 l6 8 q-30 20 -60 0 z" fill={palette.topDark} />
      {/* backpack strap */}
      <path d="M74 150 l-8 60" stroke={palette.accessory} strokeWidth="9" strokeLinecap="round" />
      <Face palette={palette} />
      {/* cropped hair */}
      <path
        d="M69 82 q2 -34 31 -34 q29 0 31 34 q-6 -16 -31 -16 q-25 0 -31 16 z"
        fill={palette.hair}
      />
      {/* over-ear headphones, worn */}
      <path
        d="M64 92 q0 -44 36 -44 q36 0 36 44"
        stroke="#2c2e2a"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="55" y="80" width="17" height="26" rx="8" fill="#2c2e2a" />
      <rect x="128" y="80" width="17" height="26" rx="8" fill="#2c2e2a" />
    </g>
  );
}

function HijabStudent({ palette }: { palette: Palette }) {
  return (
    <g>
      {/* the scarf falls over the shoulders, so it is drawn first and last */}
      <path d="M38 210 q8 -56 62 -70 q54 14 62 70 z" fill={palette.top} />
      <Face palette={palette} />
      {/* hijab: crown, sides and drape */}
      <path
        d="M100 44 q-38 0 -38 44 q0 30 10 44 l-14 12 q-16 -30 -16 -58 q0 -54 58 -54 q58 0 58 54 q0 28 -16 58 l-14 -12 q10 -14 10 -44 q0 -44 -38 -44 z"
        fill={palette.hair}
      />
      <path d="M62 132 q38 22 76 0 l8 22 q-46 26 -92 0 z" fill={palette.hairDark} />
      {/* notebook held to the chest */}
      <rect x="112" y="164" width="46" height="54" rx="4" fill={palette.accessory} />
      <rect x="112" y="164" width="9" height="54" rx="3" fill="#2c2e2a" opacity="0.25" />
    </g>
  );
}

function CurlsStudent({ palette }: { palette: Palette }) {
  // A ring of overlapping circles reads as an afro far better than one blob.
  const curls = Array.from({ length: 13 }, (_, i) => {
    const angle = Math.PI + (i / 12) * Math.PI;
    return {
      cx: 100 + Math.cos(angle) * 38,
      cy: 84 + Math.sin(angle) * 38,
      r: 13.5,
    };
  });

  return (
    <g>
      <path d="M40 210 q6 -52 60 -66 q54 14 60 66 z" fill={palette.top} />
      <path d="M78 148 q22 14 44 0 l5 9 q-27 18 -54 0 z" fill={palette.topDark} />
      <path d="M126 150 l8 60" stroke="#f7f2e6" strokeWidth="9" strokeLinecap="round" />
      <Face palette={palette} />
      {curls.map((curl, index) => (
        <circle key={index} cx={curl.cx} cy={curl.cy} r={curl.r} fill={palette.hair} />
      ))}
      <ellipse cx="100" cy="66" rx="34" ry="22" fill={palette.hair} />
    </g>
  );
}

const DRAWINGS: Record<StudentVariant, React.ComponentType<{ palette: Palette }>> = {
  'short-hair': ShortHairStudent,
  hijab: HijabStudent,
  curls: CurlsStudent,
};

export function StudentPortrait({
  variant,
  panel,
  photo,
  alt,
  className,
}: StudentPortraitProps) {
  const palette = PALETTES[variant];
  const Drawing = DRAWINGS[variant];

  return (
    <div className={cn('relative flex w-full justify-center', className)}>
      {/* Coloured panel — the figure deliberately breaks past its top edge. */}
      <div
        className="absolute bottom-0 left-1/2 h-[62%] w-full max-w-[210px] -translate-x-1/2 rounded-[30px] border-[3px] border-white/90 shadow-[0_18px_40px_rgba(44,46,42,0.12)] sm:max-w-[260px]"
        style={{ backgroundColor: panel }}
        aria-hidden="true"
      />

      {photo ? (
        <img
          src={photo}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className="relative z-10 h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_12px_24px_rgba(44,46,42,0.18)] transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <svg
          viewBox="0 0 200 210"
          role="img"
          aria-label={alt}
          className="relative z-10 h-full w-auto drop-shadow-[0_6px_10px_rgba(44,46,42,0.10)]"
        >
          <Drawing palette={palette} />
        </svg>
      )}
    </div>
  );
}
