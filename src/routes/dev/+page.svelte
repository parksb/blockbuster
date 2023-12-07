<script lang="ts">
  import * as Plot from "@observablehq/plot";

  import { loadChains } from "@src/data/loader";

  const chain_map = loadChains();
  const chain_list = Object.values(chain_map);

  let decentralization: HTMLElement;
  $: {
    decentralization?.firstChild?.remove();
    decentralization?.append(
      Plot.plot({
        width: 900,
        height: 500,
        marginBottom: 50,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 90,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(chain_list,
            {x: "name", y: "e_decentralization", sort: {x: "y", reverse: true}}),
          Plot.text(chain_list, Plot.pointerY({ x: 'x', y: 'y', text: (d) => `${d.e_decentralization}` })),
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
        marginBottom: 50,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 90,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(chain_list,
            {x: "name", y: "e_proposal_activity", sort: {x: "y", reverse: true}}),
          Plot.text(chain_list, Plot.pointerY({ x: 'x', y: 'y', text: (d) => `${d.e_proposal_activity}` })),
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
        marginBottom: 130,
        y: {
          grid: true,
        },
        x: {
          tickRotate: 90,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(chain_list,
            {x: "name", y: "e_active_account", sort: {x: "y", reverse: true}}),
          Plot.text(chain_list, Plot.pointerY({ x: 'x', y: 'y', text: (d) => `${d.e_active_account}` })),
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
</div>
