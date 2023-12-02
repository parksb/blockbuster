<script lang="ts">
  import type { Chain } from "@src/data/models";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome"
  import { faXmark } from "@fortawesome/free-solid-svg-icons"

  export let data: Chain[];
  export let onRemove: (d: Chain) => void;
</script>

<ul class="root">
  {#each data as d}
    <li>
      <div>
        <div class="chip"></div>
        <div class="left">{d.name}</div>
      </div>
      <div>
        <div class="right">{d.rank}</div>
        <div class="btn" on:click={() => onRemove(d)}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
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
    overflow: scroll;
    max-height: 200px;

    li {
      font-size: 1rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0 15px;

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

      .btn {
        cursor: pointer;
      }
    }
  }
</style>
