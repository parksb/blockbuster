<script lang="ts">
  import ExpandMore from "@src/icons/ExpandMore.svelte";
  import ExpandLess from "@src/icons/ExpandLess.svelte";

  import { selected, preview } from "@src/store";
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
  import {CHART_COLORS} from "@src/data/constants";
  import {increaseBrightness} from "@src/utils";

  let chains = loadChainsAt();

  let bubble_data = toBubbleChartDataMap(loadChainTsne(chains));
  let radar_data = toRadarChartData([]);

  let highlight: Chain | null = null;
  let search_query: string = "";
  let show_search_result: boolean = false;
  let date = "2023-11-13";
  let is_table_expanded = false;
  let show_stacked_bar = false;

  $: {
    chains = loadChainsAt(date);
  }

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
    radar_data = toRadarChartData($preview ? [...$selected, $preview] : $selected)
  }

  $: {
    $selected = $selected.map((x, i) => ({
      ...x,
      color: increaseBrightness(CHART_COLORS[i % CHART_COLORS.length], i),
    }));

    if ($preview) $preview.color = "white";
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
        bind:value={date} />
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
            <Table data={Object.values(chains)} highlighted={$selected}
              --max-height={is_table_expanded ? "auto" : "320px"}
              --margin="15px 0 0 0"
              onClick={(d) => {
                if ($selected.find((x) => x.name === d.name)) {
                  $selected = $selected.filter((x) => x.name !== d.name);
                } else {
                  $selected = [...$selected, d];
                }
              }}
              onMouseOver={(d) => { $preview = d; highlight = d }}
              onMouseOut={() => { $preview = null; highlight = null }}
            />
          {/if}
        </Card>
      </div>
      <div class="right">
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
          <div class="detail-button-container">
            <a href="/detail">
              <div class="detail-button">Click to view details</div>
            </a>
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

        &:hover {
          background-color: var(--color-bg);
        }
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
