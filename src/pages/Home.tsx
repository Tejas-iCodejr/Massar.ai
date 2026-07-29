import React from 'react';
import { ArrowRight, Columns2, Gift, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Hero } from '../components/home/Hero';
import { UniversityEvents } from '../components/ui/UniversityEvents';

/**
 * Home is deliberately short: a static hero, three capability cards, one
 * decision tool, and the live events feed. Anything that duplicated the nav or
 * another page was removed rather than restyled.
 */

const CAPABILITIES = [
  {
    icon: Search,
    label: 'Directory',
    title: 'Search that stays current',
    body: 'Grounded in live Google Search and Maps, so campus addresses, fees and programmes come back verified instead of guessed.',
    href: '/universities',
    cta: 'Search the directory',
    hex: '#2ba0ff',
  },
  {
    icon: Columns2,
    label: 'Compare',
    title: 'Three options, side by side',
    body: 'Put tuition, global rank, acceptance rate and intake dates in one row and see exactly where they diverge.',
    href: '/compare',
    cta: 'Open compare',
    hex: '#8ed462',
  },
  {
    icon: Gift,
    label: 'Perks',
    title: 'Perks worth real money',
    body: 'Over a hundred verified student offers — developer software, cloud credits, subscriptions and regional grants.',
    href: '/perks',
    cta: 'See perks',
    hex: '#ff705d',
  },
];

const SECONDARY_TOOLS = [
  { label: 'Equivalency & MOE attestation', href: '/accreditation' },
];

export function Home() {
  return (
    <div className="grid-bg relative min-h-screen pb-20">
      <Hero />

      {/* Capabilities */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-2xl"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-stone-gray">
            Built for the decision
          </span>
          <h2 className="mt-3 font-sans text-3xl font-black uppercase -tracking-[0.035em] text-ink sm:text-5xl">
            Three tools that do the work
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CAPABILITIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="flex"
              >
                <Link
                  to={item.href}
                  className="group flex w-full flex-col justify-between rounded-[32px] border border-hairline-mist bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink"
                >
                  <div>
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${item.hex}1f`, color: item.hex }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>

                    <span className="mt-5 block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-stone-gray">
                      {item.label}
                    </span>
                    <h3 className="mt-2 font-sans text-xl font-black uppercase -tracking-[0.02em] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 font-sans text-sm font-medium leading-relaxed text-ink/65">
                      {item.body}
                    </p>
                  </div>

                  <span className="mt-8 inline-flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-ink">
                    {item.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* The specialist tools live on their own pages — linked, not inlined. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline-mist pt-6">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-stone-gray">
            Also available
          </span>
          {SECONDARY_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="font-sans text-xs font-bold text-ink/70 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Live events */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <UniversityEvents />
      </section>
    </div>
  );
}
