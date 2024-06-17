import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InvoicesState, adapter } from './reducers';

export const selectInvoicesState = createFeatureSelector<InvoicesState>('invoices');

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export const selectInvoiceIds = createSelector(
  selectInvoicesState,
  selectIds
);

export const selectInvoiceEntities = createSelector(
  selectInvoicesState,
  selectEntities
);

export const selectAllInvoices = createSelector(
  selectInvoicesState,
  selectAll
);

export const selectInvoiceTotal = createSelector(
  selectInvoicesState,
  selectTotal
);

export const selectInvoicesLoading = createSelector(
  selectInvoicesState,
  (state: InvoicesState) => state.loading
);

export const selectInvoicesLoaded = createSelector(
  selectInvoicesState,
  (state: InvoicesState) => state.loaded
);

export const selectInvoicesError = createSelector(
  selectInvoicesState,
  (state: InvoicesState) => state.error
);

export const selectInvoiceById = (id: number) => createSelector(
  selectInvoiceEntities,
  (entities) => entities[id]
);
