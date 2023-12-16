import {DISPLAY_RANKS} from "./data/constants";
import {Chain, ChainDateMap} from "./data/models";

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
    case 'AAA': return '#693ce5';
    case 'AA': return '#9b3db3';
    case 'A': return '#c241b0';
    case 'BBB': return '#ee4395';
    case 'BB': return '#f65375';
    case 'B': return '#f66b54';
    case 'CCC': return '#f78c39';
    case 'CC': return '#e8b02d';
    case 'C': return '#c9d33a';
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
    // @ts-ignore
    .reduce((total, key) => total + x[key], 0);
}

export const display_name = (name: string) =>
  name.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function increaseBrightness(hex: string, percent: number) {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if(hex.length == 3){
    hex = hex.replace(/(.)/g, '$1$1');
  }

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return '#' +
    ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
    ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
    ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
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

export function distinct<T extends { key: string, data: { name: string } }>(list: T[]): T[] {
  const uniqueMap: { [key: string]: T } = {};

  list.forEach((item) => {
    const key = `${item.key}_${item.data.name}`;
    uniqueMap[key] = item;
  });

  return Object.values(uniqueMap);
}
