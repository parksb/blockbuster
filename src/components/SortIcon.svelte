<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome"
  import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons"
  import {OrderBy} from "@src/data/models";

  export let key: string;
  export let order_key: string;
  export let order_by: OrderBy;
  export let onClick: (k: string) => void;
</script>

<span class="root" on:click={() => onClick(key)}>
  {#if key === order_key}
    {#if order_by === OrderBy.DESC}
      <FontAwesomeIcon icon={faSortDown} />
    {:else}
      <FontAwesomeIcon icon={faSortUp} />
    {/if}
  {:else}
    <FontAwesomeIcon icon={faSort} />
  {/if}
</span>

<style lang="scss">
  .root {
    cursor: pointer;
    font-size: 0.7rem;
  }
</style>
