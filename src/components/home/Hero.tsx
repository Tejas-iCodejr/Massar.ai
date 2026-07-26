import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Gift, GraduationCap, School } from 'lucide-react';
import { StudentPortrait } from './StudentPortrait';

/**
 * The home page hero: headline, proof, two calls to action, and three students
 * standing in coloured frames.
 *
 * Static by design — the previous scroll-driven WebGL hero was dropped. Nothing
 * here waits on JavaScript beyond React itself, so the headline paints on first
 * frame.
 */

const STUDENTS = [
  {
    variant: 'short-hair' as const,
    panel: '#ff705d',
    alt: 'Illustration of a student wearing headphones and a backpack',
    // Tallest in the middle, so the row reads as a curve rather than a wall.
    height: 'h-[210px] sm:h-[290px] lg:h-[350px]',
  },
  {
    variant: 'hijab' as const,
    panel: '#8ed462',
    alt: 'Illustration of a student in a hijab holding a notebook',
    height: 'h-[245px] sm:h-[340px] lg:h-[410px]',
  },
  {
    variant: 'curls' as const,
    panel: '#2ba0ff',
    alt: 'Illustration of a student with curly hair carrying a backpack',
    height: 'h-[210px] sm:h-[290px] lg:h-[350px]',
  },
];

/** Stands in for the reference's avatar cluster, using categories we can count. */
const PROOF_ICONS = [
  { icon: GraduationCap, tint: '#ff705d' },
  { icon: School, tint: '#8ed462' },
  { icon: BookOpen, tint: '#2ba0ff' },
  { icon: Gift, tint: '#9f5ffd' },
];

/** Faint line-art in the background, echoing the storybook doodles elsewhere. */
function BackgroundDoodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute left-[4%] top-[22%] h-16 w-16 text-[#8ed462]/25 sm:h-20 sm:w-20"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* rocket */}
        <path d="M32 6c9 7 13 16 13 26l-6 8H25l-6-8c0-10 4-19 13-26z" />
        <circle cx="32" cy="26" r="5" />
        <path d="M25 40l-7 12 11-4M39 40l7 12-11-4" />
      </svg>

      <svg
        className="absolute right-[6%] top-[16%] h-16 w-16 text-[#f5e211]/40 sm:h-20 sm:w-20"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* graduation cap */}
        <path d="M6 24L32 12l26 12-26 12L6 24z" />
        <path d="M16 30v14c0 3 7 6 16 6s16-3 16-6V30" />
      </svg>

      <svg
        className="absolute left-[10%] top-[62%] hidden h-16 w-16 text-[#2ba0ff]/25 lg:block"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* open book */}
        <path d="M6 14h20c3 0 6 2 6 5v33c0-3-3-5-6-5H6V14z" />
        <path d="M58 14H38c-3 0-6 2-6 5v33c0-3 3-5 6-5h20V14z" />
      </svg>

      <svg
        className="absolute right-[9%] top-[58%] hidden h-14 w-14 text-[#ff705d]/25 lg:block"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* pencil */}
        <path d="M44 8l12 12-32 32-16 4 4-16L44 8z" />
        <path d="M40 12l12 12" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-0 pt-6 sm:pt-10">
      {/* Soft warm wash behind the type, so the frames below have something to sit on. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 70% at 50% 4%, #ffffff 0%, #faf7ee 45%, rgba(245,241,228,0) 100%)',
        }}
      />

      <BackgroundDoodles />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-stone-gray sm:text-[11px]">
            Schools · Universities · Opportunities
          </span>

          <h1 className="mt-6 max-w-4xl font-sans text-[2.6rem] font-black leading-[0.95] -tracking-[0.045em] text-ink sm:text-6xl lg:text-[4.4rem]">
            Find the right path to{' '}
            <span className="text-[#ff705d]">unlock your future.</span>
          </h1>

          <p className="mt-7 max-w-2xl font-sans text-base font-medium leading-relaxed text-ink/65 sm:text-lg">
            Verified schools, universities and student opportunities across the Gulf — compare what
            actually matters and decide with confidence.
          </p>

          {/* Proof row */}
          <div className="mt-9 flex flex-col items-center gap-2">
            <span className="font-sans text-xs font-semibold text-stone-gray">
              100+ institutions indexed
            </span>
            <div className="flex items-center">
              {PROOF_ICONS.map((entry, index) => {
                const Icon = entry.icon;
                return (
                  <span
                    key={index}
                    className="-ml-2.5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white shadow-[0_4px_12px_rgba(44,46,42,0.08)] first:ml-0"
                    style={{ color: entry.tint }}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </span>
                );
              })}
              <span className="-ml-2.5 flex h-10 items-center justify-center rounded-full border-2 border-white bg-[#8ed462] px-3 font-sans text-xs font-black text-ink shadow-[0_4px_12px_rgba(44,46,42,0.08)]">
                111 perks
              </span>
            </div>
          </div>

          {/* Calls to action */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 rounded-[50px] border border-transparent bg-[#ff705d] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#ff8676] active:scale-[0.98]"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>

            {/* The reference's second button plays a video; there is no video, so
                this points at the path wizard further down the page instead. */}
            <a
              href="#path-wizard"
              className="group inline-flex items-center gap-3 rounded-[50px] border border-ink bg-white py-2 pl-2 pr-7 font-sans text-sm font-semibold uppercase tracking-wider text-ink transition-all hover:bg-ink hover:text-[#f5f1e4] active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8ed462] text-ink transition-transform group-hover:scale-105">
                <Compass className="h-4.5 w-4.5" strokeWidth={2.2} />
              </span>
              Find your path
            </a>
          </div>
        </div>
      </div>

      {/* Students */}
      <div className="relative mx-auto mt-10 max-w-4xl px-4 sm:mt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-end gap-1 sm:gap-3">
          {STUDENTS.map((student) => (
            <StudentPortrait
              key={student.variant}
              variant={student.variant}
              panel={student.panel}
              alt={student.alt}
              className={student.height}
            />
          ))}
        </div>
        {/* Ground the row so the frames don't end on a hard edge. */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-hairline-mist to-transparent"
        />
      </div>
    </section>
  );
}
