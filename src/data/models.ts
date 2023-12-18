// It MUST be synced with the remote.

// { chain_name: { datestamp: Chain } }
export interface ChainDateMap {
  [key: string]: { [key: string]: Chain };
}

export interface ChainMap {
  [key: string]: Chain;
}

export interface Chain {
  name: string;
  rank: number;
  color: string;
  e_decentralization: number; // 탈중앙 지표
  e_proposal_activity: number; // 프로포절 활성화 지표
  e_active_account: number; // 활성 검증자 지표
  e_market_cap: number; // 시가총액 변동 지표
  e_total: number; // 종합
  date: string;
}

export interface RawChainTsne {
  x: number;
  y: number;
}

export interface ChainTsne extends RawChainTsne {
  chain: Chain; // 체인 정보
}

export type RawChainTsneMap = { [key: string]: { [key: string]: RawChainTsne } };
export type ChainTsneMap = { [key: string]: ChainTsne };

export enum OrderBy {
  NORMAL,
  ASC,
  DESC,
}
