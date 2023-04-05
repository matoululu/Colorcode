/*============================================================================
  PopUp
==============================================================================*/

import { dispatchEvent, getSolution } from './utils.js';

class PopUp extends HTMLElement {
  constructor() {
    super();
    this.play = this.querySelectorAll('[data-play]');
    this.refresh = this.querySelectorAll('[data-refresh]');
    this.popupScreen = this.querySelectorAll('.popup-screen');
    this.solutions = this.querySelectorAll('[data-solution]');
    this.solutionArray = getSolution();

    this.play.forEach(button => {
      button.addEventListener('click', () => {
        this.classList.add('hidden');
        dispatchEvent('inputs:enable');
      });
    });

    //listen for game:win and game:lost event
    window.addEventListener('game:win', e => {
      this.displayScreen('win');
      dispatchEvent('inputs:disable');
    });

    window.addEventListener('game:lose', e => {
      this.displayScreen('lose');
      dispatchEvent('inputs:disable');
    });

    window.addEventListener('game:start', () => {
      this.displayScreen('welcome');
      dispatchEvent('inputs:disable');
    });

    window.addEventListener('game:help', () => {
      this.displayScreen('help');
      dispatchEvent('inputs:disable');
    });
  }

  displayScreen(context) {
    this.classList.remove('hidden');
    // Loop through popupScreen and set hidden class
    this.popupScreen.forEach(screen => {
      if (screen.dataset.context === context) {
        screen.classList.remove('hidden');
      } else {
        screen.classList.add('hidden');
      }
    });

    // Loop through solutions and add solution to screen
    if (context === 'win' || context === 'lose') {
      this.solutions.forEach(solutionEl => {
        solutionEl.innerHTML = '';

        this.solutionArray.forEach((input, i) => {
          const span = document.createElement('span');
          span.classList.add('input', `input-count--${i}`, `input--${input}`, 'animate__animated', 'animate__flipInX');
          solutionEl.appendChild(span);
        });
      });
    }
  }
}

customElements.define('pop-up', PopUp);
