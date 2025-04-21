import { Return } from './connections';
type Observer = (payload: Return) => void;
declare class DisconnectObserver {
    private readonly observers;
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
    emit(payload: Return): void;
}
export declare const disconnectObserver: DisconnectObserver;
export {};
//# sourceMappingURL=DisconnectObserver.d.ts.map