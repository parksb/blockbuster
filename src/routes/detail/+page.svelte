<script lang="ts">
  import * as d3 from "d3";
  import ExpandMore from "@src/icons/ExpandMore.svelte";
  import ExpandLess from "@src/icons/ExpandLess.svelte";

  import { selected } from "@src/store";
  import Card from "@src/components/Card.svelte";
  import List from "@src/components/List.svelte";

  import BubbleChart from "@src/charts/BubbleChart.svelte";
  import RadarChart from "@src/charts/RadarChart.svelte";

  import {loadChainsAt, loadChainTsne} from "@src/data/loader";
  import type {Chain} from "@src/data/models";
  import {highlightBubbleChart, toBubbleChartDataMap} from "@src/charts/bubble_chart";
  import {highlightRadarChart, toRadarChartData} from "@src/charts/radar_chart";
  import Table from "@src/components/Table.svelte";
  import TextField from "@src/components/TextField.svelte";
  import Toggle from "@src/components/Toggle.svelte";

  const chains = loadChainsAt();

  let radar_data = toRadarChartData([]);

  let preview: Chain | null = null;
  let highlight: Chain | null = null;
  let search_query: string = "";
  let show_search_result: boolean = false;
  let is_table_expanded = false;
  let show_stacked_bar = false;

  $: {
    if (!highlight) {
      radar_data = highlightRadarChart(radar_data, () => false);
    } else { // 포커싱한 체인이 있을 때는 검색 하이라이트 무시.
      radar_data = highlightRadarChart(radar_data, (k) => k !== highlight!!.name);
    }
  }

  $: {
    radar_data = toRadarChartData(preview ? [...$selected, preview] : $selected)
  }
</script>

<svelte:head>
  <title>Blockbuster</title>
</svelte:head>

<div class="root">
  <div class="main">
    <div class="header">
      <h2>Blockbuster / Score / Compare</h2>
    </div>
    <div class="body">
      <div class="left"></div>
      <div class="right">
        <TextField text={search_query}
          placeholder="Type chain name to search"
          onInput={(s) => search_query = s}
          onFocus={() => show_search_result = true}
          onBlur={() => show_search_result = false}
          --margin="0 0 10px 0" />
        <Card --direction="column" --height="100%" --justify="space-between">
          <div>
            <RadarChart data={radar_data} />
            <div class="list-container">
              <List
                data={$selected.sort((a, b) => a.rank - b.rank)}
                onRemove={(d) => {
                  $selected = $selected.filter((x) => x.name !== d.name)
                  if (!$selected.length || !$selected.find(x => x.name === highlight?.name)) {
                    highlight = null;
                  }
                }}
                onMouseOver={(d) => highlight = d}
                onMouseOut={() => highlight = null}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .root {
    font-family: sans-serif;
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
  }

  .main {
    background-color: var(--color-bg);
    width: 100%;
    height: 100%;
    padding: 10px 40px;
    overflow: auto;

    .header {
      padding: 10px 0;
      margin-bottom: 10px;

      & > h2 {
        font-size: 1rem;
        color: var(--color-text);
      }

      & > div.title-section {
        margin-top: 40px;

        h3 {
          font-size: 2rem;
          color: var(--color-text);
          margin: 0;
        }

        p {
          font-size: 1rem;
          color: var(--color-description);
          margin-top: 1rem;
        }
      }
    }

    .body {
      display: flex;
      flex-direction: row;
      margin-bottom: 30px;

      .left {
        flex: 2;
        margin-right: 20px;
        overflow: auto;
      }

      .right {
        position: sticky;
        top: 10px;
        height: 82vh;
      }
    }

    div.list-container {
      height: calc(82vh - 380px);
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
      }
    }
  }
</style>
