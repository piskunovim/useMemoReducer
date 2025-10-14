import { Return } from './connectionModule';

type Observer = (payload: Return) => void;

class DisconnectObserver {
  private readonly observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer);

    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  emit(payload: Return): void {
    this.observers.forEach((observer) => observer(payload));
  }
}

export const disconnectObserver = new DisconnectObserver();
