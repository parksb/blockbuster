<script lang="ts">
  import Section from "@src/components/Section.svelte";
  import Sidebar from "@src/components/Sidebar.svelte";
</script>

<svelte:head>
	<title>Blockbuster</title>
</svelte:head>

<div class="root">
  <Sidebar tab="compare" />
  <div class="main">
    <div class="header">
      <h2>Dashboard</h2>
      <div class="title-section">
        <h3>Compare</h3>
      </div>
    </div>
    <div class="body">
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

  .main {
    background-color: var(--color-bg);
    width: 100%;
    height: 100%;
    padding: 10px 40px;
    overflow: auto;

    .header {
      padding: 10px 0;
      margin-bottom: 20px;

      & > h2 {
        font-size: 1rem;
        color: var(--color-text);
      }

      & > div.title-section {
        margin-top: 40px;

        h3 {
          font-size: 2rem;
          color: var(--color-text);
          margin: 0;
        }

        p {
          font-size: 1rem;
          color: var(--color-description);
          margin-top: 1rem;
        }
      }
    }
  }
</style>
