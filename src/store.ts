import {writable, Writable} from 'svelte/store';
import {Chain} from '@src/data/models';

export const selected: Writable<Chain[]> = writable([], () => {
  return () => {};
});
