import { Container } from "@/components/ui/container";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { AnimatedStat } from "@/components/home/animated-stat";
import { globalPresenceStats } from "@/data/global-presence";

const STAT_ACCENTS = [
  "border-t-4 border-t-[#5b9bd5] text-[#7ab3e8]",
  "border-t-4 border-t-[#ff3b30] text-[#e07878]",
  "border-t-4 border-t-[#ffd700] text-[#ffd700]",
  "border-t-4 border-t-[#ff3b30] text-[#e07878]",
] as const;

const stats = globalPresenceStats.map((stat, index) => ({
  id: stat.label.toLowerCase().replace(/[^a-z]+/g, "-"),
  value: Number(stat.value.replace(/[^0-9]/g, "")) * (stat.value.includes("K") ? 1000 : 1),
  display: stat.value,
  label: stat.label,
  icon: ["file", "briefcase", "network", "globe"][index] as "file" | "briefcase" | "network" | "globe",
  accentClass: STAT_ACCENTS[index],
}));

export function HomepageStatisticsSection() {
  return (
    <section
      id="homepage-statistics"
      aria-labelledby="homepage-statistics-title"
      className="border-t border-[#1b4f7d] bg-[#003366] text-white"
    >
      <Container size="wide" className="layout-section-lg">
        <ScrollTransition distance={30}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="type-label text-[#ffd700]">OUR REACH</p>
            <h2
              id="homepage-statistics-title"
              className="mt-4 font-display text-[clamp(2.45rem,5vw,4.6rem)] font-semibold leading-[.98] tracking-[-0.045em] text-white"
            >
              Research Support, Measured in Reach
            </h2>
            <p className="mx-auto mt-5 max-w-[58ch] text-sm leading-7 text-[#9bb8d3] sm:text-base">
              A growing research ecosystem built around writing, analysis, guidance and academic support.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <AnimatedStat
                key={stat.id}
                targetValue={stat.value}
                display={stat.display}
                icon={stat.icon}
                label={stat.label}
                accentClass={stat.accentClass}
                iconClass="border-[#28577f] bg-[#144776] text-current"
              />
            ))}
          </div>
        </ScrollTransition>
      </Container>
    </section>
  );
}
