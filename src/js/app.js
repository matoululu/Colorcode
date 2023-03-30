
import InputField from './source/input-field.js';
import GameField from './source/game-field.js';
import PopUp from './source/pop-up.js';
import { getSaveState, setSaveState, dispatchEvent } from './source/utils.js';

document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g,'');
  const lastVisited = getSaveState('lastVisited');

  if (lastVisited) {
    if (lastVisited !== today) setSaveState('lastVisited', today);
  } else {
    const defaultState =  {
      currentTurn: 1,
      historyArray: [],
      scoreArray: [],
      slidePosition: -20
    }

    setSaveState('lastVisited', today);
    setSaveState('lastSession', defaultState);
  }
});
