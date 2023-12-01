<script lang="ts">
  export let title: string;
  export const marginBottom: number = 0;
</script>

<div class="card">
  <div class="header">{title}</div>
  <div class="body"><slot /></div>
</div>

<style lang="scss">
  .card {
    background-color: var(--color-bg2);
    border: 1.5px solid var(--color-line);
    border-radius: 5px;
    margin-bottom: var(--marginBottom);

    .header {
      padding: 15px;
      border-bottom: 1.5px solid var(--color-line);
      font-weight: 700;
      color: var(--color-main);
    }

    .body {
      padding: 15px;
    }
  }
</style>
