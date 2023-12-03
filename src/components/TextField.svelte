<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome"
  import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

  export let placeholder: string = "";
  export let onInput: (s: string) => void;

  export let text: string;
</script>

<div class="root">
  <div class="input">
    <div class="icon">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </div>
    <input type="text"
      placeholder={placeholder}
      bind:value={text}
      on:input={() => onInput(text)}
    />
  </div>
</div>

<style lang="scss">
  .root {
    .input {
      display: flex;
      flex-direction: row;
      background-color: var(--color-bg2);
      padding: 0.5rem 0.5rem 0.5rem 10px;
      border: 1px solid var(--color-line);
      color: var(--color-text);
    }

    input {
      color: var(--color-text);
      outline: 0;
      padding: 0;
      border: 0;
      margin-left: 10px;
      width: 100%;
      background: transparent;
    }
  }
</style>
