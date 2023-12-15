<script lang="ts">
  export let max: number;
  export let percentages: { percentage: number, color: string }[];
  const sum_percentage = percentages.reduce((a, b) => a + b.percentage, 1) / 100;
</script>

<div class="root">
  <div class="max">
    {#each percentages as p, i}
      <div class={`fill ${i === 0 ? "first" : ""}`}
        style="--width:{p.percentage / sum_percentage}%;
          background-color:{p.color}">
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .root {
    display: flex;
    width: 100%;
    max-width: var(--max-width);
    height: var(--height);
    max-height: var(--max-height);
  }

  .max {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: var(--color-line);
    border-radius: 3px;

    & > div.first {
      border-radius: 3px 0 0 3px;
    }

    & > div.num {
      margin-left: 10px;
    }
  }

  .fill {
    display: flex;
    align-items: center;
    width: var(--width);
    height: 100%;
    background-color: var(--color-emphasis);

    & > span {
      color: var(--color-text);
      font-size: 0.9rem;
      padding-left: 5px;
    }
  }
</style>
