<script lang="ts">
  import * as d3 from "d3";
  import Section from "@src/components/Section.svelte";
  import Card from "@src/components/Card.svelte";
  import BubbleChart from "../components/BubbleChart.svelte";
  import RadarChart from "@src/components/RadarChart.svelte";
  import type { Chain, ChainWrapper } from "../data/models";

  import tsne_data from "../data/blockbuster_chain_tsne.json";
  import chain_data from "../data/blockbuster_chains.json";
  import List from "@src/components/List.svelte";
  import TextField from "@src/components/TextField.svelte";

  const chains: ChainWrapper = chain_data;
  const chain_tsne: { [key: string]: { x: number, y: number } } = tsne_data;

  let bubble_data = Object.keys(tsne_data).map((key) => (
    {
      chain: chains[key],
      b: false,
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

  let selected: Chain[];
  $: selected = [];

  let preview: Chain | null;
  $: preview = null;

  let search_query: string;
  $: search_query = "";
  $: {
    bubble_data = bubble_data.map((d) =>
      ({ ...d, b: !d.chain.name.toLowerCase().includes(search_query.toLowerCase()) })
    )
  }
</script>

<svelte:head>
	<title>Blockbuster</title>
</svelte:head>

<div class="root">
  <div class="side">
    <h1>BLOCKBUSTER</h1>
  </div>
  <div class="main">
    <div class="header">
      <h2>Score</h2>
      <div class="title-section">
        <h3>Score</h3>
        <p>Analyze and score blockchains based on on-chain data.</p>
      </div>
    </div>
    <div class="body">
      <Section title="Real-time Rapidly Chaninging Chains" --bottom="30px" />
      <Section title="Chain Ranking" --bottom="30px">
        <Card --flex="1" --right="30px">
          <BubbleChart
            data={bubble_data}
            selected={selected}
            onClick={(e, d) => {
              if (selected.find((x) => x.name === d.chain.name)) {
                d3.select(e.target).attr("stroke", "none");
                selected = selected.filter((x) => x.name !== d.chain.name);
              } else {
                d3.select(e.target).attr("stroke", "white");
                selected = [...selected, d.chain];
              }
            }}
            onMouseOver={(e, d) => {
              preview = d.chain;
              d3.select(e.target).attr("stroke", "white");
            }}
            onMouseOut={(e, _) => {
              if (!selected.some((x) => x.name === preview?.name)) {
                d3.select(e.target).attr("stroke", "none");
              }
              preview = null;
            }}
          />
        </Card>
        <Card --direction="column">
          <RadarChart data={preview ? [...selected, preview] : selected} />
          <div class="search-container">
            <TextField text={search_query}
              onInput={(s) => search_query = s}
              placeholder="Type chain name to search" />
          </div>
          <div class="list-container">
            <List --margin="20px 0"
              data={selected.sort((a, b) => a.rank - b.rank)}
              onRemove={(d) => selected = selected.filter((x) => x.name !== d.name)}
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

    div.list-container, div.search-container {
      padding: 0 20px;
    }
  }

  :global(:root) {
    --color-emphasis: #1325AE;
    --color-main: #1e2860;
    --color-text: #DDE0E3;
    --color-description: #98A2AE;
    --color-line: #2d3239;
    --color-bg: #13151A;
    --color-bg2: #181A20;
  }
</style>
