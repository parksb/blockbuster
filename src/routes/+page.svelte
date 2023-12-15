<script lang="ts">
  import { selected, preview, date } from "@src/store";
  import Card from "@src/components/Card.svelte";
  import BubbleChart from "@src/charts/BubbleChart.svelte";
  import {loadChainsAt, loadChainTsne} from "@src/data/loader";
  import {highlightBubbleChart, toBubbleChartDataMap} from "@src/charts/bubble_chart";
  import {highlightRadarChart, toRadarChartData} from "@src/charts/radar_chart";
  import Table from "@src/components/Table.svelte";
  import TextField from "@src/components/TextField.svelte";
  import Toggle from "@src/components/Toggle.svelte";
  import {CHART_COLORS} from "@src/data/constants";
  import {increaseBrightness} from "@src/utils";
  import BarChart from "@src/charts/BarChart.svelte";
  import SideArea from "@src/components/SideArea.svelte";
  import type {Chain} from "@src/data/models";

  let chains = loadChainsAt($date);

  let bubble_data = toBubbleChartDataMap(loadChainTsne(chains));
  let radar_data = toRadarChartData([]);

  let search_query: string = "";
  let searched_chains: Chain[] = [];

  let show_search_result: boolean = false;
  let is_table_expanded = false;
  let show_stacked_bar = false;

  $: {
    chains = loadChainsAt($date);
    $selected = $selected.map(x => chains[x.name]);
    $preview = $preview ? chains[$preview.name] : null || null;
  }

  $: {
    if (!$preview) {
      radar_data = highlightRadarChart(radar_data, () => false);

      if (show_search_result) {
        bubble_data = highlightBubbleChart(bubble_data, (k) =>
          !k.toLowerCase().includes(search_query.toLowerCase()));
      } else {
        bubble_data = highlightBubbleChart(bubble_data, () => false);
      }
    } else { // 포커싱한 체인이 있을 때는 검색 하이라이트 무시.
      radar_data = highlightRadarChart(radar_data, (k) => k !== $preview!!.name);
      bubble_data = highlightBubbleChart(bubble_data, (k) => k !== $preview!!.name);
    }
  }

  $: {
    radar_data = toRadarChartData($preview ? [...$selected, $preview] : $selected)
  }

  $: {
    $selected = $selected.map((x, i) => ({
      ...x,
      color: increaseBrightness(CHART_COLORS[i % CHART_COLORS.length], i),
    }));

    if ($preview) $preview.color = "white";
  }

  $: {
    if (show_search_result) {
      if (search_query) {
        searched_chains = Object.values(chains).filter((x) =>
          x.name.toLowerCase().includes(search_query.toLowerCase()));
      } else {
        searched_chains = [];
      }
    } else {
      searched_chains = [];
    }
  }
</script>

<svelte:head>
  <title>Blockbuster</title>
</svelte:head>

<div class="root">
  <div class="main">
    <div class="header">
      <h2><a href="/">Blockbuster</a> / <a href="/">Score</a></h2>
    </div>
    <div class="top">
      <TextField text={search_query}
        --width="400px"
        placeholder="Type chain name to search"
        onInput={(s) => search_query = s}
        onFocus={() => show_search_result = true}
        onBlur={() => show_search_result = false}
        --margin="0 20px 20px 0" />
      <input type="date"
        min="2023-10-30"
        max="2023-11-13"
        bind:value={$date} />
    </div>
    <div class="body">
      <div class="left">
        <Card --flex="1" --margin="0 0 20px 0" --overflow="hidden">
          <BubbleChart
            data={bubble_data}
            onClick={(d) => {
              if ($selected.find((x) => x.name === d.data.name)) {
                $selected = $selected.filter((x) => x.name !== d.data.name);
              } else {
                $selected = [...$selected, d.data];
              }
            }}
            onMouseOver={(d) => { $preview = d.data }}
            onMouseOut={() => { $preview = null }}
          />
        </Card>
        <Card --flex="1" --overflow="auto" --padding="20px 20px 0 20px" --direction="column">
          <div class="table-toggle-container">
            <div>View stacked bar</div>
            <Toggle checked={show_stacked_bar} onChange={() => show_stacked_bar = !show_stacked_bar} />
          </div>
          {#if show_stacked_bar}
            <!-- <StackedBarTable data={Object.values(chains)} highlighted={$selected} -->
            <!--   --max-height={is_table_expanded ? "auto" : "300px"} -->
            <!--   --margin="15px 0 0 0" /> -->
          {:else}
            <Table data={Object.values(chains)} highlighted={searched_chains}
              --max-height={is_table_expanded ? "auto" : "320px"}
              --margin="15px 0 0 0"
              onClick={(d) => {
                if ($selected.find((x) => x.name === d.name)) {
                  $selected = $selected.filter((x) => x.name !== d.name);
                } else {
                  $selected = [...$selected, d];
                }
              }}
              onMouseOver={(d) => { $preview = d; }}
              onMouseOut={() => { $preview = null; }}
            />
          {/if}
        </Card>
      </div>
      <div class="right">
        <Card --direction="column" --flex="1" --justify="space-between">
          <SideArea radar_data={radar_data} />
        </Card>
        <Card --padding="20px" --margin="20px 0 0 0">
          <BarChart data={Object.values(chains)} />
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
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg);
    width: 100%;
    height: 100%;
    padding: 10px 40px;
    overflow: auto;

    .header {
      padding: 10px 0;
      margin-bottom: 10px;

      & > h2 {
        &, & > a {
          text-decoration: none;
          font-size: 1rem;
          color: var(--color-text);
        }
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

    .top {
      display: flex;
      flex-direction: row;

      input {
        height: 30px;
        background-color: var(--color-bg2);
        border: 1px solid var(--color-line);
        color: var(--color-description);
        padding: 0 5px;
      }
    }

    .body {
      display: flex;
      flex-direction: row;
      margin-bottom: 40px;
      height: calc(100% - 175px);

      .left {
        display: flex;
        flex-direction: column;
        flex: 2;
        margin-right: 20px;
        overflow: auto;
      }

      .right {
        display: flex;
        flex-direction: column;
        top: 10px;
      }
    }

    div.table-toggle-container {
      width: 100%;
      color: var(--color-description);
      display: flex;
      justify-content: flex-end;

      & > div {
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
</style>
