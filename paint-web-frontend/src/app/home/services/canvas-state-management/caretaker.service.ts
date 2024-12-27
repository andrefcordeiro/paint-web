import { Injectable } from '@angular/core';
import { Memento } from './memento.interface';

@Injectable({
  providedIn: 'root',
})
export class CaretakerService {
  constructor() { }

  private mementos: Memento[] = [];

  private pastMementos: Memento[] = [];

  /**
   * Push a new memento.
   * @param memento 
   */
  pushMemento(memento: Memento) {
    this.mementos.push(memento);
    this.pastMementos = [];

    this.printMementos('pushMemento');
  }

  /**
   * Remove the latest pushed memento.
   * @param memento 
   */
  popMemento(currentState: Memento | null): Memento | undefined {
    const m = this.mementos.pop();

    if (currentState && m) this.pastMementos.push(currentState);

    this.printMementos('popMemento');

    return m;
  }

  /**
   * Restore the latest removed memento.
   * @param memento 
   */
  restoreDeletedMemento(currentState: Memento) {
    const m = this.pastMementos.pop();

    if (currentState && m) this.mementos.push(currentState);

    this.printMementos('restoreDeletedMemento');
    return m;
  }

  printMementos(operation: string) {
    const str1 = this.mementos.reduce((acc, cm) => {
      return acc + cm.getLatestOperation() + ' ';
    }, '');
    // console.log(`this.mementos (${operation}) ->`, this.mementos)
    // console.log(`mementos (${operation}) -> ${str1}`);

    const str2 = this.pastMementos.reduce((acc, cm) => {
      return acc + cm.getLatestOperation() + ' ';
    }, '');
    // console.log(`this.pastMementos (${operation}) ->`, this.pastMementos)
    // console.log(`pastMementos (${operation}) -> ${str2}`);
  }
}
