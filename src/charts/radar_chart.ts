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
      e_decentralization: chain.e_decentralization,
      e_active_account: chain.e_active_account,
      e_proposal_activity: chain.e_proposal_activity,
      e_markget_cap: chain.e_markget_cap,
    }).map(([key, value]) => ({
      data: chain,
      key: `${key.replace("e_", "").replaceAll("_", "\n")}`,
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
