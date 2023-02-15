/*============================================================================
  GameField
==============================================================================*/

import { dispatchEvent } from './utils.js';

class GameField extends HTMLElement {
  constructor() {
    super();
    this.currentArray = [];
    this.historyArray = [];
    this.answerArray = [];
    this.currentTurn = 1;

    this.init();
  }

  init() {
    //generate answer array, 6 random numbers between 1 and 6
    for (let i = 0; i < 4; i++) {
      this.answerArray.push(Math.floor(Math.random() * 6) + 1);
    }

    console.log(this.answerArray);

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
      this.querySelector(`[data-field="${this.currentTurn}"]`).classList.remove('active');

      // Check if current array is correct
      this.winHandler();

      // Reset current array
      this.currentArray = [];
      this.currentTurn+= 1;


      // Check for loss
      if (this.currentTurn == 7) {
        dispatchEvent('game:lose');
        return;
      }

      // set new active field
      this.querySelector(`[data-field="${this.currentTurn}"]`).classList.add('active');
    });
  }

  inputClicked(value) {
    dispatchEvent('input:clicked', value);
  }

  displayArray(array, target) {
    // Clear current field
    target.innerHTML = '';

    array.forEach(input => {
      const span = document.createElement('span');
      span.classList.add('input', `input--${input}`);
      target.appendChild(span);
    });
  }

  winHandler() {
    let correct = 0;
    const guessArray = this.currentArray;
    const solutionArray = this.answerArray;
    const currentField = this.querySelector(`[data-field="${this.currentTurn}"]`);

    for(let i=0; i < guessArray.length; i++){
      if(guessArray[i] == solutionArray[i]){
        correct += 1;
        currentField.children[i].classList.add('input--correct');

        if(correct === 4) {
          dispatchEvent('game:win');
          return;
        }
      } else if (solutionArray.indexOf(guessArray[i]) != (-1)) {
        currentField.children[i].classList.add('input--close');
      } else{
        currentField.children[i].classList.add('input--wrong');
      }
    }
  }
}

customElements.define('game-field', GameField);
