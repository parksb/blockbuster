<script lang="ts">
  import * as d3 from 'd3';
  import {onMount} from 'svelte';
  import type {Chain} from "../data/models";

  export let data: { chain: Chain, x: number, y: number, r: number }[];
  export let has_axis: boolean = false;
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
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom);

    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([Math.min(...data.map(d => d.x)), Math.max(...data.map(d => d.x))])
      .range([0, width ]);
    if (has_axis) {
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    }

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([Math.min(...data.map(d => d.y)), Math.max(...data.map(d => d.y))])
      .range([height, 0]);
    if (has_axis) {
      svg.append("g").call(d3.axisLeft(y));
    }

    // Add a scale for bubble size
    const z = d3.scaleLinear()
      .domain([Math.min(...data.map(d => d.r)), Math.max(...data.map(d => d.r))])
      .range([10, 40]);

    const tooltip = d3.select(el)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden");

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", d => z(d.r))
      .style("fill", d => `#${d.chain.rank}9b3a2`)
      .style("opacity", "0.7")
      .on("mouseover", (e, d) => onMouseOver(e, d))
      .on("mouseout", (e, d) => onMouseOut(e, d))
      .on("click", (e, d) => onClick(e, d));

    svg.call(
      d3.zoom()
        .scaleExtent([0, 5])
        .translateExtent([[0, 0], [width, height]])
        .on("zoom", (e) => svg.selectChildren('g').attr("transform", e.transform))
    );

    el?.append(svg.node()!!);
  });
</script>

<div class="root" bind:this={el} role="img"></div>

<style>
  div.root {
    background-color: var(--color-bg2);
    width: 100%;
    height: 100%;
  }
</style>
