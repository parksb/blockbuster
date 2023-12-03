<script lang="ts">
  import * as d3 from 'd3';
  import {onMount} from 'svelte';
  import type {Chain} from "../data/models";
  import { rankNumToColor } from "@src/utils";

  export let data: { chain: Chain, b: boolean, x: number, y: number, r: number }[];
  export let selected: Chain[];
  export let onClick: (e: any, d: any) => void;
  export let onMouseOver: (e: any, d: any) => void;
  export let onMouseOut: (e: any, d: any) => void;

  let el: HTMLElement;

  onMount(() => {
    // set the dimensions and margins of the graph
    const margin = {top: 0, right: 0, bottom: 0, left: 0};
    const width = 1430 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.create("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("height", "100%");

    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([Math.min(...data.map(d => d.x)), Math.max(...data.map(d => d.x))])
      .range([0, width ]);

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([Math.min(...data.map(d => d.y)), Math.max(...data.map(d => d.y))])
      .range([height, 0]);

    // Add a scale for bubble size
    const z = d3.scaleLinear()
      .domain([Math.min(...data.map(d => d.r)), Math.max(...data.map(d => d.r))])
      .range([10, 40]);

    // Add bubbles
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", d => z(d.r))
      .attr("stroke-width", 3)
      .style("fill", d => rankNumToColor(d.chain.rank))
      .style("opacity", "0.7")
      .on("mouseover", (e, d) => onMouseOver(e, d))
      .on("mouseout", (e, d) => onMouseOut(e, d))
      .on("click", (e, d) => onClick(e, d));

    svg.call(
      d3.zoom()
        .scaleExtent([0.1, 5])
        .translateExtent([[-500, -500], [width + 500, height + 500]])
        .on("zoom", (e) => svg.selectChildren('g').attr("transform", e.transform))
    );

    el?.append(svg.node()!!);
  });

  $: {
    try {
      d3.selectAll("circle").style("fill", d => {
        const found = data.find((x) => x.chain.name === d.chain.name);
        if (!found) {
          return rankNumToColor(d.chain.rank);
        }
        return found.b ? "gray" : rankNumToColor(d.chain.rank);
      });
    } catch (_) { /* do nothing */ }
  }

  $: {
    try {
      d3.selectAll("circle").attr("stroke", d => {
        if (selected.some((x) => x.name === d.chain.name)) {
          return "white";
        }
        return "none";
      });
    } catch (_) { /* do nothing */ }
  }
</script>

<div class="root" bind:this={el} role="img"></div>

<style>
  div.root {
    background-color: var(--color-bg2);
    width: 100%;
    height: 100%;
  }
</style>
