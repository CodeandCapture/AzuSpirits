/* ==========================================
   AZU SPIRITS - AGE VERIFICATION GATE
   ========================================== */

(function () {

  const STORAGE_KEY = 'azuAgeVerified';
  const VERIFICATION_DAYS = 30;

  /*
   * Check whether the visitor has already
   * confirmed their age within the last 30 days.
   */
  function isAgeVerified() {

    try {

      const storedValue = localStorage.getItem(STORAGE_KEY);

      if (!storedValue) {
        return false;
      }

      const verificationTime = parseInt(storedValue, 10);

      if (isNaN(verificationTime)) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }

      const expiryTime =
        verificationTime +
        (VERIFICATION_DAYS * 24 * 60 * 60 * 1000);

      if (Date.now() < expiryTime) {
        return true;
      }

      localStorage.removeItem(STORAGE_KEY);
      return false;

    } catch (error) {

      /*
       * If localStorage is unavailable,
       * simply show the age gate again.
       */
      return false;

    }

  }


  /*
   * Remember successful verification.
   */
  function saveVerification() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        Date.now().toString()
      );

    } catch (error) {

      // Continue even if storage is unavailable.

    }

  }


  /*
   * Remove age gate and restore scrolling.
   */
  function closeAgeGate() {

    const gate =
      document.getElementById('azu-age-gate');

    if (gate) {

      gate.remove();

    }

    document.body.classList.remove(
      'age-gate-active'
    );

  }


  /*
   * Create age verification screen.
   */
  function createAgeGate() {

    if (isAgeVerified()) {
      return;
    }

    document.body.classList.add(
      'age-gate-active'
    );

    const gate = document.createElement('div');

    gate.id = 'azu-age-gate';

    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute(
      'aria-labelledby',
      'age-gate-title'
    );

    gate.innerHTML = `

      <div class="age-gate-card">

        <img
          src="https://www.azuspirits.co.uk/images/brand/logo.jpg"
          alt="Azu Spirits"
          class="age-gate-logo"
        >

        <h1 id="age-gate-title">
          Welcome to Azu Spirits
        </h1>

        <p class="age-gate-intro">
          Our website contains information about
          alcoholic drinks.
        </p>

        <p class="age-gate-question">
          Are you aged 18 or over?
        </p>

        <div class="age-gate-actions">

          <button
            type="button"
            class="age-gate-button age-gate-enter"
            id="age-gate-enter"
          >
            Yes, I am 18 or over
          </button>

          <button
            type="button"
            class="age-gate-button age-gate-exit"
            id="age-gate-exit"
          >
            No, I am under 18
          </button>

        </div>

        <p class="age-gate-responsible">
          Please enjoy responsibly.
        </p>

      </div>

    `;

    document.body.appendChild(gate);


    /*
     * YES button
     */
    document
      .getElementById('age-gate-enter')
      .addEventListener('click', function () {

        saveVerification();
        closeAgeGate();

      });


    /*
     * NO button
     */
    document
      .getElementById('age-gate-exit')
      .addEventListener('click', function () {

        window.location.replace(
          'https://www.drinkaware.co.uk/'
        );

      });


    /*
     * Put keyboard focus on YES button.
     */
    document
      .getElementById('age-gate-enter')
      .focus();

  }


  /*
   * Initialise when page is ready.
   */
  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      createAgeGate
    );

  } else {

    createAgeGate();

  }

})();
