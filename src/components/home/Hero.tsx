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
    photo: '/students/arab_boy.webp',
    alt: '10-12 year old Arab boy student with a red shirt and backpack',
    height: 'h-[170px] sm:h-[220px] lg:h-[265px]',
  },
  {
    variant: 'hijab' as const,
    panel: '#8ed462',
    photo: '/students/teenage_girl.webp',
    alt: 'Teenage Arab girl student in a coral hijab holding a notebook',
    height: 'h-[200px] sm:h-[260px] lg:h-[315px]',
  },
  {
    variant: 'curls' as const,
    panel: '#2ba0ff',
    photo: '/students/african_boy.webp',
    alt: 'African boy student with afro curls, headphones and yellow shirt',
    height: 'h-[170px] sm:h-[220px] lg:h-[265px]',
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
    <section className="relative overflow-hidden pb-0 pt-2 sm:pt-4">
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

          <h1 className="mt-3 max-w-4xl font-sans text-3xl font-black leading-[0.98] -tracking-[0.045em] text-ink sm:text-5xl lg:text-[3.6rem]">
            Find the right path to{' '}
            <span className="text-[#ff705d]">unlock your future.</span>
          </h1>

          <p className="mt-3 max-w-xl font-sans text-xs font-medium leading-relaxed text-ink/65 sm:text-base">
            Verified schools, universities and student opportunities across the Gulf — compare what
            actually matters and decide with confidence.
          </p>

          {/* Proof row */}
          <div className="mt-4 flex flex-col items-center gap-1.5 sm:mt-5">
            <span className="font-sans text-[11px] font-semibold text-stone-gray sm:text-xs">
              100+ institutions indexed
            </span>
            <div className="flex items-center">
              {PROOF_ICONS.map((entry, index) => {
                const Icon = entry.icon;
                return (
                  <span
                    key={index}
                    className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white shadow-[0_4px_12px_rgba(44,46,42,0.08)] first:ml-0 sm:h-9 sm:w-9"
                    style={{ color: entry.tint }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                );
              })}
              <span className="-ml-2 flex h-8 items-center justify-center rounded-full border-2 border-white bg-[#8ed462] px-2.5 font-sans text-[11px] font-black text-ink shadow-[0_4px_12px_rgba(44,46,42,0.08)] sm:h-9 sm:px-3 sm:text-xs">
                111 perks
              </span>
            </div>
          </div>

          {/* Calls to action */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:mt-5 sm:gap-3">
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 rounded-[50px] border border-transparent bg-[#ff705d] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#ff8676] active:scale-[0.98] sm:px-7 sm:py-3 sm:text-sm"
            >
              Get started <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>

            <Link
              to="/universities"
              className="group inline-flex items-center gap-2.5 rounded-[50px] border border-ink bg-white py-1.5 pl-1.5 pr-5 font-sans text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-ink hover:text-[#f5f1e4] active:scale-[0.98] sm:py-2 sm:pl-2 sm:pr-6 sm:text-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8ed462] text-ink transition-transform group-hover:scale-105 sm:h-9 sm:w-9">
                <Compass className="h-4 w-4" strokeWidth={2.2} />
              </span>
              Find your path
            </Link>
          </div>
        </div>
      </div>

      {/* Students */}
      <div className="relative mx-auto mt-5 max-w-3xl px-4 sm:mt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-end gap-1 sm:gap-3">
          {STUDENTS.map((student) => (
            <StudentPortrait
              key={student.variant}
              variant={student.variant}
              panel={student.panel}
              photo={student.photo}
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
