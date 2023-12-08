<div class="root"><slot /></div>

<style>
  .root {
    display: flex;
    flex: var(--flex);
    border: 1px solid var(--color-line);
    margin: var(--margin);
    padding: var(--padding);
    background-color: var(--color-bg2);
    overflow: var(--overflow);
    flex-direction: var(--direction);
    max-width: var(--max-width);
    height: var(--height);
    max-height: var(--max-height);
  }
</style>
