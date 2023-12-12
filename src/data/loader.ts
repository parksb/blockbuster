import chains from "./chains.json";
import raw_chains from "./raw_chains.json";
import tsne_data from "./chain_tsne.json";

import {ChainMap, ChainTsneMap} from "./models";

export function loadChains(): ChainMap {
  const loaded: ChainMap = chains;

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

  let acc = 0;
  let chain_list = Object.values(loaded).sort((a, b) => b.e_total - a.e_total);
  for (let i = 0; i < NORMAL_DIST.length; i++) {
    const len = NORMAL_DIST[i];
    const rank = RANKS[i];

    for (const c of chain_list.slice(acc, acc + len)) {
      loaded[c.name].rank = rank;
    }

    acc += len;
  }

  return loaded;
}

export function loadRawChains(): ChainMap {
  return raw_chains;
}

export function loadChainTsne(chains: ChainMap): ChainTsneMap {
  const ret: ChainTsneMap = tsne_data;

  for (const d of Object.values(ret)) {
    ret[d.chain.name].chain = chains[d.chain.name];
  }

  return ret;
}
