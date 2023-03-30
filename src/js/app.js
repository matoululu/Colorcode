
import InputField from './source/input-field.js';
import GameField from './source/game-field.js';
import PopUp from './source/pop-up.js';
import { getSaveState, setSaveState, dispatchEvent } from './source/utils.js';

document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g,'');
  const lastVisited = getSaveState('lastVisited');
  const lastSession = JSON.parse(getSaveState('lastSession'));

  if (lastSession) {
    lastSession.resultsArray.forEach(result => {
      if (result.correct == 4) {
        dispatchEvent('game:win');
      } else if (lastSession.resultsArray.length == 10) {
        dispatchEvent('game:lose');
      } else {
        dispatchEvent('game:start');
      }
    });
  } else {
    dispatchEvent('game:start');
  }

  if (lastVisited) {
    if (lastVisited !== today) setSaveState('lastVisited', today);
  } else {
    const defaultState =  {
      currentTurn: 1,
      historyArray: [],
      resultsArray: [],
      slidePosition: -20
    }

    setSaveState('lastVisited', today);
    setSaveState('lastSession', defaultState);
  }
});
