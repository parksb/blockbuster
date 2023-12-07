<script lang="ts">
  import * as Plot from "@observablehq/plot";

  import { loadChains } from "@src/data/loader";

  const chain_map = loadChains();
  let chain_list = Object.values(chain_map);

  const normalize = (x: number, min: number, max: number) => {
    return (x - min) / (max - min);
  };

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
          Plot.barY(chain_list,
            {x: "name", y: (x) => x.e_decentralization, sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }
  const min_decentralization = Math.min(...chain_list.map((x) => x.e_decentralization));
  const max_decentralization = Math.max(...chain_list.map((x) => x.e_decentralization));
  chain_list = chain_list.map((x) => {
    return { ...x, normalized_decentralization: normalize(x.e_decentralization, min_decentralization, max_decentralization) };
  });
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
            {x: "name", y: (x) => x.normalized_decentralization, sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }

  const min_proposal_activity = Math.min(...chain_list.map((x) => x.e_proposal_activity));
  const max_proposal_activity = Math.max(...chain_list.map((x) => x.e_proposal_activity));
  chain_list = chain_list.map((x) => {
    return { ...x, normalized_proposal_activity: normalize(x.e_proposal_activity, min_proposal_activity, max_proposal_activity) };
  })
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
            {x: "name", y: (x) => x.normalized_proposal_activity,
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
          Plot.barY(chain_list,
            {x: "name", y: (x) => x.e_active_account, sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }
  let min_active_account = Math.min(...chain_list.map((x) => x.e_active_account));
  let max_active_account = Math.max(...chain_list.map((x) => x.e_active_account));
  chain_list = chain_list.map((x) => {
    return { ...x, normalized_active_account: normalize(x.e_active_account, min_active_account, max_active_account) };
  });
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
            {x: "name", y: (x) => x.normalized_active_account,
              sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }

  const normalized_chain_list = (chain_list as any).map((x: any) => {
    return {
      ...x, total: x.normalized_decentralization +
        x.normalized_proposal_activity +
        x.normalized_active_account,
    }
  })
  const min_total = Math.min(...normalized_chain_list.map((x: any) => x.total));
  const max_total = Math.max(...normalized_chain_list.map((x: any) => x.total));
  chain_list = normalized_chain_list.map((x: any) => {
    return { ...x, normalized_total: normalize(x.total, min_total, max_total) };
  });

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
            {x: "name", y: (x) => x.normalized_total, sort: {x: "y", reverse: true}}),
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
