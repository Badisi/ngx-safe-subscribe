# ngx-safe-subscribe (RxJS 5+)

Automatically unsubscribe from RxJS observables in Angular components.

[![npm](https://img.shields.io/npm/dt/@badisi/ngx-safe-subscribe.svg)]()
[![npm](https://img.shields.io/npm/l/@badisi/ngx-safe-subscribe.svg)]()

:zap: *RxJS 6+ version available [here](https://github.com/Badisi/ngx-safe-subscribe/tree/master)*


## Installation

### NPM

```
npm install --save @badisi/ngx-safe-subscribe@1.0.0
```

### Yarn

```
yarn add @badisi/ngx-safe-subscribe@1.0.0
```

## Usage

SafeSubscribe is an augmentation method of Observable.  

Calling **safeSubscribe** instead of **subscribe** will automatically unsubscribe your observable at component destroy.

:warning: make sure to implement at least a noop **ngOnDestroy** on your component, otherwise unsubscribe won't work !

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

```js
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import '@badisi/ngx-safe-subscribe';

@Component({
   selector: 'app-component'
})
export class AppComponent implements OnInit, OnDestroy {
   ngOnInit() {
      Observable.interval(1000).safeSubscribe(this, () => {
         console.log('This log will stop on component destroy.')
      });
   }

   // /!\ At least a noop ngOnDestroy is required for SafeSubscribe to work !
   ngOnDestroy() {}
}
```
