import chains from "./chains.json";
import raw_chains from "./raw_chains.json";
import tsne_data from "./chain_tsne.json";

import {ChainDateMap, ChainMap, ChainTsneMap} from "./models";
import {all_chains_at} from "@src/utils";

export function loadChainsAt(d: string = "latest"): ChainMap {
  const ret: ChainMap = {};

  const NORMAL_DIST = [
    3, // Math.ceil(len * 0.001),
    6, // Math.ceil(len * 0.021),
    9, // Math.ceil(len * 0.136),
    15, // Math.ceil(len * 0.341),
    15, // Math.ceil(len * 0.341),
    9, // Math.ceil(len * 0.136),
    6, // Math.ceil(len * 0.021),
    3, // Math.ceil(len * 0.001),
  ]

  const RANKS = Array.from({ length: 8 }, (_, k) => k + 1);

  const FIRST_DATE = Object.values(Object.values(chains)[0])[0].date;
  if (d === "latest") d = FIRST_DATE;

  let acc = 0;
  let chain_list = all_chains_at(chains, d).sort((a, b) => b.e_total - a.e_total);

  for (let j = 0; j < NORMAL_DIST.length; j++) {
    const len = NORMAL_DIST[j];
    const rank = RANKS[j];

    for (const c of chain_list.slice(acc, acc + len)) {
      ret[c.name] = (chains as ChainDateMap)[c.name][d];
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
