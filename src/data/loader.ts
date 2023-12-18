import ochains from "./chains.json";
import raw_chains from "./raw_chains.json";
import otsne_data from "./chain_tsne.json";

import {Chain, ChainDateMap, ChainMap, RawChainTsneMap, ChainTsneMap} from "./models";
import {normalize, evalChain, dates_between, normal_distribution} from "@src/utils";
import {RANKS} from "@src/constants";
const chains = ochains as ChainDateMap;

export function loadChainsAt(d: string = "latest", exc: (keyof Chain)[] = []): ChainMap {
  const ret: ChainMap = {};

  if (d === "latest") d = Object.values(Object.values(chains)[0])[0].date;

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

  const normal_dist = normal_distribution(Object.keys(ret).length + 1, 0, 2);

  let acc = 0;
  let chain_list = Object.values(ret).sort((a, b) => b.e_total - a.e_total);

  for (let j = 0; j < normal_dist.length; j++) {
    const len = normal_dist[j];
    const rank = RANKS[j];

    for (const c of chain_list.slice(acc, acc + len)) {
      ret[c.name].rank = rank;
    }

    acc += len;
  }

  return ret;
}

export function loadChainsBetween(from: string, to: string): ChainMap[] {
  const dates = dates_between(from, to);
  const ret = [];
  for (const date of dates) {
    ret.push(loadChainsAt(date));
  }
  return ret;
}

export function loadRawChains(): ChainDateMap {
  return raw_chains;
}

export function loadChainTsne(chains: ChainMap, d: string = "latest"): ChainTsneMap {
  const ret: ChainTsneMap = {};

  if (d === "latest") d = Object.values(chains)[0].date;
  const found = (otsne_data as RawChainTsneMap)[d];

  for (const k of Object.keys(chains)) {
    ret[k] = {
      ...found[k],
      chain: chains[k],
    };
  }

  return ret;
}
