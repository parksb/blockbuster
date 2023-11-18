<script lang="ts">
  import Card from "../components/Card.svelte";
</script>

<svelte:head>
	<title>Blockbuster</title>
</svelte:head>

<div class="root">
  <div class="side"></div>
  <div class="main">
    <div class="header">
      <h2>Overview</h2>
    </div>
    <div class="body">
      <Card title="Title A" --marginBottom="30px" />
      <Card title="Title B" />
    </div>
  </div>
</div>

<style lang="scss">
  .root {
    font-family: sans-serif;
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
  }

  .side {
    background-color: var(--color-white);
    width: 280px;
    height: 100%;
    border-right: 1.5px solid var(--color-line);
  }

  .main {
    background-color: var(--color-bg);
    width: 100%;
    height: 100%;
    padding: 10px 40px;
    overflow: auto;

    .header {
      & > h2 {
        color: var(--color-main);
      }
    }
  }

  :global(:root) {
    --color-emphasis: #1325AE;
    --color-main: #1e2860;
    --color-description: #8f94b0;
    --color-line: #e1e6eb;
    --color-bg: #fafbfc;
    --color-white: #ffffff;
  }
</style>
