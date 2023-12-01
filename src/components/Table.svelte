<script lang="ts">
  import type { Chain } from "@src/data/models";

  export let columns: string[] = [];
  export let rows: string[][] = [];
  export let highlighted: Chain[] = [];
</script>

<table>
  <thead>
    <tr>
      {#each columns as column}
        <th>{column}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr class={highlighted.map(x => x.name).includes(row[0]) ? "highlighted" : ""}>
        {#each row as cell}
          <td>{cell}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    border-collapse: collapse;
    width: 100%;
  }

  thead {
    border-bottom: 1px solid var(--color-line);
    text-align: left;

    & > tr > th {
      padding-bottom: 10px;
      color: var(--color-description);
      font-weight: 400;
    }
  }

  tbody {
    & > tr > td {
      padding: 10px 0;
    }

    & > tr.highlighted {
      background-color: var(--color-line);
    }
  }
</style>
