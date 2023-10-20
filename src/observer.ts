import type { Subscriber } from "./types";

class Observer<T> {
    private __subscribers: Map<number, Subscriber<T>>;
    private __subscribersLength: number;
    private __data: T;

    constructor(data: T) {
        this.__subscribers = new Map();
        this.__subscribersLength = 0;
        this.__data = data;
    }

    subscribe(subscriber: Subscriber<T>): () => void {
        const subscribers = this.__subscribers;
        const subscriberId = this.__subscribersLength++;

        subscribers.set(subscriberId, subscriber);

        return () => {
            subscribers.delete(subscriberId);
            this.__subscribersLength -= 1;
        };
    }

    notify(): void {
        const data = this.__data;
        const subscribers = this.__subscribers;
        
        for (const subscriber of subscribers.values()) {
            subscriber(data);
        }
    }

    getData(): T {
        return this.__data;
    }
}

export default Observer;
