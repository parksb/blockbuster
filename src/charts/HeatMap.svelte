<script lang="ts">
  import * as Plot from "@observablehq/plot";

  import type {Chain} from "@src/data/models";

  export let data: Chain[] = [];

  export let width = 520;
  export let height = 520;

  let el: HTMLElement;

  $: {
    const matrix: any[] = [];
    for (const d of data) {
      for (const t of data) {
        matrix.push({ n: d.name, m: t.name, v: Math.abs(d.e_total - t.e_total)});
      }
    }

    el?.firstChild?.remove();
    el?.append(
      Plot.plot({
        color: { scheme: 'plasma' },
        width,
        height,
        marginLeft: 60,
        marginBottom: 60,
        y: { label: null },
        x: { label: null, tickRotate: 45 },
        marks: [
          Plot.cell(matrix, {x: "n", y: "m", fill: "v", inset: 0.5}),
          (Math.sqrt(matrix.length)) < 9 ? Plot.text(matrix, {
            x: "n", y: "m", text: d => `${(d.v * 100).toFixed(1)}%p`, fill: "white",
          }) : null,
        ],
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
