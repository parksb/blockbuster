<script lang="ts">
  export let title: string;
  export const row: boolean = false;
</script>

<div class="root">
  <div class="header">
    <h3>{title}</h3>
  </div>
  <div class="body"><slot /></div>
</div>

<style lang="scss">
  .root {
    margin-bottom: var(--bottom);

    .header {
      display: flex;
      color: var(--color-text);

      h3 {
        font-size: 1.1rem;
        font-weight: 400;
      }
    }

    .body {
      display: flex;
      flex-direction: row;
      overflow: scroll;
    }
  }
</style>
