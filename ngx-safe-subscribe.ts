import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

declare module 'rxjs/Observable' {
	interface Observable<T> {
		safeSubscribe: typeof safeSubscribe;
  	}
}

export function safeSubscribe<T>(
    target: any,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
): Subscription {
    if( !target._subscriptionFromSafeSubscribe ) {
		target._subscriptionFromSafeSubscribe = new Subscription();

        const originalDestroy = target.ngOnDestroy;
        if( !originalDestroy ) {
            console.warn(`${target.constructor.name} should implement OnDestroy otherwise Observable<T>.safeSubscribe will have no effect.`);
        }
        target.ngOnDestroy = function() {
            if( originalDestroy && (typeof originalDestroy === 'function') ) {
                originalDestroy.apply(this, arguments);
            }
            target._subscriptionFromSafeSubscribe.unsubscribe();
        };
    }

    const subscribe = this.subscribe(next, error, complete);
    target._subscriptionFromSafeSubscribe.add(subscribe);
    return subscribe;
}
Observable.prototype.safeSubscribe = safeSubscribe;
