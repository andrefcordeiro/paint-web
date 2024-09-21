import { CanvasState } from './canvas-state';
import { Memento } from '../services/state-management/memento.interface';

export class CanvasMemento implements Memento {
  private state: CanvasState;

  private date: string;

  constructor(state: CanvasState) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * The Originator uses this method when restoring its state.
   */
  public getState(): CanvasState {
    return this.state;
  }

  /**
   * Get the name of the latest operation executed inside the Originator.
   */
  public getLatestOperation(): string {
    return this.state.latestOperation;
  }

  /**
   * Return the date of the memento.
   */
  public getDate(): string {
    return this.date;
  }
}
