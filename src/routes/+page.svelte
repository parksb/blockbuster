<script lang="ts">
  import * as d3 from "d3";

  import { selected } from "@src/store";
  import Section from "@src/components/Section.svelte";
  import Card from "@src/components/Card.svelte";
  import List from "@src/components/List.svelte";

  import BubbleChart from "@src/charts/BubbleChart.svelte";
  import RadarChart from "@src/charts/RadarChart.svelte";

  import {loadChains, loadChainTsne} from "@src/data/loader";
  import type {Chain} from "@src/data/models";
  import {highlightBubbleChart, toBubbleChartDataMap} from "@src/charts/bubble_chart";
  import {highlightRadarChart, toRadarChartData} from "@src/charts/radar_chart";
  import Table from "@src/components/Table.svelte";

  const chains = loadChains();

  let bubble_data = toBubbleChartDataMap(loadChainTsne());
  let radar_data = toRadarChartData([]);

  let preview: Chain | null = null;
  let highlight: Chain | null = null;
  let search_query: string = "";
  let show_search_result: boolean = false;

  const vis = ["Bubble", "Table"];

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
      <Section title="Chain Ranking" --bottom="60px" --max-height="570px"
        text_field={{
          text: search_query,
          onTextFieldInput: (s) => search_query = s,
          onTextFieldFocus: () => show_search_result = true,
          onTextFieldBlur: () => show_search_result = false
        }}
        --text-field-max-width="300px"
      >
        <Card --flex="2" --right="30px">
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
        <div class="radar-container">
          <Card --flex="1" --max-width="300px" --direction="column">
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
          </Card>
        </div>
      </Section>
      <Section title="Table">
        <div class="table-container">
          <Table columns={Object.keys(chains['akash'])}
            rows={Object.values(chains).map(x => Object.values(x))}
            highlighted={$selected} />
        </div>
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

    div.table-container { width: 100%; overflow: auto; }
    div.list-container { padding: 0 20px; }
    div.list-container { margin: 0; overflow: auto; }
  }
</style>
