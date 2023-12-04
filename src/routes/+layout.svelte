<script lang="ts">
  import "../app.css";
</script>

<slot />

<style>
  :global(:root) {
    --color-emphasis: #7543ff;
    --color-main: #9d43dc;
    --color-text: #DDE0E3;
    --color-description: #98A2AE;
    --color-line: #2d3239;
    --color-bg: #13151A;
    --color-bg2: #181A20;
  }
</style>
