<script lang="ts">
  import * as d3 from "d3";
  import * as Plot from "@observablehq/plot";

  import type { Chain } from "@src/data/models";
  import { toRadarChartData, type RadarChartData } from "@src/charts/radar_chart";
  import {display_name, distinct} from "@src/utils";

  export let data: RadarChartData<Chain>[];

  let mean: Chain;
  $: {
    const pool = distinct(data);
    mean = {
      name: "Mean",
      e_decentralization: pool.reduce((a, b) => a + b.data.e_decentralization, 0) / pool.length,
      e_active_account: pool.reduce((a, b) => a + b.data.e_active_account, 0) / pool.length,
      e_proposal_activity: pool.reduce((a, b) => a + b.data.e_proposal_activity, 0) / pool.length,
      e_market_cap: pool.reduce((a, b) => a + b.data.e_market_cap, 0) / pool.length,
      e_total: pool.reduce((a, b) => a + b.data.e_total, 0) / pool.length,
      color: "#5f5f5f",
      rank: 0,
      date: "",
    };
  }

  let means: RadarChartData<Chain>[] = [];
  $: means = toRadarChartData([mean]).map(x => ({ ...x, blur: true }));

  let el: HTMLElement;

  $: {
    const points = [...means, ...data];
    const longitude = d3.scalePoint(new Set(Plot.valueof(points, "key")), [180, -180]).padding(0.5).align(1)

    el?.firstChild?.remove();
    el?.append(
      Plot.plot({
        width: 300,
        projection: {
          type: "azimuthal-equidistant",
          rotate: [0, -90],
          domain: d3.geoCircle().center([0, 90]).radius(1.3)()
        },
        color: { legend: false },
        marks: [
          // discs
          Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
            geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
            stroke: "white",
            strokeOpacity: 0.3,
            fillOpacity: 0.03,
            strokeWidth: 0.5
          }),

          // axes
          Plot.link(longitude.domain(), {
            x1: longitude,
            y1: 0,
            x2: 0,
            y2: 90,
            stroke: "#181A20",
            strokeOpacity: 0.7,
            strokeWidth: 2.5,
          }),

          // tick labels
          Plot.text([0.2, 0.4, 0.6, 0.8, 1.0], {
            x: -135,
            y: (d) => 90 - d,
            dx: 0,
            textAnchor: "start",
            text: (d) => `${d * 100}%`,
            fill: "#98A2AE",
            fontSize: 9,
          }),

          // axes labels
          Plot.text(longitude.domain(), {
            x: longitude,
            y: 90 - 1.0,
            text: Plot.identity,
            fill: "#98A2AE",
            lineWidth: 5
          }),

          // areas
          Plot.area(points, {
            x1: ({ key }) => longitude(key),
            y1: ({ value }) => 90 - value,
            x2: 0,
            y2: 90,
            fill: ({ data }) => data.color,
            fillOpacity: ({ data, blur }) => data.name === "Mean" ? 0.3 : (blur ? 0 : 0.1),
            stroke: ({ data }) => data.color,
            strokeWidth: ({ data, blur }) => data.name === "Mean" ? 0.3 : (blur ? 0.5 : 1),
            curve: "cardinal-closed",
          }),

          // points
          Plot.dot(points.filter(x => x.data.name !== "Mean"), {
            x: ({ key }) => longitude(key),
            y: ({ value }) => 90 - value,
            fill: ({ data }) => data.color,
            fillOpacity: ({ blur }) => blur ? 0.3 : 0.7,
          }),

          // interactive labels
          Plot.text(
            points,
            Plot.pointer({
              x: ({ key }) => longitude(key),
              y: ({ value }) => 90 - value,
              text: (d) => `${display_name(d.data.name)}\n${(d.value * 100).toFixed(1)}%`,
              textAnchor: "start",
              dx: 4,
              fill: "currentColor",
              stroke: "white",
              maxRadius: 10
            })
          ),
        ]
      })
    );

    if (el) (el.getElementsByTagName("svg")[0]).style.backgroundColor = "var(--color-bg2)";
  }
</script>

<div class="root" bind:this={el} role="img" />

<style>
  div.root {
    background-color: var(--color-bg2);
  }
</style>
