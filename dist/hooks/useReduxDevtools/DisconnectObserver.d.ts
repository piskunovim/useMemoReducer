type Observer = () => void;
declare class DisconnectObserver {
    private observers;
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
    emit(): void;
}
export declare const disconnectObserver: DisconnectObserver;
export {};
//# sourceMappingURL=DisconnectObserver.d.ts.map