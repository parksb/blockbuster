<script lang="ts">
  export let percentage: string;
  export let text: string | null = null;
</script>

<div class="root">
  <div class="max">
    <div class="fill" style="--width:{percentage}%;">
      <span>{text ?? `${percentage}%`}</span>
    </div>
  </div>
</div>

<style lang="scss">
  .root {
    display: flex;
    width: 100%;
    max-width: var(--max-width);
    min-width: var(--min-width);
    height: var(--height);
    max-height: var(--max-height);
  }

  .max {
    width: 100%;
    height: 100%;
    background-color: var(--color-line);
    border-radius: 3px;
  }

  .fill {
    display: flex;
    align-items: center;
    width: var(--width);
    height: 100%;
    background-color: var(--fill);
    border-radius: 3px 0 0 3px;

    & > span {
      color: var(--color-text);
      font-size: 0.9rem;
      padding-left: 5px;
    }
  }
</style>
