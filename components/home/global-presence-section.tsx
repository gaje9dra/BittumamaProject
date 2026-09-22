"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import {
  getGlobalPresenceCities,
  globalPresenceCities,
  globalPresenceRegions,
  globalPresenceStats,
  type GlobalPresenceCity,
} from "@/data/global-presence";

const regionStyles: Record<GlobalPresenceCity["region"], string> = {
  Americas: "bg-[#386779]",
  Europe: "bg-[#2f665c]",
  Asia: "bg-[#a34f3f]",
  Africa: "bg-[#9a6a20]",
  Oceania: "bg-[#2f6b4f]",
  "Middle East": "bg-[#695846]",
};

function CityImage({ city }: { city: GlobalPresenceCity }) {
  return (
    <div
      role="img"
      aria-label={city.alt}
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url("${city.image}")` }}
    />
  );
}

function CityCard({ city }: { city: GlobalPresenceCity }) {
  return (
    <Link
      href={`/locations/${city.id}`}
      aria-label={`Explore the ${city.city} location page`}
      className="group relative block min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-white/10 text-left transition-[opacity,transform,border-color,box-shadow] duration-[var(--motion-normal)] hover:-translate-y-0.5 hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent focus-visible:ring-1 focus-visible:ring-accent"
    >
      <div className="relative aspect-[1.34/1] overflow-hidden bg-[#20312d]">
        <CityImage city={city} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f1c] via-[#0d1f1c]/15 to-transparent" />
        <span className="absolute left-3 top-3 font-mono text-[0.68rem] tracking-[0.12em] text-white/80">
          {city.code}
        </span>
        <span
          className={`absolute bottom-[4.4rem] right-3 rounded-sm px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white ${regionStyles[city.region]}`}
        >
          {city.region}
        </span>
      </div>
      <div className="flex items-end justify-between gap-4 bg-[#10231f] px-4 py-3.5">
        <span>
          <span className="block font-display text-[1.08rem] font-semibold leading-tight text-white">
            {city.city}
          </span>
          <span className="mt-1 block text-[0.76rem] text-white/55">{city.country}</span>
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 text-accent transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}

export function GlobalPresenceSection() {
  const [activeRegion, setActiveRegion] =
    useState<(typeof globalPresenceRegions)[number]>("All");
  const cities = useMemo(
    () => getGlobalPresenceCities(activeRegion),
    [activeRegion],
  );

  return (
    <section
      id="global-presence"
      aria-labelledby="global-presence-title"
      className="relative overflow-hidden border-t border-[#29443e] bg-[#0d1f1c] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.16)_1px,transparent_0)] [background-size:34px_34px]"
      />
      <Container size="wide" className="relative layout-section-lg">
        <div className="mx-auto max-w-4xl text-center">
          <p className="type-label inline-flex items-center rounded-full border border-accent/50 bg-accent/10 px-3 py-1.5 text-accent">
            Worldwide Footprint
          </p>
          <h2
            id="global-presence-title"
            className="mt-5 font-display text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[.98] tracking-[-0.045em]"
          >
            Our Global <span className="text-accent">Presence</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[62ch] text-sm leading-7 text-white/65 sm:text-base">
            Connecting scholars and institutions across 25 major cities on every continent.
            <br />
            Select any city to open its dedicated location page.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-white/[0.035] sm:grid-cols-4">
          {globalPresenceStats.map((stat) => (
            <div
              key={stat.label}
              className="border-b border-white/10 px-4 py-6 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <p className="font-display text-3xl font-semibold tracking-[-0.03em] text-accent sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/45">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-2" aria-label="Global Presence regions">
          {globalPresenceRegions.map((region) => {
            const selected = activeRegion === region;

            return (
              <button
                key={region}
                type="button"
                aria-label={`Filter cities by ${region === "All" ? "all regions" : region}`}
                aria-pressed={selected}
                onClick={() => setActiveRegion(region)}
                className={`min-h-10 rounded-full border px-4 py-2 text-sm font-medium transition-[background-color,border-color,color,transform] duration-[var(--motion-fast)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent ${
                  selected
                    ? "border-accent bg-accent text-white"
                    : "border-white/15 bg-white/[0.025] text-white/65 hover:border-white/30 hover:text-white"
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-5">
          <p className="text-right font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/35">
            Global Presence / 25 cities
          </p>
        </div>
      </Container>
    </section>
  );
}
