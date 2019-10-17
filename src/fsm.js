class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    this._config = config;
    if(this._config===null || this._config===undefined){
      throw new Error("Config is not defined");
    }
    this._state = this._config['initial'];
    this._stateHistory = [];
    this._stateRedo = [];
  }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this._state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      let statesList = Object.keys(this._config['states']);
      if (!statesList.includes(state)){
        throw new Error ('No such state');
      }
      this._stateHistory.push(this._state);
      this._stateRedo.length = 0;
      this._state = state;
      return this;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      let currentState = this._config['states'][this._state];
      let eventsList = Object.keys(currentState['transitions']);
      if (!eventsList.includes(event)){
        throw new Error ('No such event for current state');
      }
      this._stateHistory.push(this._state);
      this._stateRedo.length = 0;
      this._state = currentState['transitions'][event];
      return this;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this._stateHistory.push(this._state);
      this._stateRedo.length = 0;
      this._state = this._config['initial'];
      return this;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      let statesObj = this._config['states'];
      let statesList = Object.keys(statesObj);
      if (event === undefined) {
        return statesList;
      }
      let filteredStatesList = statesList.filter(
        item => Object.keys(statesObj[item]['transitions']).includes(event)
        );
      return filteredStatesList;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if (this._stateHistory.length == 0){
        return false;
      }
      this._stateRedo.push(this._state);
      this._state = this._stateHistory.pop();
      return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if (this._stateRedo.length == 0){
        return false;
      }
      this._stateHistory.push(this._state);
      this._state = this._stateRedo.pop();
      return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this._stateHistory.length = 0;
      this._stateRedo.length = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
