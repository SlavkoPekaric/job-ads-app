import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { DataService } from '../../shared/services/data.service';

import * as InvoicesActions from './actions';
import { Invoice } from '../../shared/models/invoice.model';

@Injectable()
export class InvoiceEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService
  ) {}

  loadInvoices$ = createEffect(() => this.actions$.pipe(
    ofType(InvoicesActions.loadInvoices),
    mergeMap(() => this.dataService.getInvoices()
      .pipe(
        map((invoices: Invoice[]) => InvoicesActions.loadInvoicesSuccess({ invoices })),
        catchError(error => of(InvoicesActions.loadInvoicesFailure({ error })))
      ))
  ));
  
  createInvoice$ = createEffect(() => this.actions$.pipe(
    ofType(InvoicesActions.createInvoice),
    mergeMap(action => this.dataService.createInvoice( action.invoice )
      .pipe(
        map((invoice: Invoice) => {
          return InvoicesActions.createInvoiceSuccess({ invoice })
        }),
        catchError(error => of(InvoicesActions.createInvoiceFailure({ error })))
      ))
  ));

  deleteInvoices$ = createEffect(() => this.actions$.pipe(
    ofType(InvoicesActions.deleteInvoice),
    mergeMap(action => this.dataService.removeInvoices( action.jobAdId )
      .pipe(
        map((jobAdId: number) => {
          return InvoicesActions.deleteInvoiceSuccess({ jobAdId })
        }),
        catchError(error => of(InvoicesActions.createInvoiceFailure({ error })))
      ))
  ));
  
}
