<script lang="ts">
  import Tab from "./Tab.svelte";
  import TextField from "./TextField.svelte";

  export let title: string;
  export const row: boolean = false;

  export let tab_labels: string[] = [];
  export let onTabChange: (label: string) => void = () => {};

  export let text_field: {
    text: string,
    onTextFieldInput: (s: string) => {},
    onTextFieldFocus: () => {},
    onTextFieldBlur: () => {},
  } | null = null;


</script>

<div class="root">
  <div class="header">
    <h3>{title}</h3>
    {#if tab_labels.length}
      <Tab labels={tab_labels} onChange={onTabChange} />
    {/if}
    {#if text_field}
      <div class="text-field-container">
        <TextField text={text_field.text}
          onInput={text_field.onTextFieldInput}
          onFocus={text_field.onTextFieldFocus}
          onBlur={text_field.onTextFieldBlur}
          placeholder="Type chain name to search" />
      </div>
    {/if}
  </div>
  <div class="body"><slot /></div>
</div>

<style lang="scss">
  .root {
    margin-bottom: var(--bottom);
    height: var(--height);
    max-height: var(--max-height);

    .header {
      display: flex;
      color: var(--color-text);
      align-items: center;
      justify-content: space-between;

      h3 {
        flex: 2;
        font-size: 1.1rem;
        margin-right: 30px;
      }
    }

    .body {
      display: flex;
      flex-direction: row;
      overflow: scroll;
    }

    .text-field-container {
      flex: 1;
      max-width: var(--text-field-max-width);
    }
  }
</style>
