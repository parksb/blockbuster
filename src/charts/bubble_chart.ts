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

  for (const chain of Object.values(chains)) {
    result[chain.chain.name] = {
      data: chain.chain,
      x: chain.x,
      y: chain.y,
      r: chain.r,
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
