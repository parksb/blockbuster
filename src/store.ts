import {writable, Writable} from 'svelte/store';
import {Chain} from '@src/data/models';

export const selected: Writable<Chain[]> = writable([], () => {
  return () => {};
});

export const preview: Writable<Chain | null> = writable(null, () => {
  return () => {};
});

export const is_fresh: Writable<boolean> = writable(true, () => {
  return () => {};
});

export const date: Writable<string> = writable("2023-11-13", () => {
  return () => {};
});
