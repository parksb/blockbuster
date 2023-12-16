<script lang="ts">
  import {display_rank, rankNumToColor} from "@src/utils";

  export let rank: number;
  export let text: string | null = null;
</script>

<div class="root" style="background-color: {rankNumToColor(rank)};">
  {text || display_rank(rank)}
</div>

<style lang="scss">
  .root {
    min-width: 42px;
    padding: 0 5px;
    height: 24px;
    font-weight: 700;
    border-radius: 4px;
    text-align: center;
    line-height: 1.7;
    font-size: 0.9rem;
  }
</style>
