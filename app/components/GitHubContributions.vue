<script setup lang="ts">
import type {
  GitHubContributionDay,
  GitHubContributionLevel,
  GitHubContributions,
} from "~~/shared/types/github-contributions";
import generatedGitHubContributions from "~/generated/github-contributions.json";

interface CalendarDay {
  contributionCount: number | null;
  date: string;
  level: GitHubContributionLevel;
  weekday: number;
  week: number;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const numberFormatter = new Intl.NumberFormat("en-US");
const contributions = generatedGitHubContributions as GitHubContributions;
const selectedYear = ref(contributions.years[0]?.year ?? new Date().getFullYear());
const selectedContributions = computed(
  () =>
    contributions.years.find((item) => item.year === selectedYear.value) ??
    contributions.years[0],
);

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function createCalendarDays(year: number, contributionDays: GitHubContributionDay[]) {
  const contributionsByDate = new Map(
    contributionDays.map((day) => [day.date, day]),
  );
  const firstDay = new Date(Date.UTC(year, 0, 1));
  const lastDay = new Date(Date.UTC(year, 11, 31));
  const startWeekday = firstDay.getUTCDay();
  const days: CalendarDay[] = [];

  for (
    let date = firstDay, dayIndex = 0;
    date <= lastDay;
    date = new Date(date.getTime() + 86_400_000), dayIndex += 1
  ) {
    const isoDate = date.toISOString().slice(0, 10);
    const contribution = contributionsByDate.get(isoDate);

    days.push({
      contributionCount: contribution?.contributionCount ?? null,
      date: isoDate,
      level: contribution?.level ?? "NONE",
      weekday: date.getUTCDay(),
      week: Math.floor((startWeekday + dayIndex) / 7),
    });
  }

  return days;
}

const calendarDays = computed(() =>
  selectedContributions.value
    ? createCalendarDays(
        selectedContributions.value.year,
        selectedContributions.value.days,
      )
    : [],
);
const weekCount = computed(
  () => Math.max(...calendarDays.value.map((day) => day.week), 0) + 1,
);
const months = computed(() =>
  monthNames.map((label, month) => {
    const firstDay = new Date(Date.UTC(selectedYear.value, month, 1));
    const yearStart = new Date(Date.UTC(selectedYear.value, 0, 1));
    const dayIndex = Math.round(
      (firstDay.getTime() - yearStart.getTime()) / 86_400_000,
    );

    return {
      label,
      week: Math.floor((yearStart.getUTCDay() + dayIndex) / 7),
    };
  }),
);
const calendarGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${weekCount.value}, var(--cell-size))`,
}));

function dayTitle(day: CalendarDay) {
  if (day.contributionCount === null) {
    return formatDate(day.date);
  }

  const contributionLabel =
    day.contributionCount === 1 ? "contribution" : "contributions";

  return `${day.contributionCount} ${contributionLabel} on ${formatDate(day.date)}`;
}
</script>

<template>
  <section
    v-if="selectedContributions"
    class="github-contributions min-w-0 w-full max-w-full"
  >
    <div class="flex w-full min-w-0 items-stretch gap-3 sm:gap-4">
      <div class="w-0 min-w-0 flex-1 rounded-lg border border-default bg-default">
        <h2 class="px-4 pt-4 text-sm font-semibold text-highlighted sm:px-5 sm:pt-5">
          {{ numberFormatter.format(selectedContributions.totalContributions) }}
          contributions in {{ selectedYear }}
        </h2>

        <div class="overflow-x-auto px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
          <div class="calendar min-w-max">
            <div class="month-grid" :style="calendarGridStyle">
              <span
                v-for="month in months"
                :key="month.label"
                class="month-label"
                :style="{ gridColumnStart: month.week + 1 }"
              >
                {{ month.label }}
              </span>
            </div>

            <div class="calendar-body">
              <div class="weekday-labels" aria-hidden="true">
                <span style="grid-row: 2">Mon</span>
                <span style="grid-row: 4">Wed</span>
                <span style="grid-row: 6">Fri</span>
              </div>

              <div
                class="day-grid"
                :style="calendarGridStyle"
                role="img"
                :aria-label="`${selectedContributions.totalContributions} contributions in ${selectedYear}`"
              >
                <span
                  v-for="day in calendarDays"
                  :key="day.date"
                  class="contribution-day"
                  :data-level="day.level"
                  :style="{
                    gridColumnStart: day.week + 1,
                    gridRowStart: day.weekday + 1,
                  }"
                  :title="dayTitle(day)"
                />
              </div>
            </div>

            <div class="calendar-footer">
              <a
                href="https://docs.github.com/en/account-and-profile/reference/contribution-graph-reference"
                target="_blank"
                rel="noopener noreferrer"
                class="transition-colors hover:text-highlighted"
              >
                Learn how we count contributions
              </a>

              <div class="flex items-center gap-1" aria-label="Contribution intensity">
                <span class="mr-1">Less</span>
                <span class="legend-day" data-level="NONE" />
                <span class="legend-day" data-level="FIRST_QUARTILE" />
                <span class="legend-day" data-level="SECOND_QUARTILE" />
                <span class="legend-day" data-level="THIRD_QUARTILE" />
                <span class="legend-day" data-level="FOURTH_QUARTILE" />
                <span class="ml-1">More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="year-scroll-shell w-16 shrink-0 sm:w-24">
        <nav
          aria-label="Contribution year"
          class="year-scroll overflow-y-auto overscroll-contain"
        >
          <ul class="space-y-1">
            <li v-for="item in contributions.years" :key="item.year">
              <button
                type="button"
                class="year-button"
                :class="{ 'year-button-active': item.year === selectedYear }"
                :aria-pressed="item.year === selectedYear"
                @click="selectedYear = item.year"
              >
                {{ item.year }}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
.github-contributions {
  --contribution-none: #ebedf0;
  --contribution-first: #9be9a8;
  --contribution-second: #40c463;
  --contribution-third: #30a14e;
  --contribution-fourth: #216e39;
  --contribution-border: rgb(27 31 36 / 6%);
}

.calendar {
  --cell-gap: 3px;
  --cell-size: 11px;
  color: var(--ui-text-muted);
  font-size: 12px;
  line-height: 1;
}

.month-grid,
.day-grid {
  display: grid;
  column-gap: var(--cell-gap);
  margin-left: 32px;
}

.month-grid {
  height: 20px;
}

.month-label {
  white-space: nowrap;
}

.calendar-body {
  display: flex;
}

.weekday-labels {
  display: grid;
  width: 32px;
  flex: 0 0 32px;
  grid-template-rows: repeat(7, var(--cell-size));
  row-gap: var(--cell-gap);
}

.weekday-labels span {
  align-self: center;
}

.day-grid {
  grid-template-rows: repeat(7, var(--cell-size));
  row-gap: var(--cell-gap);
}

.contribution-day,
.legend-day {
  border: 1px solid var(--contribution-border);
  border-radius: 2px;
  background: var(--contribution-none);
}

.contribution-day {
  width: var(--cell-size);
  height: var(--cell-size);
}

.legend-day {
  width: 11px;
  height: 11px;
}

.contribution-day[data-level="FIRST_QUARTILE"],
.legend-day[data-level="FIRST_QUARTILE"] {
  background: var(--contribution-first);
}

.contribution-day[data-level="SECOND_QUARTILE"],
.legend-day[data-level="SECOND_QUARTILE"] {
  background: var(--contribution-second);
}

.contribution-day[data-level="THIRD_QUARTILE"],
.legend-day[data-level="THIRD_QUARTILE"] {
  background: var(--contribution-third);
}

.contribution-day[data-level="FOURTH_QUARTILE"],
.legend-day[data-level="FOURTH_QUARTILE"] {
  background: var(--contribution-fourth);
}

.calendar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 16px;
  padding-left: 32px;
}

.year-scroll-shell {
  position: relative;
  min-height: 0;
}

.year-scroll {
  position: absolute;
  inset: 0;
  padding-block: 14px;
  scrollbar-width: thin;
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 14px,
    #000 calc(100% - 14px),
    transparent 100%
  );
}

.year-button {
  width: 100%;
  border-radius: 8px;
  padding: 9px 12px;
  color: var(--ui-text-muted);
  text-align: left;
  transition:
    color 150ms ease,
    background-color 150ms ease;
}

.year-button:hover {
  color: var(--ui-text-highlighted);
  background: var(--ui-bg-elevated);
}

.year-button-active,
.year-button-active:hover {
  color: var(--ui-text-inverted);
  background: var(--color-accent);
}
</style>

<style>
.dark .github-contributions {
  --contribution-none: #161b22;
  --contribution-first: #0e4429;
  --contribution-second: #006d32;
  --contribution-third: #26a641;
  --contribution-fourth: #39d353;
  --contribution-border: rgb(240 246 252 / 10%);
}
</style>
