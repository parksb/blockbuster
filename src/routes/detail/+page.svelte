<script lang="ts">
  import { selected, preview, date } from "@src/store";
  import Card from "@src/components/Card.svelte";

  import {loadChainsBetween, loadChainsAt} from "@src/data/loader";
  import {highlightRadarChart, toRadarChartData} from "@src/charts/radar_chart";
  import SimpleTable from "@src/components/SimpleTable.svelte";
  import TextField from "@src/components/TextField.svelte";
  import {dates_between, increaseBrightness, lightness, rankNumToColor} from "@src/utils";
  import BarChart from "@src/charts/BarChart.svelte";
  import SideArea from "@src/components/SideArea.svelte";
  import LineChart from "@src/charts/LineChart.svelte";
  import {type Chain, type ChainMap} from "@src/data/models";
  import BumpChart from "@src/charts/BumpChart.svelte";
  import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte";
  import { RadioGroupItem } from "@src/components/radio_group";
  import RadioGroup from "@src/components/RadioGroup.svelte";

  let chains = loadChainsAt($date);

  let from_date = "2023-11-01";
  let to_date = $date;
  $: $date = to_date;

  let chain_maps: ChainMap[] = [];
  $: chain_maps = loadChainsBetween(from_date, to_date);

  let radar_data = toRadarChartData([]);

  let search_query: string = "";
  let show_search_result: boolean = false;
  let searched_chains: Chain[] = [];

  let current_e = RadioGroupItem.TOTAL;

  $: {
    chains = loadChainsAt($date);
    $selected = $selected.map(x => chains[x.name]);
    $preview = $preview ? chains[$preview.name] : null || null;
  }

  $: {
    if (!$preview) {
      radar_data = highlightRadarChart(radar_data, () => false);
    } else { // 포커싱한 체인이 있을 때는 검색 하이라이트 무시.
      radar_data = highlightRadarChart(radar_data, (k) => k !== $preview!!.name);
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
        color: increaseBrightness(rankNumToColor(x.rank), lightness($selected, x, j)),
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
      <div class="back-icon">
        <a href="/"><ChevronLeft /></a>
      </div>
      <h2><a href="/">Blockbuster</a> / <a href="/">Score</a> / Details</h2>
    </div>
    <div class="top">
      <TextField text={search_query}
        --width="350px"
        placeholder="Type chain name to search"
        onInput={(s) => search_query = s}
        onFocus={() => show_search_result = true}
        onBlur={() => show_search_result = false}
        --margin="0 20px 20px 0" />
      <input type="date"
        min="2023-10-01"
        max={to_date}
        bind:value={from_date}
        style="margin:0 5px 0 0" />
      <span style="color: var(--color-description); line-height: 2rem">―</span>
      <input type="date"
        min={from_date}
        max="2023-11-13"
        bind:value={to_date}
        style="margin:0 0 0 5px" />
      <RadioGroup --margin="0 0 20px 20px"
        value={current_e}
        onChange={(e) => current_e = e.currentTarget.value} />
    </div>
    <div class="body">
      <div class="left">
        <Card --flex="1" --margin="0" --padding="5px 20px" --overflow="hidden">
          <SimpleTable data={Object.values(chains)} highlighted={searched_chains}
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
        </Card>
      </div>
      <div class="center">
        <Card --margin="0 0 20px 0" --padding="20px" --overflow="hidden">
          <LineChart data_maps={chain_maps} yf={(d) => d[`e_${current_e}`]} />
        </Card>
        <Card --padding="20px">
          <BumpChart data_maps={chain_maps} dates={dates_between(from_date, to_date)}
            gf={(x) => x[0][`e_${current_e}`]}
            key={`e_${current_e}`} />
        </Card>
      </div>
      <div class="right">
        <Card --direction="column" --flex="1" --justify="space-between">
          <SideArea radar_data={radar_data} show_detail_button={false} />
        </Card>
        <Card --direction="column" --padding="20px" --margin="20px 0 0 0">
          <div class="card-title">Total Distribution</div>
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
      display: flex;
      padding: 10px 0;
      margin-bottom: 10px;
      align-items: center;

      & > .back-icon {
        height: 1.5rem;

        & > a {
          color: var(--color-text);
          font-size: 1.5rem;
        }
      }

      & > h2 {
        &, & > a {
          font-size: 1rem;
          color: var(--color-text);
          text-decoration: none;
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

      .left {
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        overflow: auto;
      }

      .center {
        display: flex;
        flex-direction: column;
        flex: 1;
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

    .card-title {
      color: var(--color-text);
      font-weight: 700;
      font-size: 1rem;
    }
  }
</style>
