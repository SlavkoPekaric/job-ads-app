import { createAction, props } from '@ngrx/store';
import { Invoice } from '../../shared/models/invoice.model';
import { Update } from '@ngrx/entity';

export const loadInvoices = createAction('[Invoice] Load Invoices');
export const loadInvoicesSuccess = createAction('[Invoice] Load Invoices Success', props<{ invoices: Invoice[] }>());
export const loadInvoicesFailure = createAction('[Invoice] Load Invoices Failure', props<{ error: any }>());

export const createInvoice = createAction('[Invoice] Create Invoice', props<{ invoice: Invoice }>());
export const createInvoiceSuccess = createAction('[Invoice] Create Invoice Success', props<{ invoice: Invoice }>());
export const createInvoiceFailure = createAction('[Invoice] Create Invoice Failure', props<{ error: any }>());

export const editInvoice = createAction('[Invoice] Edit Invoice', props<{ invoice: Update<Invoice> }>());
export const editInvoiceSuccess = createAction('[Invoice] Edit Invoice Success', props<{ invoice: Update<Invoice> }>());
export const editInvoiceFailure = createAction('[Invoice] Edit Invoice Failure', props<{ error: any }>());

export const deleteInvoice = createAction('[Invoice] Delete Invoice', props<{ jobAdId: number }>());
export const deleteInvoiceSuccess = createAction('[Invoice] Delete Invoice Success', props<{ jobAdId: number }>());
export const deleteInvoiceFailure = createAction('[Invoice] Delete Invoice Failure', props<{ error: any }>());
