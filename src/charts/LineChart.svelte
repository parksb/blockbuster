<script lang="ts">
  import * as Plot from "@observablehq/plot";
  import type {ChainMap, Chain} from "@src/data/models";
  import {selected, preview} from "@src/store";
  import {display_name} from "@src/utils";

  export let yf: (d: Chain) => number;
  export let data_maps: ChainMap[];

  let selected_chains: Chain[][] =  [];

  $: {
    selected_chains = data_maps.map(x => Object.values(x)
      .filter(x => ($preview ? [...$selected, $preview] : $selected).map(k => k.name).includes(x.name))
      .map(x => ({...x, color: ($preview ? [...$selected, $preview] : $selected).find(k => k.name === x.name)!.color})));
  }

  $: data = selected_chains.flat();

  let el: HTMLElement;
  $: {
    el?.firstChild?.remove();
    el?.append(
      Plot.plot({
        style: "overflow: visible;",
        width: 1010,
        height: 275,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        marginBottom: 35,
        y: { grid: true, tickFormat: (d) => `${d * 100}%` },
        marks: [
          Plot.ruleY([0]),
          Plot.ruleX(data,
            Plot.pointerX({
              x: d => new Date(d.date), py: yf, stroke: "#2d3239",
            })
          ),
          Plot.text(data,
            Plot.pointerX({
              px: d => new Date(d.date),
              py: yf,
              dy: -17,
              frameAnchor: "top-left",
              fontVariant: "tabular-nums",
              text: (d) => [
                `${display_name(d.name)}`,
                `${(yf(d) * 100).toFixed(1)}%`,
                `(${Plot.formatIsoDate(new Date(d.date))})`,
              ].join("   "),
            })
          ),
          Plot.lineY(data, {
            x: (d) => new Date(d.date),
            y: d => yf(d),
            curve: "basis",
            stroke: "color",
            strokeOpacity: (d) => {
              if ($preview) {
                return d.name === $preview.name ? 1 : 0.3;
              } else {
                return 1;
              }
            }
          }),
          Plot.text(data, Plot.selectLast({x: (d) => new Date(d.date),
            y: d => yf(d), z: "name", text: d => display_name(d.name), textAnchor: "start", dx: 5 }))
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
