<script lang="ts">
  import * as Plot from "@observablehq/plot";

  import { loadChainsAt, loadRawChains } from "@src/data/loader";
  import {all_chains_at, rankNumToColor} from "@src/utils";

  let date = "2023-11-13";
  const hide = ["cerberus", "kujira", "sifchain", "konstellation"];
  // const hide: string[] = [];

  let chain_map = loadChainsAt();
  let chain_list = Object.values(chain_map)
    .filter(x => !hide.includes(x.name));

  const raw_chain_map = loadRawChains();

  $: {
    chain_map = loadChainsAt(date);
    chain_list = Object.values(chain_map).filter(x => !hide.includes(x.name));
  }

  let raw_chain_list = all_chains_at(raw_chain_map, "2023-11-13")
    .filter(x => !hide.includes(x.name));

  let chain_list_timeseries = Object.values(raw_chain_map)
    // .slice(0, 10)
    .flatMap(x => Object.values(x))
    .filter(x => !hide.includes(x.name));

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
  let decentralization_timeseries: HTMLElement;
  $: {
    decentralization_timeseries?.firstChild?.remove();
    decentralization_timeseries?.append(
      Plot.plot({
        style: "overflow: visible;",
        width: 900,
        height: 500,
        y: {grid: true},
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(chain_list_timeseries, {x: (d) => new Date(d.date), y: "e_decentralization", stroke: "name"}),
          Plot.text(chain_list_timeseries, Plot.selectLast({x: (d) => new Date(d.date), y: "e_decentralization", z: "name", text: "name", textAnchor: "start", dx: 850 }))
        ]
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
  let active_account_timeseries: HTMLElement;
  $: {
    active_account_timeseries?.firstChild?.remove();
    active_account_timeseries?.append(
      Plot.plot({
        style: "overflow: visible;",
        width: 900,
        height: 500,
        y: {grid: true},
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(chain_list_timeseries, {x: (d) => new Date(d.date), y: "e_active_account", stroke: "name"}),
          Plot.text(chain_list_timeseries, Plot.selectLast({x: (d) => new Date(d.date), y: "e_active_account", z: "name", text: "name", textAnchor: "start", dx: 850 }))
        ]
      })
    );
  }

  let market_cap: HTMLElement;
  $: {
    market_cap?.firstChild?.remove();
    market_cap?.append(
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
            {x: "name", y: "e_market_cap", sort: {x: "y", reverse: true}}),
        ],
      })
    );
  }
  let market_cap_timeseries: HTMLElement;
  $: {
    market_cap_timeseries?.firstChild?.remove();
    market_cap_timeseries?.append(
      Plot.plot({
        style: "overflow: visible;",
        width: 900,
        height: 500,
        y: {grid: true},
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(chain_list_timeseries, {x: (d) => new Date(d.date), y: "e_market_cap", stroke: "name"}),
          Plot.text(chain_list_timeseries, Plot.selectLast({x: (d) => new Date(d.date), y: "e_market_cap", z: "name", text: "name", textAnchor: "start", dx: 850 }))
        ]
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
            {x: "name", y: "e_total", sort: {x: "y", reverse: true}, fill: d => rankNumToColor(d.rank)}),
        ],
      })
    );
  }
  let total_timeseries: HTMLElement;
  $: {
    total_timeseries?.firstChild?.remove();
    total_timeseries?.append(
      Plot.plot({
        style: "overflow: visible;",
        width: 900,
        height: 500,
        y: {grid: true},
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(chain_list_timeseries, {x: (d) => new Date(d.date), y: "e_total", stroke: "name"}),
          Plot.text(chain_list_timeseries, Plot.selectLast({x: (d) => new Date(d.date), y: "e_total", z: "name", text: "name", textAnchor: "start", dx: 850 }))
        ]
      })
    );
  }
  let total_histogram: HTMLElement;
  const rank_count: { [key: number]: number } = {};
  for (const chain of chain_list) {
    rank_count[chain.rank] = (rank_count[chain.rank] || 0) + 1;
  }
  $: {
    total_histogram?.firstChild?.remove();
    total_histogram?.append(
      Plot.plot({
        width: 900,
        height: 800,
        marginBottom: 80,
        y: {
          grid: true,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(Object.entries(rank_count),
            {x: d => d[0], y: d => d[1], fill: d => rankNumToColor(Number(d[0]))}),
        ],
      })
    );
  }
</script>

<div class="root">
  <div style="top: 0; background-color: black; color: white; position: fixed; width: 100%;">
    <span>The number of chains: {chain_list.length}</span>
    <input type="date" bind:value={date} />
  </div>
  <div>
    <h1>Decentralization (Nakamoto)</h1>
    <h2>Raw</h2>
    <div bind:this={decentralization_raw} />
    <div bind:this={decentralization_timeseries} />
    <h2>Normalized</h2>
    <div bind:this={decentralization} />

    <h1>Proposal Activity</h1>
    <div bind:this={proposal_activity} />

    <h1>Active Account</h1>
    <h2>Raw</h2>
    <div bind:this={active_account_raw} />
    <div bind:this={active_account_timeseries} />

    <h2>Normalized</h2>
    <div bind:this={active_account} />

    <h1>Market cap.</h1>
    <div bind:this={market_cap} />
    <div bind:this={market_cap_timeseries} />

    <h1>Total</h1>
    <h2>Normalized</h2>
    <div bind:this={total} />
    <div bind:this={total_timeseries} />
    <div bind:this={total_histogram} />
  </div>
</div>
