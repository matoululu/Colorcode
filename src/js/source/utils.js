export function dispatchEvent(e, data) {
  const customEvent = new CustomEvent(e, { detail: data, bubbles: true });
  window.dispatchEvent(customEvent);
}
