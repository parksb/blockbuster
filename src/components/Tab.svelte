<script lang="ts">
  export let labels: string[];
  export let onChange: (label: string) => void;

  let current = 0;
</script>

<div class="root">
  <div class="labels">
    {#each labels as label, i}
      <span class={`label ${i === current ? "on" : "off"}`}
        on:click={() => { current = i; onChange(labels[current]) }}
      >{label}</span>
    {/each}
  </div>
</div>

<style lang="scss">
  .root {
    font-size: .7rem;
    display: flex;
    align-items: center;
    padding: 0;
    height: fit-content;
    border-radius: 20px;
    background-color: var(--color-line);
  }

  .label {
    padding: 3px 6px;
    text-align: center;
    width: 40px;
    cursor: pointer;
    color: var(--color-text);
  }

  .label.on {
    border-radius: 20px;
    background: linear-gradient(var(--color-emphasis), #9b80e5);
  }

  .labels {
    display: flex;
    flex-direction: row;
  }
</style>
