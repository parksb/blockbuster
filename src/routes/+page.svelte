<div class="root">
  <div class="side"></div>
  <div class="main">
    <div class="top">
      <h2>Overview</h2>
    </div>
    <div class="content">
      <div class="card">A</div>
      <div class="card">B</div>
      <div class="card">C</div>
      <div class="card">D</div>
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
    background-color: #fff;
    width: 280px;
    height: 100%;
    border-right: 1.5px solid #e1e6eb;
  }

  .main {
    background-color: #fafbfc;
    width: 100%;
    height: 100%;
    padding: 10px 40px;
    overflow: auto;

    .top {
      & > h2 {
        color: #1e2860;
      }
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 25px;

      .card {
        background-color: #fff;
        border: 1.5px solid #e1e6eb;
        border-radius: 5px;
        padding: 15px;
      }
    }
  }
</style>
