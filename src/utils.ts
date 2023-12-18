import {DISPLAY_RANKS, CHART_COLORS} from "@src/constants";
import {Chain, ChainDateMap, OrderBy} from "./data/models";
import hexToHsl from 'hex-to-hsl';
import hslToHex from 'hsl-to-hex';

export function rankNumToStr(rank: number) {
  switch (rank) {
    case 1: return 'AAA';
    case 2: return 'AA';
    case 3: return 'A';
    case 4: return 'BBB';
    case 5: return 'BB';
    case 6: return 'B';
    case 7: return 'CCC';
    case 8: return 'CC';
    case 9: return 'C';
    default: return 'N/A';
  }
}

export function rankToColor(rank: string) {
  switch (rank) {
    case 'AAA': return CHART_COLORS[0];
    case 'AA': return CHART_COLORS[1];
    case 'A': return CHART_COLORS[2];
    case 'BBB': return CHART_COLORS[3];
    case 'BB': return CHART_COLORS[4];
    case 'B': return CHART_COLORS[5];
    case 'CCC': return CHART_COLORS[6];
    case 'CC': return CHART_COLORS[7];
    case 'C': return CHART_COLORS[8];
    default: return 'black';
  }
}

export function rankNumToColor(rank: number) {
  return rankToColor(rankNumToStr(rank));
}

export const display_rank = (rank: number) => DISPLAY_RANKS[rank - 1];

export function normalize(x: number, min: number, max: number) {
  const ret = (x - min) / (max - min);
  if (!ret) return 0;
  return ret;
}

export const datestamp = (d: Date) => d.toISOString().slice(0, 10);

export const all_chains_at = (chains: ChainDateMap, d: string): Chain[] => {
  const ret: Chain[] = [];
  for (const key of Object.keys(chains)) {
    if (!chains[key][d]) continue;
    ret.push(chains[key][d]);
  }
  return ret;
}

export function evalChain(x: Chain, exclude: string[]): number {
  return Object.keys(x)
    .filter(key => !exclude.includes(key))
    .filter(key => key.startsWith("e_"))
    .filter(key => key !== "e_decentralization_gini")
    // @ts-ignore
    .reduce((total, key) => total + x[key], 0);
}

export const display_name = (name: string) =>
  name.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function increaseLightness(hex: string, p: number) {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, l + (l * (p / 100)));
}

export const lightness = (chains: Chain[], x: Chain, i: number) => {
  const counts: { [key: string]: number } = {};
  chains.forEach((c) => {
    counts[c.rank] = (counts[c.rank] || 0) + 1;
  });

  if (counts[x.rank] <= 1) {
    return 0;
  }

  const INIT_LIGHTNESS_PERCENT = -15;
  return i * Math.floor(50 / (counts[x.rank])) + INIT_LIGHTNESS_PERCENT;
}

export const dates_between = (from: string, to: string): string[] => {
    const from_date: Date = new Date(from);
    const to_date: Date = new Date(to);
    const date_list: string[] = [];

    while (from_date <= to_date) {
        date_list.push(datestamp(from_date));
        from_date.setDate(from_date.getDate() + 1);
    }

    return date_list;
}

export function distinct<T>(list: T[], f: (x: T) => string[]): T[] {
  const uniqueMap: { [key: string]: T } = {};

  list.forEach((x) => {
    const key = f(x).join(";");
    uniqueMap[key] = x;
  });

  return Object.values(uniqueMap);
}

export function normal_distribution(size: number, mean: number, sd: number) {
  const histogram: number[] = [];
  const LEN = 9;

  for (let i = 0; i < LEN; i++) {
    const x = i - (LEN - 1) / 2;

    const value = (1 / (sd * Math.sqrt(2 * Math.PI))) *
      Math.exp(-((x - mean) ** 2) / (2 * sd ** 2));

    histogram.push(Math.round(value * size));
  }

  return histogram;
}

export function sortChains(chains: Chain[], key: keyof Chain, order_by: OrderBy): Chain[] {
  if (key === "rank") {
    if (order_by === OrderBy.ASC) {
      return chains.sort((a, b) => a.e_total - b.e_total);
    }
    return chains.sort((a, b) => b.e_total - a.e_total);
  }

  if (key === "name") {
    if (order_by === OrderBy.ASC) {
      return chains.sort((a, b) => b[key].toString().localeCompare(a[key].toString()));
    }
    return chains.sort((a, b) => a[key].toString().localeCompare(b[key].toString()));
  }

  if (order_by === OrderBy.ASC) {
    return chains.sort((a, b) => a[key].toString().localeCompare(b[key].toString()));
  }
  return chains.sort((a, b) => b[key].toString().localeCompare(a[key].toString()));
}
