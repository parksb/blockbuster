<script lang="ts">
  import * as d3 from 'd3';
  import {onMount} from 'svelte';

  import {rankNumToColor} from "@src/utils";
  import type {Chain} from "@src/data/models";
  import type {BubbleChartData, BubbleChartDataMap} from '@src/charts/bubble_chart';

  export let data: BubbleChartDataMap<Chain>;

  export let selected: Chain[];
  export let onClick: (e: any, d: BubbleChartData<Chain>) => void;
  export let onMouseOver: (e: any, d: BubbleChartData<Chain>) => void;
  export let onMouseOut: (e: any, d: BubbleChartData<Chain>) => void;

  let data_list = Object.values(data);
  let el: HTMLElement;

  const data_min = (key: "x" | "y" | "r") => {
    return Math.min(...data_list.map(d => d[key]));
  };

  const data_max = (key: "x" | "y" | "r") => {
    return Math.max(...data_list.map(d => d[key]));
  };

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
      .domain([data_min('x'), data_max('x')])
      .range([0, width]);

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([data_min('y'), data_max('y')])
      .range([height, 0]);

    // Add a scale for bubble size
    const z = d3.scaleLinear()
      .domain([data_min('r'), data_max('r')])
      .range([10, 40]);

    // Add bubbles
    svg.append('g')
      .selectAll("dot")
      .data(data_list)
      .join("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", d => z(d.r))
      .attr("stroke-width", 3)
      .style("fill", d => rankNumToColor(d.data.rank))
      .style("opacity", "0.7")
      .on("mouseover", (e, d) => onMouseOver(e, d))
      .on("mouseout", (e, d) => onMouseOut(e, d))
      .on("click", (e, d) => onClick(e, d));

    svg.call(
      // @ts-ignore
      d3.zoom()
        .scaleExtent([0.1, 5])
        .translateExtent([[-500, -500], [width + 500, height + 500]])
        .on("zoom", (e) => svg.selectChildren('g').attr("transform", e.transform))
    );

    el?.append(svg.node()!!);
  });

  $: {
    try {
      data_list = Object.values(data);
      d3.selectAll("circle").style("fill", (dt) => {
        const d = dt as BubbleChartData<Chain>;
        const found = data_list.find((x) => x.data.name === d.data.name);
        if (!found) {
          return rankNumToColor(d.data.rank);
        }
        return found.b ? "gray" : rankNumToColor(d.data.rank);
      });
    } catch (_) { /* do nothing */ }
  }

  $: {
    try {
      d3.selectAll("circle").attr("stroke", (dt) => {
        const d = dt as BubbleChartData<Chain>;
        if (selected.some((x) => x.name === d.data.name)) {
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
