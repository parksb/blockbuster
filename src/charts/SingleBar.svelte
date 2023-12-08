<script lang="ts">
  export let percentage: string;
</script>

<div class="root">
  <div class="max">
    <div class="fill" style="--width:{percentage}%;">
      <span>{percentage}%</span>
    </div>
  </div>
</div>

<style lang="scss">
  .root {
    width: 100%;
    max-width: var(--max-width);
    height: var(--height);
    max-height: var(--max-height);
  }

  .max {
    width: 100%;
    height: 100%;
    background-color: var(--color-line);
    border-radius: 2px;
  }

  .fill {
    width: var(--width);
    height: 100%;
    background-color: var(--color-emphasis);
    border-radius: 2px 0 0 2px;

    & > span {
      color: var(--color-text);
      font-size: 0.9rem;
      padding-left: 5px;
    }
  }
</style>
