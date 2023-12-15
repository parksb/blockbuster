<script lang="ts">
  import Pin from "svelte-material-icons/Pin.svelte";

  import {display_name, display_rank} from "@src/utils";
  import {cdn_url} from "@src/data/constants";
  import {OrderBy, type Chain} from "@src/data/models";
  import SingleBar from "@src/charts/SingleBar.svelte";
  import {selected} from "@src/store";
  import SortIcon from "./SortIcon.svelte";

  export let data: Chain[] = [];
  export let highlighted: Chain[] = [];

  export let onMouseOver: (d: Chain) => void;
  export let onMouseOut: () => void;
  export let onClick: (d: Chain) => void;

  const label_to_column_key = (k: string) => {
    switch (k) {
      case "Name": return "name";
      case "Rank": return "rank";
      case "Decentralization": return "e_decentralization";
      case "Proposal activity": return "e_proposal_activity";
      case "Active account": return "e_active_account";
      case "Market cap": return "e_market_cap";
    }
    return "";
  }

  const key_to_bar_color = (k: string) => {
    switch (k) {
      case "e_decentralization": return "var(--color-pink)";
      case "e_proposal_activity": return "var(--color-orange)";
      case "e_active_account": return "var(--color-blue)";
      case "e_market_cap": return "var(--color-emerald)";
    }

    return "var(--color-emphasis)";
  }

  const columns = ["Pin", "Name", "Decentralization", "Proposal activity", "Active account", "Market cap", "Rank"];
  let rows: Chain[] = [];
  $: {
    rows = data.map((d) => (
      { // 키 순서가 컬럼 순서와 같아야 함.
        name: d.name,
        e_decentralization: d.e_decentralization,
        e_proposal_activity: d.e_proposal_activity,
        e_active_account: d.e_active_account,
        e_market_cap: d.e_market_cap,
        rank: d.rank,
        // 이하로는 미노출
        color: d.color,
        e_total: d.e_total,
      } as Chain
    ));
  }

  let order_column_label = columns[6];
  let order_by = OrderBy.DESC;
  let pin_state = 0;

  const onClickGlobalPin = () => {
    if (pin_state) {
      $selected = [];
    } else {
      $selected = rows;
    }
  }

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
    const pinf = (x: Chain) => $selected.map(k => k.name).includes(x.name);

    if (key === "rank") {
      if (order_by === OrderBy.ASC) {
        rows = rows.sort((a, b) => a.e_total - b.e_total);
      } else {
        rows = rows.sort((a, b) => b.e_total - a.e_total);
      }
    } else {
      if (order_by === OrderBy.ASC) {
        rows = rows.sort((a, b) => a[key].toString().localeCompare(b[key].toString()));
      } else {
        rows = rows.sort((a, b) => b[key].toString().localeCompare(a[key].toString()));
      }
    }
    rows = [...rows.filter(pinf), ...rows.filter(x => !pinf(x))];
  }

  $: {
    if ($selected.length == 0) {
      pin_state = 0;
    }
    if ($selected.length > 0) {
      pin_state = 1;
    }
    if ($selected.length == rows.length) {
      pin_state = 2;
    }
  }
</script>

<div class="root">
  <table>
    <thead>
      <tr>
        <th class={`pin pin-state-${pin_state}`}>
          <span class="pin-icon" on:click={onClickGlobalPin}><Pin /></span>
        </th>
        <th>
          Name
          <SortIcon key="Name" onClick={changeOrder}
            order_key={order_column_label} order_by={order_by} />
        </th>
        <th>
          Decentralization
          <SortIcon key="Decentralization" onClick={changeOrder}
            order_key={order_column_label} order_by={order_by} />
        </th>
        <th>
          Proposal activity
          <SortIcon key="Proposal activity" onClick={changeOrder}
            order_key={order_column_label} order_by={order_by} />
        </th>
        <th>
          Active account
          <SortIcon key="Active account" onClick={changeOrder}
            order_key={order_column_label} order_by={order_by} />
        </th>
        <th>
          Market cap
          <SortIcon key="Market cap" onClick={changeOrder}
            order_key={order_column_label} order_by={order_by} />
        </th>
        <th>
          Rank
          <SortIcon key="Rank" onClick={changeOrder}
            order_key={order_column_label} order_by={order_by} />
        </th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr class={highlighted.length ? (highlighted.map(x => x.name).includes(row.name) ? "" : "blur") : ""}
          on:click={() => onClick(row)}
          on:mouseover={() => onMouseOver(row)}
          on:focus={() => onMouseOver(row)}
          on:mouseout={onMouseOut}
          on:blur={onMouseOut}
        >
          <td class={`pin ${highlighted.map(x => x.name).includes(row.name) ? "highlighted" : ""}`}>
            <span class="pin-icon"><Pin /></span>
          </td>
          <td>
            <img src={`${cdn_url}/images/blockchain/svg/${row.name}.svg`} />
            {display_name(row.name)}
          </td>
          {#each Object.entries(row).slice(1, 5) as [key, x]}
            <td>
              <div class="single-bar">
                <SingleBar --height="24px"
                  --fill={key_to_bar_color(key)}
                  percentage={(Number(x) * 100).toFixed(1)} />
              </div>
            </td>
          {/each}
          <td>{display_rank(row.rank)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .root {
    max-height: var(--max-height);
    margin: var(--margin);
    overflow: auto;
  }

  table {
    border-collapse: separate;
    width: 100%;
    color: var(--color-text);
    overflow: auto;
  }

  thead {
    position: sticky;
    top: 0;
    background-color: var(--color-bg2);
    text-align: left;

    & > tr {
      background-color: var(--color-bg2);
    }

    & > tr > th {
      padding: 0 0 15px 0;
      color: var(--color-description);
      font-weight: 400;
      min-width: max-content;
      text-align: left;
      border-bottom: 1px solid var(--color-line);

      &.num {
        text-align: right;
      }
    }
  }

  tbody {
    & > tr {
      cursor: pointer;

      &.blur {
        opacity: 0.5;
      }

      &:hover {
        background-color: var(--color-bg);
      }
    }

    & > tr > td {
      padding: 10px 15px 10px 0;
      min-width: max-content;

      &.num {
        text-align: right;
      }

      &.highlighted {
        color: var(--color-emphasis);
      }

      .single-bar {
        width: 200px;
      }

      img {
        width: 18px;
        height: 18px;
        vertical-align: bottom;
        margin-right: 2px;
      }
    }
  }

  .pin {
    vertical-align: bottom;

    &.pin-state-2 {
      color: var(--color-emphasis);
    }

    .pin-icon {
      cursor: pointer;
    }
  }
</style>
