import { Observable, Subscription } from 'rxjs';

declare module 'rxjs/internal/Observable' {
	interface Observable<T> {
		safeSubscribe(
		    target: SafeSubscribable,
		    next?: (value: T) => void,
		    error?: (error: any) => void,
		    complete?: () => void
		): Subscription;
  	}
}

export interface SafeSubscribable {
  	_subscriptionFromSafeSubscribe$?: Subscription;
	ngOnDestroy(): void;
}

export function safeSubscribe<T>(
    target: SafeSubscribable,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
): Subscription {
    if( !('_subscriptionFromSafeSubscribe$' in target) ) {
		target._subscriptionFromSafeSubscribe$ = new Subscription();

        const originalDestroy = target.ngOnDestroy;
        if( !originalDestroy ) {
            console.warn(`${(target as any).constructor.name} should implement OnDestroy otherwise Observable<T>.safeSubscribe will have no effect.`);
        }
        target.ngOnDestroy = function() {
            if( originalDestroy && (typeof originalDestroy === 'function') ) {
                originalDestroy.apply(this, arguments);
            }
            target._subscriptionFromSafeSubscribe$.unsubscribe();
        };
    }

    const sub = this.subscribe(next, error, complete);
    target._subscriptionFromSafeSubscribe$.add(sub);
    return sub;
}
Observable.prototype.safeSubscribe = safeSubscribe;
