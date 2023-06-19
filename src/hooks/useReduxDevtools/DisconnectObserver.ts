type Observer = () => void;

class DisconnectObserver {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer);

    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  emit(): void {
    this.observers.forEach((observer) => observer());
  }
}

export const disconnectObserver = new DisconnectObserver();
