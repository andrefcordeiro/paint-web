export interface Memento {
  /**
   * State data.
   */
  getState(): any;

  /**
   * Name of the operation that changed the state.
   */
  getLatestOperation(): string;

  /**
   * Instant that the state was saved.
   */
  getDate(): string;
}
