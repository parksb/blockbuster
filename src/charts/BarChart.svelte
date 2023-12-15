<script lang="ts">
  import * as Plot from "@observablehq/plot";

  import type {Chain} from "@src/data/models";
  import {selected, preview} from "@src/store";
  import {rankNumToColor} from "@src/utils";

  export let data: Chain[];
  export let width = 266;
  export let height = 100;

  let el: HTMLElement;

  $: {
    el?.firstChild?.remove();
    el?.append(
      Plot.plot({
        width,
        height,
        margin: 0,
        y: { label: null },
        x: { label: null },
        marks: [
          Plot.barY(data,
            {
              x: "name", y: "e_total",
              sort: {x: "y", reverse: true},
              fill: (d) => {
                if ($preview) {
                  return $preview?.name === d.name ? rankNumToColor(d.rank) : "gray";
                }
                return rankNumToColor(d.rank)
              },
              fillOpacity: (d) => {
                if ($selected.length) {
                  if ($preview?.name === d.name) {
                    return 1;
                  }
                  return ($selected.map(x => x.name).includes(d.name) ? 1 : 0.5);
                }
                return 1;
              },
            }),
        ],
      })
    );

    if (el) (el.getElementsByTagName("svg")[0]).style.backgroundColor = "var(--color-bg2)";
  }

</script>

<div class="root" bind:this={el} />

<style>
  div.root {
    background-color: var(--color-bg2);
    margin: var(--margin);
  }
</style>
