/*============================================================================
  PopUp
==============================================================================*/

class PopUp extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector('button');
    this.popupScreen = this.querySelectorAll('.popup-screen');

    this.button.addEventListener('click', () => {
      this.classList.add('hidden');
    });

    //listen for game:win and game:lost event
    window.addEventListener('game:win', () => {
      this.displayScreen('win');
    });

    window.addEventListener('game:lost', () => {
      this.displayScreen('lose');
    });
  }

  displayScreen(context) {
    console.log(context);
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
