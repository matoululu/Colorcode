import Chance from 'chance';

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

export function getSolution() {
  const date = new Date().toISOString().slice(0, 10);
  const chance = new Chance(date);

  const solutionArray = [];

  //generate answer array, 4 random numbers between 1 and 6
  for (let i = 0; i < 4; i++) {
    solutionArray.push(chance.integer({min: 1, max: 6}));
  }

  return solutionArray;
}

export function logger(message) {
  console.log(`Colorcodes log: ${message}`);
}
