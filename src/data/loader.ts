import chains from "./blockbuster_chains.json";
import raw_chains from "./blockbuster_raw_chains.json";
import tsne_data from "./blockbuster_chain_tsne.json";

import {ChainMap, ChainTsneMap} from "./models";

export function loadChains(): ChainMap {
  return chains;
}

export function loadRawChains(): ChainMap {
  return raw_chains;
}

export function loadChainTsne(): ChainTsneMap {
  return tsne_data;
}
