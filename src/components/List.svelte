<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome"
  import { faXmark } from "@fortawesome/free-solid-svg-icons"

  import type { Chain } from "@src/data/models";
  import { display_name, display_rank, distinct } from "@src/utils";
  import { preview } from "@src/store";

  export let data: Chain[];
  export let onRemove: (d: Chain) => void;
  export let onMouseOver: (d: Chain) => void;
  export let onMouseOut: (d: Chain) => void;

  let mean: Chain;

  $: {
    const pool = distinct(data, x => [x.name]);
    mean = {
      name: "Mean",
      e_decentralization: pool.reduce((a, b) => a + b.e_decentralization, 0) / pool.length,
      e_active_account: pool.reduce((a, b) => a + b.e_active_account, 0) / pool.length,
      e_proposal_activity: pool.reduce((a, b) => a + b.e_proposal_activity, 0) / pool.length,
      e_market_cap: pool.reduce((a, b) => a + b.e_market_cap, 0) / pool.length,
      e_total: pool.reduce((a, b) => a + b.e_total, 0) / pool.length,
      color: "#5f5f5f",
      rank: 0,
      date: "",
    };

    data = [...data, mean].sort((a, b) => b.e_total - a.e_total);
  }
</script>

<ul class="root">
  {#each data as d}
    {#if d.name === "Mean"}
      {#if data.length > 2}
        <li class="mean">
          <span>
            <span>Mean ({(d.e_total * 100).toFixed(1)}%)</span>
          </span>
        </li>
      {/if}
    {:else}
      <li on:focus={() => onMouseOver(d)}
        on:blur={() => onMouseOut(d)}
        on:mouseover={() => onMouseOver(d)}
        on:mouseout={() => onMouseOut(d)}>
        <div>
          <div class="chip" style="--color:{d.color}" />
          <div class="left">{display_name(d.name)}</div>
        </div>
        <div>
          <div class="right">
            {$preview?.name === d.name ? (d.e_total * 100).toFixed(1) : display_rank(d.rank)}
          </div>
          <button on:click={() => onRemove(d)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </li>
    {/if}
  {/each}
</ul>

<style lang="scss">
  .root {
    display: flex;
    color: var(--color-text);
    list-style-type: none;
    flex-direction: column;
    padding: 0;
    margin: var(--margin);

    li {
      font-size: 1rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0 15px;
      cursor: default;

      div {
        display: inline-block;
      }

      .chip {
        width: 0.5rem;
        height: 0.5rem;
        background-color: var(--color);
        border-radius: 100%;
        margin-right: 3px;
      }

      .right {
        margin-right: 5px;
      }

      &:hover button {
        display: inline;
      }

      button {
        display: none;
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--color-text);
        cursor: pointer;
        font-size: .9rem;
      }

      &.mean {
        color: var(--color-description);
        text-align: center;
        width: 100%;
        line-height: 0.1em;
        font-size: 0.8rem;
        padding: 0 0 13px;

        & > span {
          background: var(--color-description);
          padding: 0 10px;
          width: 100%;

          & > span {
            background-color: var(--color-bg2);
            padding: 0 5px;
          }
        }
      }
    }
  }
</style>
