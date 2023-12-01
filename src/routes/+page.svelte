<script lang="ts">
  import * as d3 from "d3";
  import Card from "@src/components/Card.svelte";
  import Table from "@src/components/Table.svelte";
  import BubbleChart from "../components/BubbleChart.svelte";
  import tsne_data from "../data/blockbuster_chain_tsne.json";
  import chain_data from "../data/blockbuster_chains.json";
  import RadarChart from "@src/components/RadarChart.svelte";
  import type { Chain } from "../data/models";

  const bubble_data = Object.keys(tsne_data).map((key) => (
    {
      chain: chain_data[key],
      x: (tsne_data[key].x + 1) / 2,
      y: (tsne_data[key].y + 1) / 2,
      r: (
        chain_data[key].ev_activity +
        chain_data[key].ev_decentralization +
        chain_data[key].ev_proposal +
        chain_data[key].ev_relayer_exchange +
        chain_data[key].ev_relayer_account
      ) * 7,
    }
  ));

  const table_data = Object.keys(chain_data).map((key) => (
    [
      chain_data[key].name,
      chain_data[key].ev_activity,
      chain_data[key].ev_decentralization,
      chain_data[key].ev_proposal,
      chain_data[key].ev_relayer_exchange,
      chain_data[key].ev_relayer_account
    ]
  ));

  let selected: Chain[];
  $: selected = [];
</script>

<svelte:head>
	<title>Blockbuster</title>
</svelte:head>

<div class="root">
  <div class="main">
    <div class="header">
      <h2>Blockbuster</h2>
    </div>
    <div class="body">
      <Card title="T-SNE" --marginBottom="30px">
        <BubbleChart
          data={bubble_data}
          onClick={(e, d) => {
            if (selected.map(x => x.name).includes(d.chain.name)) {
              d3.select(e.target).attr("stroke", "none");
              selected = selected.filter((x) => x.name !== d.chain.name);
            } else {
              d3.select(e.target).attr("stroke", "black");
              selected = [...selected, d.chain]
            }
          }}
        />
      </Card>
      <Card title="List" --marginBottom="50px">
        <Table
          columns={["Name", "Activity", "Decentralization", "Proposal", "Relayer Exchange", "Relayer Account"]}
          rows={table_data}
          highlighted={selected}
        />
      </Card>
    </div>
  </div>
  <div class="side">
    <RadarChart data={selected} />
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
    align-items: center;
    flex-direction: column;
    background-color: var(--color-white);
    width: 400px;
    height: 100%;
    border-left: 1.5px solid var(--color-line);
    padding: 15px;
  }

  .main {
    background-color: var(--color-bg);
    width: 100%;
    height: 100%;
    padding: 10px 40px;
    overflow: auto;

    .header {
      & > h2 {
        color: var(--color-main);
      }
    }
  }

  :global(:root) {
    --color-emphasis: #1325AE;
    --color-main: #1e2860;
    --color-description: #8f94b0;
    --color-line: #e1e6eb;
    --color-bg: #fafbfc;
    --color-white: #ffffff;
  }
</style>
