<script lang="ts">
  import * as d3 from "d3";
  import Card from "@src/components/Card.svelte";
  import Table from "@src/components/Table.svelte";
  import BubbleChart from "../components/BubbleChart.svelte";
  import RadarChart from "@src/components/RadarChart.svelte";
  import type { Chain, ChainWrapper } from "../data/models";

  import tsne_data from "../data/blockbuster_chain_tsne.json";
  import chain_data from "../data/blockbuster_chains.json";

  const chains: ChainWrapper = chain_data;
  const chain_tsne: { [key: string]: { x: number, y: number } } = tsne_data;

  const bubble_data = Object.keys(tsne_data).map((key) => (
    {
      chain: chains[key],
      x: (chain_tsne[key].x + 1) / 2,
      y: (chain_tsne[key].y + 1) / 2,
      r: (
        chains[key].ev_activity +
        chains[key].ev_decentralization +
        chains[key].ev_proposal +
        chains[key].ev_relayer_exchange +
        chains[key].ev_relayer_account
      ),
    }
  ));

  const table_columns = ["Name", "Activity", "Decentralization", "Proposal", "Relayer Exchange", "Relayer Account"];
  const table_rows = Object.keys(chain_data).map((key) => (
    [
      chains[key].name,
      chains[key].ev_activity,
      chains[key].ev_decentralization,
      chains[key].ev_proposal,
      chains[key].ev_relayer_exchange,
      chains[key].ev_relayer_account,
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
          columns={table_columns}
          rows={table_rows}
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
    background-color: var(--color-bg2);
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
    --color-bg2: #ffffff;
    --color-white: #ffffff;
  }
</style>
