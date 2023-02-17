/*============================================================================
  GameField
==============================================================================*/

import { dispatchEvent } from './utils.js';
import Chance from 'chance';

class GameField extends HTMLElement {
  constructor() {
    super();
    this.currentArray = [];
    this.historyArray = [];
    this.answerArray = [];
    this.currentTurn = 1;

    this.list = this.querySelector('ul');
    this.listItems = this.querySelectorAll('li');
    this.currentSliderScrollPos = -20;
    this.fieldHeight = 62;
    this.slideMaxWidth = this.listItems * this.fieldHeight;

    // Seed random number generator with date
    this.date = new Date().toISOString().slice(0, 10);
    this.chance;

    this.init();

    // Listen for game:endless event
    window.addEventListener('game:endless', () => {
      this.init(true);
    });

    window.addEventListener('input:clicked', e => {
      // Add input to current array and display it in this.current, ensure array has a max size of 6
      if (this.currentArray.length >= 4) this.currentArray.shift();
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
      this.winHandler();

      if (this.currentTurn == 11) return;
    });
  }

  init(random = null) {
    this.clear();

    if (random) {
      this.chance = new Chance();
    } else {
      this.chance = new Chance(this.date);
    }
    // Scroll to top
    this.list.scrollTo(0, 0);

    //generate answer array, 4 random numbers between 1 and 6
    for (let i = 0; i < 4; i++) {
      this.answerArray.push(this.chance.integer({min: 1, max: 6}));
    }
  }

  inputClicked(value) {
    dispatchEvent('input:clicked', value);
  }

  displayArray(array, target) {
    console.log(target)
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

  winHandler() {
    let resultsCorrect = [];
    let resultsWrong = [];
    let resultArray = [];
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

    // add correct and wrong to array
    resultArray = resultsCorrect.concat(resultsWrong);

    // for each item in array, create span with correct or wrong class and append to current field
    resultArray.forEach((item, i) => {
      if (item == '1') {
        const span = document.createElement('span');
        span.classList.add('icon', 'icon--correct', `icon--${i}`);
        currentField.appendChild(span);
      } else {
        const span = document.createElement('span');
        span.classList.add('icon', 'icon--wrong', `icon--${i}`);
        currentField.appendChild(span);
      }
    });

    if(resultsCorrect.length === 4) {
      dispatchEvent('game:win');
      return;
    }


    if (this.currentTurn == 10) {
      dispatchEvent('game:lose');
      return;
    }

    // Scroll to next slide every 2 turns
    if (this.currentTurn != 1) this.scrollNext();

    // Reset current array
    this.currentArray = [];
    this.currentTurn+= 1;
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
