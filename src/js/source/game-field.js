/*============================================================================
  GameField
==============================================================================*/

import { dispatchEvent, getSaveState, setSaveState, getSolution } from './utils.js';

class GameField extends HTMLElement {
  constructor() {
    super();
    this.currentArray = [];
    this.historyArray = [];
    this.answerArray = [];
    this.scoreArray = [];
    this.currentTurn = 1;

    this.list = this.querySelector('ul');
    this.listItems = this.querySelectorAll('li');
    this.currentSliderScrollPos = -20;
    this.fieldHeight = 62;
    this.slideMaxWidth = this.listItems * this.fieldHeight;

    this.init();

    window.addEventListener('input:clicked', e => {
      // Add input to current array and display it in this.current, ensure array has a max size of 6
      if (this.currentArray.length >= 4) return;
      this.currentArray.push(e.detail);

      this.displayArray(this.currentArray, this.querySelector(`[data-field="${this.currentTurn}"]`));
    });

    window.addEventListener('reset:clicked', () => {
      this.currentArray = [];
      this.querySelector(`[data-field="${this.currentTurn}"]`).innerHTML = '';
    });

    window.addEventListener('submit:clicked', () => {
      if (this.currentArray.length < 4) return;

      // Add current array to history array
      this.historyArray.push(this.currentArray);

      this.displayArray(this.currentArray, this.querySelector(`[data-field="${this.currentTurn}"]`));
      // Check if current array is correct
      this.scoreHandler();

      if (this.currentTurn == 11) return;
    });
  }

  init() {
    this.clear();
    this.loadInitialState();

    setTimeout(() => {
      this.answerArray = getSolution();
      this.list.scrollTo(0, this.currentSliderScrollPos);
    }, 0);
  }

  loadInitialState() {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g,'');
    const lastVisited = getSaveState('lastVisited');

    if (lastVisited) {
      const parsedLastVisited = lastVisited.replace(/"/g,'');

      if (parsedLastVisited == today) {
        const lastSession = JSON.parse(getSaveState('lastSession'));

        if (lastSession) {
          this.currentTurn = lastSession.currentTurn;
          this.historyArray = lastSession.historyArray;
          this.currentSliderScrollPos = lastSession.slidePosition;
          this.scoreArray = lastSession.resultsArray;

          if (this.currentTurn == 10) {
            dispatchEvent('game:lose');
          } else {
            dispatchEvent('game:start');
          }

          this.historyArray.forEach((array, index) => {
            this.displayArray(array, this.querySelector(`[data-field="${index + 1}"]`));
          });

          this.scoreArray.forEach((result, index) => {
            const currentField = this.querySelector(`[data-field="${index + 1}"]`).parentNode;

            const correctSpan = document.createElement('span');
            correctSpan.classList.add('icon', 'icon--correct');
            correctSpan.innerHTML = this.scoreArray[index].correct;
            currentField.appendChild(correctSpan);

            const wrongSpan = document.createElement('span');
            wrongSpan.classList.add('icon', 'icon--wrong');
            wrongSpan.innerHTML = this.scoreArray[index].wrong;
            currentField.appendChild(wrongSpan);
          });
        }
      }
    } else {
      return;
    }
  }

  setCurrentState() {
    const lastSession = {
      currentTurn: this.currentTurn,
      currentArray: this.currentArray,
      historyArray: this.historyArray,
      resultsArray: this.scoreArray,
      slidePosition: this.currentSliderScrollPos
    };

    setSaveState('lastSession', lastSession);
  }

  inputClicked(value) {
    dispatchEvent('input:clicked', value);
  }

  displayArray(array, target) {
    // remove all children from target
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }

    array.forEach(input => {
      const span = document.createElement('span');
      span.classList.add('input', `input--${input}`);
      target.appendChild(span);
    });
  }

  scoreHandler() {
    let resultsCorrect = [];
    let resultsWrong = [];
    const guessArray = this.currentArray;
    const solutionArray = this.answerArray;
    const currentField = this.querySelector(`[data-field="${this.currentTurn}"]`).parentNode;

    for(let i = 0; i < guessArray.length; i++){
      if(guessArray[i] == solutionArray[i]){
        resultsCorrect.push('1');
      } else{
        resultsWrong.push('2');
      }
    }

    const correctSpan = document.createElement('span');
    correctSpan.classList.add('icon', 'icon--correct');
    correctSpan.innerHTML = resultsCorrect.length;
    currentField.appendChild(correctSpan);

    const span = document.createElement('span');
    span.classList.add('icon', 'icon--wrong');
    span.innerHTML = resultsWrong.length;
    currentField.appendChild(span);

    // Add resultsCorrect and resultsWrong to scoreArray
    this.scoreArray.push({
      correct: resultsCorrect.length,
      wrong: resultsWrong.length
    });

    // Scroll to next slide every 2 turns
    if (this.currentTurn != 1) this.scrollNext();

    setTimeout(() => {
      this.setCurrentState();

      if(resultsCorrect.length === 4) {
        dispatchEvent('game:win', {
          solution: this.answerArray,
        });
        return;
      }

      if (this.currentTurn == 10) {
        dispatchEvent('game:lose', {
          solution: this.answerArray,
        });
        return;
      }

      // Reset current array
      this.currentArray = [];
      this.currentTurn+= 1;
    }, 0);
  }

  scrollNext() {
    const newSliderScrollPos = this.currentSliderScrollPos + this.fieldHeight;
    if (newSliderScrollPos >= this.slideMaxWidth) return;

    this.currentSliderScrollPos = newSliderScrollPos;
    this.list.scrollTo(0, newSliderScrollPos);
  }

  clear() {
    this.currentArray = [];
    this.historyArray = [];
    this.answerArray = [];
    this.currentTurn = 1;

    // remove span from list items
    this.listItems.forEach(item => {
      const span = item.querySelectorAll('span');
      span.forEach(span => {
        span.remove();
      });

      const div = item.querySelector('div');
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
    });

    // reset event listeners
    window.removeEventListener('input:clicked', () => {});
    window.removeEventListener('reset:clicked', () => {});
    window.removeEventListener('submit:clicked', () => {});
  }
}

customElements.define('game-field', GameField);
