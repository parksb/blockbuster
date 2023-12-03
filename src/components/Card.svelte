<div class="root"><slot /></div>

<style>
  .root {
    display: flex;
    flex: var(--flex);
    border: 1px solid var(--color-line);
    margin-right: var(--right);
    padding: var(--padding);
    background-color: var(--color-bg2);
    overflow: hidden;
    flex-direction: var(--direction);
    max-width: var(--max-width);
    max-height: var(--max-height);
  }
</style>
