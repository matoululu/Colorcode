export function dispatchEvent(e, data) {
  const customEvent = new CustomEvent(e, { detail: data, bubbles: true });
  window.dispatchEvent(customEvent);
}

export function setSaveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSaveState(key) {
  return localStorage.getItem(key);
}
