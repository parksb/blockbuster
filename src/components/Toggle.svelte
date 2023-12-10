<script lang="ts">
  export let checked = false;
  export let onChange: () => void;
</script>

<label class="switch">
  <input type="checkbox" checked={checked} on:change={onChange} />
  <span class="slider" />
</label>

<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-line);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: var(--color-text);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--color-emphasis);
  }

  input:checked + .slider {
    box-shadow: 0 0 1px var(--color-emphasis);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
  }
</style>
