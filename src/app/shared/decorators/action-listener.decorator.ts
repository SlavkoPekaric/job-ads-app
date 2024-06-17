import { Actions, ofType } from '@ngrx/effects';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Action } from '@ngrx/store';

@Injectable()
export class ActionListenerService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private actions$: Actions) {}

  listenForAction(action: Action, callback: (action: Action) => void): void {
    this.actions$
      .pipe(
        ofType(action.type),
        takeUntil(this.destroy$)
      )
      .subscribe((action) => callback(action));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export function ActionListener(action: Action) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalOnInit = target.ngOnInit;
    const originalOnDestroy = target.ngOnDestroy;

    let listenerService: ActionListenerService;

    target.ngOnInit = function () {
      const listenerService = new ActionListenerService(this.actions$);
      listenerService.listenForAction(action, descriptor.value.bind(this));

      if (originalOnInit) {
        originalOnInit.apply(this);
      }
    };

    target.ngOnDestroy = function () {
      if (listenerService && typeof listenerService.ngOnDestroy === 'function') {

        listenerService.ngOnDestroy();
      }
      
      if (originalOnDestroy) {
        originalOnDestroy.apply(this);
      }
    };

    return descriptor;
  };
}
