import { Observable, Subscription } from 'rxjs';

const HAS_DECORATOR = Symbol('__safeSubscribeDecorator');
const SUBSCRIPTION = Symbol('__safeSubscribeSubscription$');

declare module 'rxjs/internal/Observable' {
    interface Observable<T> {
        safeSubscribe: typeof safeSubscribe;
    }
}

export function SafeSubscribe(destructorName ='ngOnDestroy'): ClassDecorator {
    return (classType: Function) => {
        const originalDestroy = classType.prototype[destructorName];
        classType.prototype[destructorName] = function (this: any) {
            originalDestroy && originalDestroy.call(this);
            this[SUBSCRIPTION]?.unsubscribe();
            this[SUBSCRIPTION] = null;
        }
        classType.prototype[HAS_DECORATOR] = true;
    };
}

export function safeSubscribe<T>(this: Observable<T>, target: any, ...args: any): Subscription {
    const sub = this.subscribe(...args);
    if (target) {
        const hasDecorator = Object.getPrototypeOf(target)[HAS_DECORATOR];
        if (!hasDecorator) {
            throw new Error(`${target.constructor.name} class must be decorated with @SafeSubscribe() otherwise Observable<T>.safeSubscribe() will have no effect.`);
        }
        if (!target[SUBSCRIPTION]) {
            target[SUBSCRIPTION] = new Subscription();
        }
        target[SUBSCRIPTION].add(sub);
    }
    return sub;
}
Observable.prototype.safeSubscribe = safeSubscribe;
