<script lang="ts">
  import * as d3 from "d3";
  import * as Plot from "@observablehq/plot";
  import type {Chain, ChainMap} from '@src/data/models';
  import {selected, preview} from "@src/store";
  import {display_name} from "@src/utils";

  export let data_maps: ChainMap[];
  export let gf: (x: Chain[]) => number;
  export let key: string = "e_total";

  let selected_chains: Chain[][] =  [];

  $: selected_chains = data_maps.map(x => Object.values(x)
    .filter(x => ($preview ? [...$selected, $preview] : $selected).map(k => k.name).includes(x.name))
    .map(x => ({...x, color: ($preview ? [...$selected, $preview] : $selected).find(k => k.name === x.name)!.color})));

  $: data = selected_chains.flat();

  let el: HTMLElement;

  export let width = 1000;

  export let dates: string[] = [];

  const bump_marks = ({ r = 3, tip = false, ...options }) => {
    options = Plot.stackY2(options);
    return Plot.marks(
      Plot.line(data, { ...options,
        tip, stroke: options.color, strokeOpacity: options.opacity, curve: "bump-x", fill: null }),
      Plot.dot(data, { ...options, fill: options.color, fillOpacity: options.opacity, r }),
      Plot.text(data, { fill: options.color, dy: 0, ...options, text: options.y }),
      Plot.text(
        data,
        Plot.selectFirst({
          ...options,
          text: options.z,
          dx: -(10 + (r || options.strokeWidth / 2)),
          textAnchor: "end",
          fill: "currentColor"
        })
      ),
      Plot.text(
        data,
        Plot.selectLast({
          ...options,
          text: options.z,
          dx: 10 + (r || options.strokeWidth / 2),
          textAnchor: "start",
          fill: "currentColor"
        })
      )
    );
  };

  $: {
    el?.firstChild?.remove();
    el?.append(
      Plot.plot({
        width: 1030,
        marginLeft: 40,
        marginRight: 40,
        marginTop: 15,
        marginBottom: 35,
        x: {
          domain: dates.map(x => new Date(x)),
          label: null,
          grid: true
        },
        y: {
          axis: null,
          domain: [Object.values(selected_chains[0]).length + 1.5, 1]
        },
        color: {
          domain: d3
            .groupSort(data, gf, (d) => d.name)
            .reverse()
        },
        marks: [
          bump_marks({
            x: (d: Chain) => new Date(d.date),
            z: (d: Chain) => display_name(d.name),
            order: key,
            color: (d: Chain) => d.color,
            opacity: (d: Chain) => {
              if ($preview) {
                return d.name === $preview.name ? 1 : 0.5;
              } else {
                return 1;
              }
            },
            reverse: true,
            r: 8,
            fill: "white",
          })
        ]
      })
    );

    if (el) (el.getElementsByTagName("svg")[0]).style.backgroundColor = "var(--color-bg2)";
    if (el) (el.getElementsByTagName("svg")[0]).style.color = "var(--color-text)";
  }
</script>

<div class="root" bind:this={el} />

<style>
  div.root {
    background-color: var(--color-bg2);
  }
</style>
