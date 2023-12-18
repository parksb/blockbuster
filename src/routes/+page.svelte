<script lang="ts">
  import TransitionSlide from "@src/icons/TransitionSlide.svelte";
  import StackedBarChartIcon from "@src/icons/StackedBarChart.svelte";
  import BarChartIcon from "@src/icons/BarChart.svelte";

  import { selected, preview, date } from "@src/store";
  import Card from "@src/components/Card.svelte";
  import BubbleChart from "@src/charts/BubbleChart.svelte";
  import {loadChainsAt, loadChainTsne} from "@src/data/loader";
  import {highlightBubbleChart, toBubbleChartDataMap} from "@src/charts/bubble_chart";
  import {highlightRadarChart, toRadarChartData} from "@src/charts/radar_chart";
  import Table from "@src/components/Table.svelte";
  import TextField from "@src/components/TextField.svelte";
  import {increaseLightness, lightness, rankNumToColor} from "@src/utils";
  import BarChart from "@src/charts/BarChart.svelte";
  import SideArea from "@src/components/SideArea.svelte";
  import type {Chain} from "@src/data/models";
  import StackedBarTable from "@src/components/StackedBarTable.svelte";

  let chains = loadChainsAt($date);

  let bubble_data = toBubbleChartDataMap(loadChainTsne(chains));
  let radar_data = toRadarChartData([]);

  let search_query: string = "";
  let searched_chains: Chain[] = [];

  let show_search_result: boolean = false;
  let pinned_on_top = false;
  let show_stacked_bar = false;
  let table_ratio = 1;

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
    const m: { [key: number]: boolean } = {};
    let j = 0;

    $selected = $selected.map(x => {
      if (!m[x.rank]) { j = 0; m[x.rank] = true } else { j += 1 }
      return {
        ...x,
        color: increaseLightness(rankNumToColor(x.rank), lightness($selected, x, j)),
      }
    });

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
        --width="372px"
        placeholder="Type chain name to search"
        onInput={(s) => search_query = s}
        onFocus={() => show_search_result = true}
        onBlur={() => show_search_result = false}
        --margin="0 20px 20px 0" />
      <input type="date"
        min="2023-10-01"
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
        <Card --flex={table_ratio} --overflow="auto" --padding="20px 20px 0 20px" --direction="column">
          <div class="table-util-container">
            <div class="left card-title">All Chains</div>
            <div class="right">
              <div class="mini-tab">
                <div class={table_ratio < 2 ? "" : "active-tab"}
                  on:click={() => table_ratio = 1}>
                  <TransitionSlide rotate={-90} />
                </div>
                <div class={table_ratio > 1 ? "" : "active-tab"}
                  on:click={() => table_ratio = 3}>
                  <TransitionSlide rotate={90} />
                </div>
              </div>
              <div class="mini-tab">
                <div class={show_stacked_bar ? "active-tab" : ""}
                  on:click={() => show_stacked_bar = false}>
                  <BarChartIcon />
                </div>
                <div class={show_stacked_bar ? "" : "active-tab"}
                  on:click={() => show_stacked_bar = true}>
                  <StackedBarChartIcon />
                </div>
              </div>
            </div>
          </div>
          {#if show_stacked_bar}
            <StackedBarTable data={Object.values(chains)} highlighted={searched_chains}
              pinned_on_top={pinned_on_top}
              onClick={(d) => {
                if ($selected.find((x) => x.name === d.name)) {
                  $selected = $selected.filter((x) => x.name !== d.name);
                } else {
                  $selected = [...$selected, d];
                }
              }}
              onMouseOver={(d) => { $preview = d; }}
              onMouseOut={() => { $preview = null; }}
              --margin="15px 0 0 0" />
          {:else}
            <Table data={Object.values(chains)} highlighted={searched_chains}
              --margin="15px 0 0 0"
              pinned_on_top={pinned_on_top}
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
        <Card --direction="column" --padding="20px" --margin="20px 0 0 0">
          <div class="card-title">Total Distribution</div>
          <BarChart data={Object.values(chains)} --margin="20px 0 0 0" />
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
        height: 32px;
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

      & > .left {
        display: flex;
        flex-direction: column;
        flex: 2;
        margin-right: 20px;
        overflow: auto;
      }

      & > .right {
        display: flex;
        flex-direction: column;
        top: 10px;
      }
    }

    div.table-util-container {
      width: 100%;
      color: var(--color-description);
      display: flex;
      justify-content: space-between;

      .right {
        display: flex;
        flex-direction: row;

        & > div {
          display: inline-block;
        }

        .clickable-icon {
          display: flex;
          margin-left: 5px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 1.3rem;
          padding: 3px;
          justify-content: center;
          align-items: center;
          &:hover {
            background-color: var(--color-bg);
          }
        }

        .mini-tab {
          display: flex;
          margin-left: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 2px;
          justify-content: center;
          align-items: center;
          background-color: var(--color-line);
          height: 20px;

          & > div {
            display: flex;
            width: 100%;
            height: 100%;

            &.active-tab {
              background-color: var(--color-bg2);
            }

            &:nth-child(1).active-tab {
              border-radius: 3px 0px 0px 3px;
            }

            &:nth-child(2).active-tab {
              border-radius: 0px 3px 3px 0;
            }
          }
        }
      }
    }

    .card-title {
      color: var(--color-text);
      font-weight: 700;
      font-size: 1rem;
    }
  }
</style>
