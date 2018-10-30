import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

declare module 'rxjs/Observable' {
	interface Observable<T> {
        safeSubscribe: typeof safeSubscribe
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
    const sub = this.subscribe(next, error, complete);
    if( target ) {
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
        target._subscriptionFromSafeSubscribe$.add(sub);
    }
    return sub;
}
Observable.prototype.safeSubscribe = safeSubscribe;
