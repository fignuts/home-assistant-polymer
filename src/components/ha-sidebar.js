import hass from '../util/home-assistant-js-instance';

import Polymer from '../polymer';
import nuclearObserver from '../util/bound-nuclear-behavior';

require('./stream-status');

const {
  configGetters,
  navigationGetters,
  authActions,
  navigationActions,
} = hass;

export default new Polymer({
  is: 'ha-sidebar',

  behaviors: [nuclearObserver],

  properties: {
    menuShown: {
      type: Boolean,
    },

    menuSelected: {
      type: String,
    },

    narrow: {
      type: Boolean,
    },

    selected: {
      type: String,
      bindNuclear: navigationGetters.activePane,
    },

    hasHistoryComponent: {
      type: Boolean,
      bindNuclear: configGetters.isComponentLoaded('history'),
    },

    hasLogbookComponent: {
      type: Boolean,
      bindNuclear: configGetters.isComponentLoaded('logbook'),
    },
  },

  menuSelect() {
    this.debounce('updateStyles', () => this.updateStyles(), 1);
  },

  menuClicked(ev) {
    let target = ev.target;
    let checks = 5;

    // find panel to select
    while (checks && !target.getAttribute('data-panel')) {
      target = target.parentElement;
      checks--;
    }

    if (checks) {
      this.selectPanel(target.getAttribute('data-panel'));
    }
  },

  toggleMenu() {
    this.fire('close-menu');
  },

  selectPanel(newChoice) {
    if (newChoice === this.selected) {
      return;
    } else if (newChoice === 'logout') {
      this.handleLogOut();
      return;
    }
    navigationActions.navigate.apply(null, newChoice.split('/'));
    this.debounce('updateStyles', () => this.updateStyles(), 1);
  },

  handleLogOut() {
    authActions.logOut();
  },
});
