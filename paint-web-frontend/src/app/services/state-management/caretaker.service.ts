import { Injectable } from '@angular/core';
import { Memento } from './memento.interface';

@Injectable({
  providedIn: 'root',
})
export class CaretakerService {
  constructor() {}

  private mementos: Memento[] = [];

  private pastMementos: Memento[] = [];

  pushMemento(memento: Memento) {
    this.mementos.push(memento);

    this.printMementos('pushMemento');
  }

  popMemento(currentState: Memento | null): Memento | undefined {
    const m = this.mementos.pop();

    if (currentState && m) this.pastMementos.push(currentState);

    this.printMementos('popMemento');

    return m;
  }

  popPastMemento() {
    const m = this.pastMementos.pop();

    this.printMementos('popPastMemento');

    return m;
  }

  printMementos(operation: string) {
    const str1 = this.mementos.reduce((acc, cm) => {
      return acc + cm.getLatestOperation() + ' ';
    }, '');
    console.log(`mementos (${operation}) -> ${str1}`);

    const str2 = this.pastMementos.reduce((acc, cm) => {
      return acc + cm.getLatestOperation() + ' ';
    }, '');
    console.log(`pastMementos (${operation}) -> ${str2}`);
  }
}
