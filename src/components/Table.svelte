<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome"
  import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons"

  import type { Chain } from "@src/data/models";

  export let columns: string[] = [];
  export let rows: (string | number)[][] = [];
  export let highlighted: Chain[] = [];

  enum OrderBy {
    ASC,
    DESC,
  }

  let order_target = columns[0];
  let order_by = OrderBy.DESC;

  const changeOrder = (target: string) => {
    if (order_target == target) {
      order_by = order_by === OrderBy.DESC ? OrderBy.ASC : OrderBy.DESC;
    } else {
      order_by = OrderBy.DESC;
      order_target = target;
    }

    sortBy(target);
  };

  const sortBy = (target: string) => {
    const idx = columns.indexOf(target);
    if (order_by === OrderBy.ASC) {
      rows = rows.sort((a, b) => a[idx].toString().localeCompare(b[idx].toString()));
    } else {
      rows = rows.sort((a, b) => b[idx].toString().localeCompare(a[idx].toString()));
    }

  };
</script>

<table>
  <thead>
    <tr>
      {#each columns as column, i}
        <th class={typeof rows[0][i] === "number" ? "num" : ""}>
          <span>{column}</span>
          <span class="icon" on:click={() => { changeOrder(column) }}>
            {#if order_target === column}
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
      <tr class={highlighted.map(x => x.name).includes(row[0].toString()) ? "highlighted" : ""}>
        {#each row as cell}
          <td class={typeof cell === "number" ? "num" : ""}>{cell}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    border-collapse: collapse;
    width: 100%;
    color: var(--color-text);
  }

  thead {
    border-bottom: 1px solid var(--color-line);
    text-align: left;

    & > tr > th {
      padding-bottom: 10px;
      color: var(--color-text);
      font-weight: 400;
      min-width: max-content;

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
      padding: 10px 0;
      min-width: max-content;

      &.num {
        text-align: right;
      }
    }

    & > tr.highlighted {
      background-color: var(--color-line);
    }
  }
</style>
