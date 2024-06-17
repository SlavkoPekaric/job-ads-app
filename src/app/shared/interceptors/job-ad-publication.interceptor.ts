import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, filter } from 'rxjs/operators';

import * as JobAdsActions from '../../job-ads/store/actions';
import * as InvoiceActions from '../../invoices/store/actions';

import { JOB_INVOICE_DEFAULT_PRICE } from '../config/constants';
import { InvoiceService } from '../../invoices/services/invoice.service';

@Injectable()
export class JobAdsInterceptor implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private invoiceService: InvoiceService
  ) {}

  createJobAdSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobAdsActions.createJobAdSuccess),
      filter(action => action.jobAd.status === 'published'),
      map(action => InvoiceActions.createInvoice({ invoice: {
        jobAdId: action.jobAd.id,
        amount: JOB_INVOICE_DEFAULT_PRICE,
        dueDate: this.invoiceService.calculateInvoiceDueDate()
      } }))
    )
  );
  
  updateJobAdStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobAdsActions.changeJobAdStatusSuccess),
      filter(action => action.jobAd.changes.status === 'published'),
      map(action => InvoiceActions.createInvoice({ invoice: {
        jobAdId: action.jobAd.id as number,
        amount: JOB_INVOICE_DEFAULT_PRICE,
        dueDate: this.invoiceService.calculateInvoiceDueDate()
      } }))
    )
  );
  
  deleteJobAdSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobAdsActions.deleteJobAdSuccess),
      map(action => InvoiceActions.deleteInvoice({ jobAdId: action.jobAd.id }))
    )
  );



  ngrxOnInitEffects(): Action {
    return { type: '[Job Ads Interceptor] Init' };
  }
}
