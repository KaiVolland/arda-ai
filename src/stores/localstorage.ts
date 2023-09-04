import { browser } from "$app/environment";
import type { ChatCompletionMessage } from "openai/resources/chat";
import { writable, type Writable } from "svelte/store";
let localstorageStore: Writable<ChatCompletionMessage[]>;
if (browser) {
  const value = localStorage.getItem('messages')
  localstorageStore = writable<ChatCompletionMessage[]>(value == null ? [] : JSON.parse(value));
  localstorageStore.subscribe(v => localStorage.setItem('messages', JSON.stringify(v)));
}
export { localstorageStore };
