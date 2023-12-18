<script lang="ts">
  import { RadioGroupItem } from "./radio_group";

  export let value: RadioGroupItem = RadioGroupItem.TOTAL;
  export let onChange: (e: any) => void;
</script>

<div class="root">
  <label>
    <input checked={value === RadioGroupItem.TOTAL}
      on:change={onChange} type="radio" name="Total"
      value={RadioGroupItem.TOTAL} /> Total
  </label>
  <label>
    <input checked={value === RadioGroupItem.DECENTRALIZATION}
      on:change={onChange} type="radio" name="Decentralization"
      value={RadioGroupItem.DECENTRALIZATION} /> Decentralization
  </label>
  <label>
    <input checked={value === RadioGroupItem.PROPOSAL_ACTIVITY}
      on:change={onChange} type="radio" name="Proposal activity"
      value={RadioGroupItem.PROPOSAL_ACTIVITY} /> Proposal activity
  </label>
  <label>
    <input checked={value === RadioGroupItem.ACTIVE_ACCOUNT}
      on:change={onChange} type="radio" name="Actice account"
      value={RadioGroupItem.ACTIVE_ACCOUNT} /> Active account
  </label>
  <label>
    <input checked={value === RadioGroupItem.MARKET_CAP}
      on:change={onChange} type="radio" name="Market cap."
      value={RadioGroupItem.MARKET_CAP} /> Market cap.
  </label>
</div>

<style lang="scss">
  .root {
    display: flex;
    margin: var(--margin);
    border-radius: 4px;
    font-size: 1rem;
    padding: 5px;
    align-items: center;
    color: var(--color-description);

    & > label {
      margin-right: 10px;

      & > input {
        appearance: none;
        border: 2px solid var(--color-description);
        border-radius: 50%;
        width: 14px;
        height: 14px;

        &:checked {
          background-color: var(--color-description);
        }
      }
    }
  }
</style>
