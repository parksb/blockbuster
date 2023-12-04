<script lang="ts">
  export let tab = "score";
</script>

<div class="root">
  <h1>BLOCKBUSTER</h1>
  <ul>
    <li class={`${tab === "score" ? "on" : ""}`}>
      <a href="/">Score</a>
    </li>
    <li class={`${tab === "compare" ? "on" : ""}`}>
      <a href="/compare">Compare</a>
    </li>
  </ul>
</div>

<style lang="scss">
  .root {
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg2);
    width: 300px;
    height: 100%;
    border-right: 1px solid var(--color-line);

    & > h1 {
      font-size: 1rem;
      color: var(--color-text);
      padding: 20px 30px;
    }

    & > ul {
      list-style: none;
      padding: 0;
      margin: 0 10px;

      & > li {
        margin: 10px 0;
        cursor: pointer;
        color: var(--color-text);

        & > a {
          display: block;
          color: inherit;
          text-decoration: none;
          margin-left: 15px;
        }

        &.on, &:hover {
          color: var(--color-emphasis);
          border-left: 4px solid var(--color-emphasis);
        }

        &:not(.on) {
          margin-left: 4px;
        }

        &:hover {
          margin-left: 0;
        }
      }
    }
  }
</style>
