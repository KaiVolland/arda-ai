import type Map from "ol/Map";
import { writable } from "svelte/store";

export const mapStore = writable<Map>();
