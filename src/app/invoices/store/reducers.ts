import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as InvoiceActions from './actions';
import { Invoice } from '../../shared/models/invoice.model';

export interface InvoicesState extends EntityState<Invoice> {
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const adapter: EntityAdapter<Invoice> = createEntityAdapter<Invoice>();

export const initialState: InvoicesState = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: null
});

export const invoiceReducer = createReducer(
  initialState,
  
  on(InvoiceActions.loadInvoices, state => ({ ...state, loading: true })),
  on(InvoiceActions.loadInvoicesSuccess, (state, { invoices }) =>
    adapter.setAll(invoices, { ...state, loading: false, loaded: true })
  ),
  on(InvoiceActions.loadInvoicesFailure, (state, { error }) => ({ ...state, error, loading: false, loaded: false })),
  
  on(InvoiceActions.createInvoice, state => ({ ...state })),
  on(InvoiceActions.createInvoiceSuccess, (state, { invoice }) => adapter.addOne(invoice, state)),
  on(InvoiceActions.createInvoiceFailure, (state, { error }) => ({ ...state, error })),

  on(InvoiceActions.editInvoice, state => ({ ...state })),
  on(InvoiceActions.editInvoiceSuccess, (state, { invoice }) => adapter.updateOne(invoice, state)),
  on(InvoiceActions.editInvoiceFailure, (state, { error }) => ({ ...state, error })),
  
  on(InvoiceActions.deleteInvoice, state => ({ ...state })),
  on(InvoiceActions.deleteInvoiceSuccess, (state, { jobAdId }) => adapter.removeMany((invoice) => invoice.jobAdId === jobAdId, state)),
  on(InvoiceActions.deleteInvoiceFailure, (state, { error }) => ({ ...state, error })),
);

export const { selectAll, selectEntities } = adapter.getSelectors();
