<script lang="ts">
  import RadarChart from "@src/charts/RadarChart.svelte";
  import List from "./List.svelte";
  import {selected, preview} from "@src/store";
  import type { Chain } from "@src/data/models";
  import type {RadarChartData} from "@src/charts/radar_chart";

  export let radar_data: RadarChartData<Chain>[] = [];
</script>

<div>
  <div>
    <RadarChart data={radar_data} />
    <div class="list-container">
      <List
        data={$selected.sort((a, b) => a.rank - b.rank)}
        onRemove={(d) => {
          $selected = $selected.filter((x) => x.name !== d.name)
          if (!$selected.length || !$selected.find(x => x.name === $preview?.name)) {
            $preview = null;
          }
        }}
        onMouseOver={(d) => $preview = d}
        onMouseOut={() => $preview = null}
      />
    </div>
  </div>
  <div class="detail-button-container">
    <a href="/detail">
      <div class="detail-button">Click to view details</div>
    </a>
  </div>
</div>

<style lang="scss">
  div.list-container {
    height: 250px;
    padding: 0 20px;
    margin: 0;
    overflow: auto;
  }

  div.detail-button-container {
    padding: 20px;

    a {
      text-decoration: none;
      color: var(--color-text);
    }

    .detail-button {
      text-align: center;
      border: 1px solid var(--color-line);
      padding: 7px;

      &:hover {
        background-color: var(--color-bg);
      }
    }
  }
</style>
