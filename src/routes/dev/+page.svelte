<script lang="ts">
  import * as Plot from "@observablehq/plot";

  import { loadChains, loadRawChains } from "@src/data/loader";

  const chain_map = loadChains();
  const raw_chain_map = loadRawChains();

  let chain_list = Object.values(chain_map);
  let raw_chain_list = Object.values(raw_chain_map);

  let decentralization_raw: HTMLElement;
  $: {
    decentralization_raw?.firstChild?.remove();
    decentralization_raw?.append(
      Plot.plot({
        width: 900,
        height: 500,
        marginBottom: 80,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 50,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(raw_chain_list,
            {x: "name", y: "e_decentralization", sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }
  let decentralization: HTMLElement;
  $: {
    decentralization?.firstChild?.remove();
    decentralization?.append(
      Plot.plot({
        width: 900,
        height: 500,
        marginBottom: 80,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 50,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(chain_list,
            {x: "name", y: "e_decentralization", sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }

  let proposal_activity: HTMLElement;
  $: {
    proposal_activity?.firstChild?.remove();
    proposal_activity?.append(
      Plot.plot({
        width: 900,
        height: 500,
        marginBottom: 80,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 50,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(chain_list,
            {x: "name", y: "e_proposal_activity",
              sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }

  let active_account_raw: HTMLElement;
  $: {
    active_account_raw?.firstChild?.remove();
    active_account_raw?.append(
      Plot.plot({
        width: 900,
        height: 500,
        marginBottom: 80,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 50,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(raw_chain_list,
            {x: "name", y: "e_active_account", sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }
  let active_account: HTMLElement;
  $: {
    active_account?.firstChild?.remove();
    active_account?.append(
      Plot.plot({
        width: 900,
        height: 800,
        marginBottom: 80,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 50,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(chain_list,
            {x: "name", y: "e_active_account",
              sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }

  let total: HTMLElement;
  $: {
    total?.firstChild?.remove();
    total?.append(
      Plot.plot({
        width: 900,
        height: 800,
        marginBottom: 80,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 50,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(chain_list,
            {x: "name", y: "e_total", sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }
</script>

<div class="root">
  <p>The number of chains: {chain_list.length}</p>

  <h1>Decentralization (Nakamoto)</h1>
  <h2>Raw</h2>
  <div bind:this={decentralization_raw} />
  <h2>Normalized</h2>
  <div bind:this={decentralization} />

  <h1>Proposal Activity</h1>
  <div bind:this={proposal_activity} />

  <h1>Active Account</h1>
  <h2>Raw</h2>
  <div bind:this={active_account_raw} />
  <h2>Normalized</h2>
  <div bind:this={active_account} />

  <h1>Total</h1>
  <div bind:this={total} />
</div>
