# @badisi/ngx-safe-subscribe

Automatically unsubscribe from RxJS observables in Angular components.

[![npm](https://img.shields.io/npm/v/@badisi/ngx-safe-subscribe?color=blue&logo=npm)](https://www.npmjs.com/package/@badisi/ngx-safe-subscribe)
[![Download](https://img.shields.io/npm/dw/@badisi/ngx-safe-subscribe.svg?color=7986CB&logo=npm)](https://npmcharts.com/compare/@badisi/ngx-safe-subscribe?minimal=true)
[![License](https://img.shields.io/npm/l/@badisi/ngx-safe-subscribe.svg?color=ff69b4)](https://github.com/Badisi/ngx-safe-subscribe/blob/main/LICENSE)

<!--[![peerDependency Status](https://david-dm.org/badisi/ngx-safe-subscribe/peer-status.svg)](https://david-dm.org/badisi/ngx-safe-subscribe?type=peer)-->

:zap: *Angular <= 13 version available [here](https://github.com/Badisi/ngx-safe-subscribe/releases/tag/2.2.9)*

:zap: *RxJS 5.x version available [here](https://github.com/Badisi/ngx-safe-subscribe/tree/rxjs-5x)*


## Installation

```sh
npm install @badisi/ngx-safe-subscribe --save
```

```sh
yarn add @badisi/ngx-safe-subscribe
```

## Usage

SafeSubscribe is an augmentation method of Observable.

Calling `safeSubscribe` instead of `subscribe` will automatically unsubscribe your observable at component destroy.

#### Example with Angular components

```ts
import { Component, OnInit } from '@angular/core';
import { SafeSubscribe } from '@badisi/ngx-safe-subscribe';
import { interval } from 'rxjs';

@SafeSubscribe()
@Component({
   selector: 'app-component'
})
export class AppComponent implements OnInit {
   ngOnInit() {
      interval(1000).safeSubscribe(this, () => {
         console.log('This log will stop on component destroy.')
      });
   }
}
```

#### Example with simple class objects

```ts
import { SafeSubscribe } from '@badisi/ngx-safe-subscribe';
import { interval } from 'rxjs';

@SafeSubscribe('destroy')
export class MyObject {
   constructor() {
      interval(1000).safeSubscribe(this, () => {
         console.log('This log will stop on object destroy.')
      });
   }
   destroy() {}
}
```

## Api

### @SafeSubscribe(destructorName)

__Arguments__

* `destructorName: string` *(default: "ngOnDestroy")* - The name of the method that will called when the object is supposed to be destroyed.

---

### Observable.safeSubscribe(target, ...arguments): Subscription

__Arguments__

* `target: any` - A reference to the object that is holding the observable.
* `observerOrNext?: Observer|Function` - Either an observer with methods to be called, or the first of three possible handlers, which is the handler for each value emitted from the subscribed Observable.
* `error?: Function` - A handler for a terminal event resulting from an error. If no error handler is provided, the error will be thrown asynchronously as unhandled.
* `complete?: Function` - A handler for a terminal event resulting from successful completion.

__Return__

* A `Subscription` reference to the registered handler.

## Purpose

To quote a great [article](https://netbasal.com/when-to-unsubscribe-in-angular-d61c6b21bad3) from **Netanel Basal** :

> When you subscribe to an observable or event in JavaScript, you usually need to unsubscribe at a certain point to release memory in the system. Otherwise, you will have a memory leak.

When subscribing to an observable in an Angular component, you almost always arrange to unsubscribe when the component is destroyed.

But it can quickly become a mess to deal with all those subscriptions and make sure they were properly released.

The idea behind SafeSubscribe is to abstract all the unsubscribe boilerplate and make it easier to use.

### Rule of thumb

There are a few exceptional observables where you don't need to unsubscribe :

* `Async pipe`
* `@HostListener`
* `HTTP requests`
* `Finite observables (such as Observable.timer)`

However, as stated in the official Angular documentation :

> Feel free to unsubscribe anyway. It is harmless and never a bad practice !
