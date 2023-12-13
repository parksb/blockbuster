import ochains from "./chains.json";
import raw_chains from "./raw_chains.json";
import tsne_data from "./chain_tsne.json";

import {Chain, ChainDateMap, ChainMap, ChainTsneMap} from "./models";
import {normalize, evalChain} from "@src/utils";
const chains = ochains as ChainDateMap;

export function loadChainsAt(d: string = "latest", exc: (keyof Chain)[] = []): ChainMap {
  const ret: ChainMap = {};

  const first_date = Object.values(Object.values(chains)[0])[0].date;
  if (d === "latest") d = first_date;

  // Calculate total score at d
  for (const key in chains) {
    const x = chains[key][d];
    if (!x) continue; // 해당 날짜에 데이터가 없는 경우 무시.

    ret[key] = {
      ...x,
      e_total: evalChain(x, exc),
    }
  }

  const min_total = Math.min(...Object.values(ret).map(x => x.e_total));
  const max_total = Math.max(...Object.values(ret).map(x => x.e_total));

  for (const key in ret) {
    ret[key].e_total = normalize(ret[key].e_total, min_total, max_total);
  }

  // Calculate rank
  const NORMAL_DIST = [
    3, // Math.ceil(len * 0.001),
    6, // Math.ceil(len * 0.021),
    9, // Math.ceil(len * 0.136),
    12, // Math.ceil(len * 0.341),
    13, // Math.ceil(len * 0.341),
    9, // Math.ceil(len * 0.136),
    6, // Math.ceil(len * 0.021),
    3, // Math.ceil(len * 0.001),
  ];

  const RANKS = Array.from({ length: 8 }, (_, k) => k + 1);

  let acc = 0;
  let chain_list = Object.values(ret).sort((a, b) => b.e_total - a.e_total);

  for (let j = 0; j < NORMAL_DIST.length; j++) {
    const len = NORMAL_DIST[j];
    const rank = RANKS[j];

    for (const c of chain_list.slice(acc, acc + len)) {
      ret[c.name].rank = rank;
    }

    acc += len;
  }

  return ret;
}

export function loadRawChains(): ChainDateMap {
  return raw_chains;
}

export function loadChainTsne(chains: ChainMap): ChainTsneMap {
  const ret: ChainTsneMap = {};

  for (const k of Object.keys(chains)) {
    ret[k] = (tsne_data as ChainTsneMap)[k];
    ret[k].chain = chains[k];
  }

  return ret;
}
