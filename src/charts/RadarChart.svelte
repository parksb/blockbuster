<script lang="ts">
  import * as d3 from "d3";
  import * as Plot from "@observablehq/plot";

  import type { Chain } from "@src/data/models";

  export let data: Chain[];

  let el: HTMLElement;

  $: {
    const points = data.flatMap(({ name, ...values }) =>
      Object.entries(values)
        .filter(([k, _]) => k.startsWith("ev_"))
        .map(([key, value]) => ({
          name,
          key: `${key.replaceAll("ev_", "").replaceAll("_", "\n")}`,
          value })
        )
    );

    const longitude = d3.scalePoint(new Set(Plot.valueof(points, "key")), [180, -180]).padding(0.5).align(1)

    el?.firstChild?.remove();
    el?.append(
      Plot.plot({
        width: 300,
        projection: {
          type: "azimuthal-equidistant",
          rotate: [0, -90],
          domain: d3.geoCircle().center([0, 90]).radius(1.2)()
        },
        color: { legend: false },
        marks: [
          // grey discs
          Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
            geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
            stroke: "white",
            strokeOpacity: 0.3,
            fillOpacity: 0.03,
            strokeWidth: 0.5
          }),

          // white axes
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
            x: 180,
            y: (d) => 90 - d,
            dx: 0,
            textAnchor: "start",
            text: (d) => `${d}`,
            fill: "white",
            fontSize: 9,
          }),

          // axes labels
          Plot.text(longitude.domain(), {
            x: longitude,
            y: 90 - 0.9,
            text: Plot.identity,
            fill: "white",
            lineWidth: 5
          }),

          // areas
          Plot.area(points, {
            x1: ({ key }) => longitude(key),
            y1: ({ value }) => 90 - value,
            x2: 0,
            y2: 90,
            fill: "name",
            fillOpacity: 0.1,
            stroke: "name",
            curve: "cardinal-closed",
          }),

          // points
          Plot.dot(points, {
            x: ({ key }) => longitude(key),
            y: ({ value }) => 90 - value,
            fill: "name",
          }),

          // interactive labels
          Plot.text(
            points,
            Plot.pointer({
              x: ({ key }) => longitude(key),
              y: ({ value }) => 90 - value,
              text: (d) => `${(d.value).toFixed(2)}`,
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
