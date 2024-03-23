import { Injectable } from '@angular/core';
import { Memento } from './memento.interface';

@Injectable({
  providedIn: 'root',
})
export class CaretakerService {
  constructor() {}

  private mementos: Memento[] = [];

  pushMemento(memento: Memento) {
    this.mementos.push(memento);
  }

  popMemento(): Memento | undefined {
    return this.mementos.pop();
  }
}
