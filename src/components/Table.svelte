<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome"
  import { faSort, faSortUp, faSortDown, faThumbtack } from "@fortawesome/free-solid-svg-icons"

  import type { Chain } from "@src/data/models";
  import SingleBar from "@src/charts/SingleBar.svelte";
  import {selected} from "@src/store";

  export let data: Chain[] = [];
  export let highlighted: Chain[] = [];

  const to_row_type = (k: string) => {
    switch (k) {
      case "name": return 0;
      case "rank": return 0;
      case "e_decentralization": return 1;
      case "e_proposal_activity": return 1;
      case "e_active_account": return 1;
      case "e_markget_cap": return 1;
    }
  };

  const label_to_column_key = (k: string) => {
    switch (k) {
      case "Name": return "name";
      case "Rank": return "rank";
      case "Decentralization": return "e_decentralization";
      case "Proposal activity": return "e_proposal_activity";
      case "Active account": return "e_active_account";
      case "Markget cap": return "e_markget_cap";
    }
    return "";
  }

  const columns = ["Pin", "Name", "Decentralization", "Proposal activity", "Active account", "Markget cap", "Rank"];
  let rows = data.map((d) => (
    { // 키 순서가 컬럼 순서와 같아야 함.
      name: d.name,
      e_decentralization: d.e_decentralization,
      e_proposal_activity: d.e_proposal_activity,
      e_active_account: d.e_active_account,
      e_markget_cap: d.e_markget_cap,
      rank: d.rank,
    } as Chain
  ));

  enum OrderBy {
    ASC,
    DESC,
  }

  let order_column_label = columns[6];
  let order_by = OrderBy.ASC;

  const changeOrder = (target: string) => {
    if (order_column_label == target) {
      order_by = order_by === OrderBy.DESC ? OrderBy.ASC : OrderBy.DESC;
    } else {
      order_by = OrderBy.DESC;
      order_column_label = target;
    }
  };

  $: {
    const key = label_to_column_key(order_column_label) as keyof Chain;
    if (order_column_label === "Pin") {
      const f = (x: Chain) => $selected.map(k => k.name).includes(x.name)
      if (order_by === OrderBy.ASC) {
        rows = [...rows.filter(x => !f(x)), ...rows.filter(f)];
      } else {
        rows = [...rows.filter(f), ...rows.filter(x => !f(x))];
      }
    } else {
      if (order_by === OrderBy.ASC) {
        rows = rows.sort((a, b) => a[key].toString().localeCompare(b[key].toString()));
      } else {
        rows = rows.sort((a, b) => b[key].toString().localeCompare(a[key].toString()));
      }
    }
  }
</script>

<table>
  <thead>
    <tr>
      {#each columns as column}
        <th>
          <span>{column}</span>
          <span class="icon" on:click={() => { changeOrder(column) }}>
            {#if order_column_label === column}
              {#if order_by === OrderBy.DESC}
                <FontAwesomeIcon icon={faSortDown} />
              {:else}
                <FontAwesomeIcon icon={faSortUp} />
              {/if}
            {:else}
              <FontAwesomeIcon icon={faSort} />
            {/if}
          </span>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        {#each [[], ...Object.entries(row)] as [key, x], i}
          {#if i === 0}
            <td class={highlighted.map(x => x.name).includes(row.name) ? "highlighted" : ""}>
              <span class="pin-icon" on:click={() => {
                if ($selected.map(x => x.name).includes(row.name)) {
                  $selected = $selected.filter(x => x.name !== row.name)
                } else {
                  $selected = [...$selected, row]
                }
              }}>
                <FontAwesomeIcon icon={faThumbtack} />
              </span>
            </td>
          {:else}
            <td>
              {#if to_row_type(key) === 0}
                {x}
              {:else}
                <div class="single-bar">
                  <SingleBar --height="20px"
                    percentage={(Number(x) * 100).toFixed(1)} />
                </div>
              {/if}
            </td>
          {/if}
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  .root {
    width: 100%;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    color: var(--color-text);
  }

  thead {
    border-bottom: 1px solid var(--color-line);
    text-align: left;

    & > tr > th {
      padding-bottom: 15px;
      color: var(--color-description);
      font-weight: 400;
      padding-right: 15px;
      min-width: max-content;
      text-align: left;

      &.num {
        text-align: right;
      }
    }

    .icon {
      font-size: 0.7rem;
      cursor: pointer;
    }
  }

  tbody {
    & > tr > td {
      padding: 10px 10px;
      min-width: max-content;

      &.num {
        text-align: right;
      }

      &.highlighted {
        color: var(--color-emphasis);
      }

      .pin-icon {
        cursor: pointer;
      }

      .single-bar {
        width: 230px;
      }
    }
  }
</style>
