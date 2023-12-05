import chains from "./blockbuster_chains.json";
import tsne_data from "./blockbuster_chain_tsne.json";

import {ChainMap, ChainTsneMap} from "./models";

export function loadChains(): ChainMap {
  return chains;
}

export function loadChainTsne(): ChainTsneMap {
  return tsne_data;
}
