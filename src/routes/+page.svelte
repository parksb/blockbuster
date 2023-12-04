<script lang="ts">
  import * as d3 from "d3";

  import { selected } from "@src/store";

  import Section from "@src/components/Section.svelte";
  import Card from "@src/components/Card.svelte";
  import List from "@src/components/List.svelte";
  import TextField from "@src/components/TextField.svelte";

  import BubbleChart from "@src/charts/BubbleChart.svelte";
  import RadarChart from "@src/charts/RadarChart.svelte";

  import type { Chain, ChainTsneMap } from "@src/data/models";
  import chains from "@src/data/blockbuster_chains.json";
  import tsne_data from "@src/data/blockbuster_chain_tsne.json";
  import {highlightBubbleChart, toBubbleChartDataMap} from "@src/charts/bubble_chart";
  import {highlightRadarChart, toRadarChartData} from "@src/charts/radar_chart";
  import Table from "@src/components/Table.svelte";

  let bubble_data = toBubbleChartDataMap(tsne_data as ChainTsneMap);
  let radar_data = toRadarChartData([]);

  let preview: Chain | null = null;
  let highlight: Chain | null = null;
  let search_query: string = "";
  let show_search_result: boolean = false;

  const vis = ["Bubble", "Table"];
  let current_vis = vis[0];

  $: {
    if (!highlight) {
      radar_data = highlightRadarChart(radar_data, () => false);
    } else { // 포커싱한 체인이 있을 때는 검색 하이라이트 무시.
      radar_data = highlightRadarChart(radar_data, (k) => k !== highlight!!.name);
      bubble_data = highlightBubbleChart(bubble_data, (k) => k !== highlight!!.name);
    }
  }

  $: {
    radar_data = toRadarChartData(preview ? [...$selected, preview] : $selected)
  }

  $: {
    if (!highlight) {
      if (show_search_result) {
        bubble_data = highlightBubbleChart(bubble_data, (k) =>
          !k.toLowerCase().includes(search_query.toLowerCase()));
      } else {
        bubble_data = highlightBubbleChart(bubble_data, () => false);
      }
    }
  }
</script>

<svelte:head>
	<title>Blockbuster</title>
</svelte:head>

<div class="root">
  <div class="side"> <h1>BLOCKBUSTER</h1>
  </div>
  <div class="main">
    <div class="header">
      <h2>Dashboard</h2>
      <div class="title-section">
        <h3>Score</h3>
        <p>Analyze and score blockchains based on on-chain data.</p>
      </div>
    </div>
    <div class="body">
      <Section title="Real-time Rapidly Chaninging Chains" --bottom="30px" />
      <Section title="Chain Ranking" --bottom="30px" --max-height="570px"
        tab_labels={vis} onTabChange={(d) => current_vis = d}>
        <Card --flex="2" --right="30px">
          {#if current_vis === vis[0]}
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
          {:else}
            <div class="table-container">
              <Table columns={Object.keys(chains['akash'])}
                rows={Object.values(chains).map(x => Object.values(x))}
                highlighted={$selected} />
            </div>
          {/if}
        </Card>
        <Card --flex="1" --max-width="300px" --direction="column">
          <RadarChart data={radar_data} />
          <div class="search-container">
            <TextField text={search_query}
              onInput={(s) => search_query = s}
              onFocus={() => show_search_result = true}
              onBlur={() => show_search_result = false}
              placeholder="Type chain name to search" />
          </div>
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
        </Card>
      </Section>
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

  .side {
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg2);
    width: 350px;
    height: 100%;
    border-right: 1px solid var(--color-line);

    & > h1 {
      font-size: 1rem;
      color: var(--color-text);
      padding: 20px;
    }
  }

  .main {
    background-color: var(--color-bg);
    width: 100%;
    height: 100%;
    padding: 10px 40px;
    overflow: auto;

    .header {
      padding: 10px 0;
      margin-bottom: 20px;

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

    div.table-container { padding: 20px; }
    div.search-container, div.list-container { padding: 0 20px; }
    div.list-container { margin: 20px 0 0 0; overflow: auto; }
  }

  :global(:root) {
    --color-emphasis: #7543ff;
    --color-main: #9d43dc;
    --color-text: #DDE0E3;
    --color-description: #98A2AE;
    --color-line: #2d3239;
    --color-bg: #13151A;
    --color-bg2: #181A20;
  }
</style>
