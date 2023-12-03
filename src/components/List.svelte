<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome"
  import { faXmark } from "@fortawesome/free-solid-svg-icons"

  import type { Chain } from "@src/data/models";

  export let data: Chain[];
  export let onRemove: (d: Chain) => void;
  export let onMouseOver: (d: Chain) => void;
  export let onMouseOut: (d: Chain) => void;
</script>

<ul class="root">
  {#each data as d}
    <li on:focus={() => onMouseOver(d)}
      on:blur={() => onMouseOut(d)}
      on:mouseover={() => onMouseOver(d)}
      on:mouseout={() => onMouseOut(d)}>
      <div>
        <div class="chip"></div>
        <div class="left">{d.name}</div>
      </div>
      <div>
        <div class="right">{d.rank}</div>
        <button on:click={() => onRemove(d)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </li>
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
        background-color: red;
        border-radius: 100%;
        margin-right: 3px;
      }

      .right {
        margin-right: 5px;
      }

      button {
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--color-text);
        cursor: pointer;
        font-size: .9rem;
      }
    }
  }
</style>
