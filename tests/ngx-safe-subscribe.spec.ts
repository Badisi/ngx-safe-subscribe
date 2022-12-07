import { ɵComponentDef as ComponentDef, ɵɵdefineComponent as defineComponent } from '@angular/core';
import { interval } from 'rxjs';
import { SafeSubscribe } from '../ngx-safe-subscribe';

describe('ngx-safe-subscribe', () => {
    it('should not work without safesubscribe', () => {
        class TestComponent {
            static ɵcmp = defineComponent({
                vars: 0,
                decls: 0,
                type: TestComponent,
                selectors: [[]],
                template: () => { },
            }) as ComponentDef<TestComponent>;

            public timerSub$ = interval(1000).subscribe();
        }

        const comp = new TestComponent();
        expect(comp.timerSub$.closed).toBeFalsy();
        comp['ngOnDestroy']?.();
        expect(comp.timerSub$.closed).toBeFalsy();
    });

    it('should not work without @SafeSubsribe() decorator', () => {
        class TestComponent {
            static ɵcmp = defineComponent({
                vars: 0,
                decls: 0,
                type: TestComponent,
                selectors: [[]],
                template: () => { },
            }) as ComponentDef<TestComponent>;

            public timerSub$ = interval(1000).safeSubscribe(this);
        }

        expect(() => new TestComponent()).toThrow();
    });

    it('should work with safesubscribe', () => {
        @SafeSubscribe()
        class TestComponent {
            static ɵcmp = defineComponent({
                vars: 0,
                decls: 0,
                type: TestComponent,
                selectors: [[]],
                template: () => { },
            }) as ComponentDef<TestComponent>;

            public timerSub$ = interval(1000).safeSubscribe(this);
        }

        const comp = new TestComponent();
        expect(comp.timerSub$.closed).toBeFalsy();
        comp['ngOnDestroy']?.();
        expect(comp.timerSub$.closed).toBeTruthy();
    });

    it('should work with another destructor', () => {
        @SafeSubscribe('destructor')
        class TestComponent {
            static ɵcmp = defineComponent({
                vars: 0,
                decls: 0,
                type: TestComponent,
                selectors: [[]],
                template: () => { },
            }) as ComponentDef<TestComponent>;

            public timerSub$ = interval(1000).safeSubscribe(this);

            public destructor(): void { }
        }

        const comp = new TestComponent();
        expect(comp.timerSub$.closed).toBeFalsy();
        comp['ngOnDestroy']?.();
        expect(comp.timerSub$.closed).toBeFalsy();
        comp['destructor']?.();
        expect(comp.timerSub$.closed).toBeTruthy();
    });
});
