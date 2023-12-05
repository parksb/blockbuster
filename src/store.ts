import {writable, Writable, Readable} from 'svelte/store';
import {Chain} from '@src/data/models';

export const selected: Writable<Chain[]> = writable([], () => {
  return () => {};
});

export const is_fresh: Writable<boolean> = writable(true, () => {
  return () => {};
});
