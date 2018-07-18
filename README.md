# ngx-safe-subscribe (RxJS 6+)

Automatically unsubscribe from RxJS observables in Angular components.

[![npm](https://img.shields.io/npm/dt/@badisi/ngx-safe-subscribe.svg)]()
[![npm](https://img.shields.io/npm/l/@badisi/ngx-safe-subscribe.svg)]()

:zap: *RxJS 5+ version available [here](https://github.com/Badisi/ngx-safe-subscribe/tree/rxjs-5x)*


## Installation

### NPM

```sh
npm install --save @badisi/ngx-safe-subscribe
```

### Yarn

```sh
yarn add @badisi/ngx-safe-subscribe
```

## Usage

SafeSubscribe is an augmentation method of Observable.  

Calling **safeSubscribe** instead of **subscribe** will automatically unsubscribe your observable at component destroy.

---------------------------------------

:warning: Make sure to implement at least a noop **ngOnDestroy** on your component otherwise unsubscribe won't work !

---------------------------------------

### safeSubscribe(target: any, next: Function, error: Function, complete: Function): Subscription

__Arguments__

* `target` - A reference to the object that is holding the observable.
* `next` - A handler for each delivered value. Called zero or more times after execution starts.
* `error` - A handler for an error notification. An error halts execution of the observable instance.
* `complete` - A handler for the execution-complete notification. Delayed values can continue to be delivered to the next handler after execution is complete.

__Return__

* A `Subscription` object.

__Example__

```ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval } from 'rxjs';
import '@badisi/ngx-safe-subscribe';

@Component({
   selector: 'app-component'
})
export class AppComponent implements OnInit, OnDestroy {
   ngOnInit() {
      interval(1000).safeSubscribe(this, () => {
         console.log('This log will stop on component destroy.')
      });
   }

   // /!\ At least a noop ngOnDestroy is required for SafeSubscribe to work !
   ngOnDestroy() {}
}
```

## Purpose

To quote a great [article](https://netbasal.com/when-to-unsubscribe-in-angular-d61c6b21bad3) from **Netanel Basal** :

> When you subscribe to an observable or event in JavaScript, you usually need to unsubscribe at a certain point to release memory in the system. Otherwise, you will have a memory leak.

When subscribing to an observable in an Angular component, you almost always arrange to unsubscribe when the component is destroyed.

But it can quickly become a mess to deal with all those subscriptions and make sure they were properly released.

The idea behind SafeSubscribe is to abstract all the unsubscribe boilerplate code and make it more easy to use.

### Rule of thumb

There are a few exceptional observables where you don't need to unsubscribe to :

- `Async pipe`
- `@HostListener`
- `HTTP requests`
- `Finite observables (such as Observable.timer)`

However, as stated in the official Angular documentation :

> Feel free to unsubscribe anyway. It is harmless and never a bad practice !
