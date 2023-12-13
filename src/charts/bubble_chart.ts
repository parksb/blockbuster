import {Chain, ChainTsneMap} from "@src/data/models";

export interface BubbleChartData<T> {
  data: T; // 데이터
  x: number; // x 좌표
  y: number; // y 좌표
  r: number; // 반지름
  b: boolean; // 블러 여부 (true인 경우 블러)
}

export type BubbleChartDataMap<T> = { [key: string]: BubbleChartData<T> };

export function toBubbleChartDataMap(chains: ChainTsneMap): BubbleChartDataMap<Chain> {
  const result: BubbleChartDataMap<Chain> = {};

  for (const c of Object.values(chains)) {
    result[c.chain.name] = {
      data: c.chain,
      x: c.x,
      y: c.y,
      r: c.chain.e_decentralization +
        c.chain.e_markget_cap +
        c.chain.e_active_account +
        c.chain.e_proposal_activity,
      b: false,
    };
  }

  return result;
}

export function highlightBubbleChart<T>(
  data: BubbleChartDataMap<T>,
  f: (key: string) => boolean,
): BubbleChartDataMap<T> {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) =>
      ([k, { ...v, b: f(k) }])
    )
  );
}
