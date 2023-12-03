import {Chain} from "@src/data/models";

export interface RadarChartData<T> {
  data: T; // 데이터
  key: string,
  value: number,
  blur: boolean; // 블러 여부 (true인 경우 블러)
}

export type RadarChartDataMap<T> = { [key: string]: RadarChartData<T> };

export function toRadarChartData(chains: Chain[]): RadarChartData<Chain>[] {
  return chains.flatMap((chain) =>
    Object.entries({
      ev_activity: chain.ev_activity,
      ev_decentralization: chain.ev_decentralization,
      ev_proposal: chain.ev_proposal,
      ev_relayer_exchange: chain.ev_relayer_exchange,
      ev_relayer_account: chain.ev_relayer_account,
    }).map(([key, value]) => ({
      data: chain,
      key: `${key.replaceAll("ev_", "").replaceAll("_", "\n")}`,
      value,
      blur: false,
    })
  ));
}

export function highlightRadarChart<Chain>(
  data: RadarChartData<Chain>[],
  f: (key: string) => boolean,
): RadarChartData<Chain>[] {
  // @ts-ignore
  return data.map((x) => ({ ...x, blur: f(x.data.name) }));
}
