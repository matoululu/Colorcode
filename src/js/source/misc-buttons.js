/*============================================================================
  MiscButtons
==============================================================================*/

import { dispatchEvent } from './utils.js';

class MiscButtons extends HTMLElement {
  constructor() {
    super();
    this.buttons = this.querySelectorAll('button');



    this.buttons.forEach(button => {
      const buttonContext = button.dataset.context;
      button.addEventListener('click', () => {
        dispatchEvent(`game:${buttonContext}`);
      });
    });
  }
}

customElements.define('misc-buttons', MiscButtons);
