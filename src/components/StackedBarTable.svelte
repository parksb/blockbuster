<script lang="ts">
  import Pin from "svelte-material-icons/Pin.svelte";

  import {display_name, display_rank, label_to_key, rankNumToColor, sortChains} from "@src/utils";
  import {CDN_URL} from "@src/constants";
  import {OrderBy, type Chain} from "@src/data/models";
  import SingleBar from "@src/charts/SingleBar.svelte";
  import {selected, preview} from "@src/store";
  import SortIcon from "./SortIcon.svelte";
  import SingleStackedBar from "@src/charts/SingleStackedBar.svelte";

  export let data: Chain[] = [];
  export let highlighted: Chain[] = [];

  export let onMouseOver: (d: Chain) => void;
  export let onMouseOut: () => void;
  export let onClick: (d: Chain) => void;

  let pin_order_by = OrderBy.NORMAL;

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

    const key = label_to_key(order_column_label) as keyof Chain;
    rows = sortChains(rows, key, order_by);
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
    if (order_column_label === target) {
      order_by = order_by === OrderBy.DESC ? OrderBy.ASC : OrderBy.DESC;
    } else {
      order_by = OrderBy.DESC;
      order_column_label = target;
    }
  };

  $: {
    const key = label_to_key(order_column_label) as keyof Chain;
    const pinf = (x: Chain) => $selected.map(k => k.name).includes(x.name);

    rows = sortChains(rows, key, order_by);

    if (pin_order_by === OrderBy.ASC) {
      rows = [...rows.filter(x => !pinf(x)), ...rows.filter(pinf)];
    } else if (pin_order_by === OrderBy.DESC) {
      rows = [...rows.filter(pinf), ...rows.filter(x => !pinf(x))];
    }
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
          <div class="pin-icon" on:click={onClickGlobalPin}><Pin /></div>
          <span class={pin_order_by !== OrderBy.NORMAL ? "fixed-pin" : ""}>
            <SortIcon key="Pin" onClick={() => {
              if (pin_order_by === OrderBy.NORMAL) {
                pin_order_by = OrderBy.DESC;
              } else if (pin_order_by === OrderBy.DESC) {
                pin_order_by = OrderBy.ASC;
              } else {
                pin_order_by = OrderBy.NORMAL;
              }
            }} order_key={"Pin"} order_by={pin_order_by} />
          </span>
        </th>
        <th>
          Name
          <SortIcon key="Name" onClick={changeOrder}
            order_key={order_column_label} order_by={order_by} />
        </th>
        <th class="stacked-bar-column">
          <div>Decentralization
            <SortIcon key="Decentralization" onClick={changeOrder}
              order_key={order_column_label} order_by={order_by} />
          </div>
          <div>Proposal activity
            <SortIcon key="Proposal activity" onClick={changeOrder}
              order_key={order_column_label} order_by={order_by} />
          </div>
          <div>Active account
            <SortIcon key="Active account" onClick={changeOrder}
              order_key={order_column_label} order_by={order_by} />
          </div>
          <div>Market cap.
            <SortIcon key="Market cap" onClick={changeOrder}
              order_key={order_column_label} order_by={order_by} />
          </div>
        </th>
        <th class="rank-column">
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
          <td class={`pin ${$selected.map(x => x.name).includes(row.name) ? "pinned" : ""}`}>
            <span class="pin-icon"><Pin /></span>
          </td>
          <td class="name">
            <img src={`${CDN_URL}/images/blockchain/svg/${row.name}.svg`} />
            {display_name(row.name)}
          </td>
          <td>
            <div class="single-bar">
              <SingleStackedBar --height="23px"
                max={row.e_total * 100}
                percentages={[
                  {percentage: row.e_decentralization, color: "var(--color-pink)"},
                  {percentage: row.e_proposal_activity, color: "var(--color-orange)"},
                  {percentage: row.e_active_account, color: "var(--color-blue)"},
                  {percentage: row.e_market_cap, color: "var(--color-emerald)"}
                ]} />
            </div>
          </td>
          <td class="rank-bar">
            <SingleBar --height="23px"
              percentage={(row.e_total * 100).toFixed(1)}
              text={$preview?.name === row.name ? null : display_rank(row.rank)}
              --fill={rankNumToColor(row.rank)} />
          </td>
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
    padding: 0 0 20px 0;
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
      padding: 0 15px 15px 0;
      color: var(--color-description);
      font-weight: 400;
      min-width: max-content;
      text-align: left;
      border-bottom: 1px solid var(--color-line);

      &.num {
        text-align: right;
      }

      &.stacked-bar-column {
        display: flex;
        & > div {
          width: 235px;
        }
      }

      &.rank-column {
        width: 220px;
      }
    }

    .icon {
      font-size: 0.7rem;
      cursor: pointer;
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
      padding: 7px 15px 7px 0;
      min-width: max-content;

      &.num {
        text-align: right;
      }

      &.pinned {
        color: var(--color-emphasis);
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
    padding-right: 15px;

    &.pin-state-2 {
      color: var(--color-emphasis);
    }

    .pin-icon {
      cursor: pointer;
      display: inline-block;
      vertical-align: bottom;
      height: 16px;
    }

    .fixed-pin {
      color: var(--color-emphasis);
    }
  }
</style>
