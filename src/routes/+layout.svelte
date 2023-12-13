<script lang="ts">
  import { selected, is_fresh } from "@src/store";
  import {loadChainsAt} from "@src/data/loader";
  import "../app.css";

  const chains = loadChainsAt();
  const default_selected = Object.values(chains)
    .sort((a, b) => b.e_total - a.e_total).slice(0, 3);

  if ($is_fresh) {
    $selected = default_selected;
    $is_fresh = false;
  }
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
    --color-pink: #e03493;
    --color-orange: #e97e2a;
    --color-blue: #4080d4;
    --color-emerald: #53b08e;
  }
</style>
