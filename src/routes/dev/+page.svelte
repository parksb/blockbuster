<script lang="ts">
  import * as Plot from "@observablehq/plot";

  import { loadChains } from "@src/data/loader";

  const chain_map = loadChains();
  const chain_list = Object.values(chain_map);

  const normalize = (x: number, min: number, max: number) => {
    return (x - min) / (max - min);
  };

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
            {x: "name", y: "e_proposal_activity", sort: {x: "y", reverse: true}}),
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
            {x: "name", y: "e_active_account", sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }

  const normalized_chain_list = chain_list.map((x) => (
    { ...x, total: x.e_decentralization + x.e_proposal_activity + x.e_active_account }
  ));
  const min_total = Math.min(...normalized_chain_list.map((x) => x.total));
  const max_total = Math.max(...normalized_chain_list.map((x) => x.total));

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
          Plot.barY(normalized_chain_list,
            {x: "name", y: (x) => normalize(x.total, min_total, max_total), sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }
</script>

<div class="root">
  <p>The number of chains: {chain_list.length}</p>

  <h1>Decentralization (Nakamoto)</h1>
  <div bind:this={decentralization} />

  <h1>Proposal Activity (%)</h1>
  <div bind:this={proposal_activity} />

  <h1>Active Account</h1>
  <div bind:this={active_account} />

  <h1>Total (Normalized)</h1>
  <div bind:this={total} />
</div>
