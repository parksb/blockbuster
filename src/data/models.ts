// It MUST be synced with the remote.

export interface ChainWrapper {
  [key: string]: Chain;
}

export interface Chain {
  name: string;
  rank: number;
  ev_activity: number; // 활성화
  ev_decentralization: number; // 탈중앙지수
  ev_proposal: number; // 프로포절 활성화
  ev_relayer_exchange: number; // 릴레이어 교환
  ev_relayer_account: number; // 릴레이어 계정 수
}
