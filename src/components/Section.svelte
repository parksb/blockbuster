<script lang="ts">
  import Tab from "./Tab.svelte";

  export let title: string;
  export const row: boolean = false;

  export let tab_labels: string[] = [];
  export let onTabChange: (label: string) => void = () => {};
</script>

<div class="root">
  <div class="header">
    <h3>{title}</h3>
    {#if tab_labels.length}
      <Tab labels={tab_labels} onChange={onTabChange} />
    {/if}
  </div>
  <div class="body"><slot /></div>
</div>

<style lang="scss">
  .root {
    margin-bottom: var(--bottom);
    height: var(--height);
    max-height: var(--max-height);

    .header {
      display: flex;
      color: var(--color-text);
      align-items: center;
      justify-content: space-between;

      h3 {
        font-size: 1.1rem;
      }
    }

    .body {
      display: flex;
      flex-direction: row;
      overflow: scroll;
    }
  }
</style>
