/*============================================================================
  PopUp
==============================================================================*/

import { dispatchEvent } from './utils.js';

class PopUp extends HTMLElement {
  constructor() {
    super();
    this.play = this.querySelectorAll('[data-play]');
    this.refresh = this.querySelectorAll('[data-refresh]');
    this.popupScreen = this.querySelectorAll('.popup-screen');

    this.play.forEach(button => {
      button.addEventListener('click', () => {
        this.classList.add('hidden');
        dispatchEvent('inputs:enable');
      });
    });

    //listen for game:win and game:lost event
    window.addEventListener('game:win', () => {
      this.displayScreen('win');
      dispatchEvent('inputs:disable');
    });

    window.addEventListener('game:lose', () => {
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
  }
}

customElements.define('pop-up', PopUp);
