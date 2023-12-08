<script lang="ts">
  import * as d3 from "d3";
  import ExpandMore from "@src/icons/ExpandMore.svelte";
  import ExpandLess from "@src/icons/ExpandLess.svelte";

  import { selected } from "@src/store";
  import Card from "@src/components/Card.svelte";
  import List from "@src/components/List.svelte";

  import BubbleChart from "@src/charts/BubbleChart.svelte";
  import RadarChart from "@src/charts/RadarChart.svelte";

  import {loadChains, loadChainTsne} from "@src/data/loader";
  import type {Chain} from "@src/data/models";
  import {highlightBubbleChart, toBubbleChartDataMap} from "@src/charts/bubble_chart";
  import {highlightRadarChart, toRadarChartData} from "@src/charts/radar_chart";
  import Table from "@src/components/Table.svelte";
  import TextField from "@src/components/TextField.svelte";

  const chains = loadChains();

  let bubble_data = toBubbleChartDataMap(loadChainTsne());
  let radar_data = toRadarChartData([]);

  let preview: Chain | null = null;
  let highlight: Chain | null = null;
  let search_query: string = "";
  let show_search_result: boolean = false;
  let is_table_expanded = false;

  $: {
    if (!highlight) {
      radar_data = highlightRadarChart(radar_data, () => false);

      if (show_search_result) {
        bubble_data = highlightBubbleChart(bubble_data, (k) =>
          !k.toLowerCase().includes(search_query.toLowerCase()));
      } else {
        bubble_data = highlightBubbleChart(bubble_data, () => false);
      }
    } else { // 포커싱한 체인이 있을 때는 검색 하이라이트 무시.
      radar_data = highlightRadarChart(radar_data, (k) => k !== highlight!!.name);
      bubble_data = highlightBubbleChart(bubble_data, (k) => k !== highlight!!.name);
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
      <h2>Blockbuster / Score</h2>
    </div>
    <div class="body">
      <div class="left">
        <Card --height="400px" --margin="0 0 30px 0">
          <BubbleChart
            data={bubble_data}
            selected={$selected}
            onClick={(e, d) => {
              if ($selected.find((x) => x.name === d.data.name)) {
                d3.select(e.target).attr("stroke", "none");
                $selected = $selected.filter((x) => x.name !== d.data.name);
              } else {
                d3.select(e.target).attr("stroke", "white");
                $selected = [...$selected, d.data];
              }
            }}
            onMouseOver={(e, d) => {
              preview = d.data;
              d3.select(e.target).attr("stroke", "white");
            }}
            onMouseOut={(e, _) => {
              if (!$selected.some((x) => x.name === preview?.name)) {
                d3.select(e.target).attr("stroke", "none");
              }
              preview = null;
            }}
          />
        </Card>
        <Card --overflow="auto" --padding="0 20px 0 20px" --direction="column">
          <Table data={Object.values(chains)} highlighted={$selected}
            --max-height={is_table_expanded ? "auto" : "372px"} />
          <button class="expand-button" on:click={() => is_table_expanded = !is_table_expanded}>
            {#if is_table_expanded}
              <ExpandLess />
            {:else}
              <ExpandMore />
            {/if}
          </button>
        </Card>
      </div>
      <div class="right">
        <TextField text={search_query}
          placeholder="Type chain name to search"
          onInput={(s) => search_query = s}
          onFocus={() => show_search_result = true}
          onBlur={() => show_search_result = false}
          --margin="0 0 10px 0" />
        <Card --direction="column" --height="100%">
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
            <div class="detail-button-container">
              <a href="/compare">
                <div class="detail-button">Click to view details</div>
              </a>
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
      margin-bottom: 50px;

      .left {
        flex: 2;
        margin-right: 20px;
        overflow: auto;
      }

      .right {
        position: sticky;
        top: 10px;
        height: 80vh;
      }
    }

    div.table-container { width: 100%; height: 100px; overflow: auto; }

    div.list-container {
      padding: 0 20px;
      margin: 0;
      overflow: auto;
      max-height: 20%;
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

  button.expand-button {
    width: 100%;
    background-color: var(--color-bg2);
    border: 0;
    text-align: center;
    color: var(--color-text);
    font-size: 1.4rem;
    padding: 15px 0 10px 0;
    cursor: pointer;
  }
</style>
