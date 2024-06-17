import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JobAdsState, adapter } from './reducers';

export const selectJobAdsState = createFeatureSelector<JobAdsState>('jobAds');

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export const selectJobAdIds = createSelector(
  selectJobAdsState,
  selectIds
);

export const selectJobAdEntities = createSelector(
  selectJobAdsState,
  selectEntities
);

export const selectAllJobAds = createSelector(
  selectJobAdsState,
  selectAll
);

export const selectJobAdTotal = createSelector(
  selectJobAdsState,
  selectTotal
);

export const selectJobAdsLoading = createSelector(
  selectJobAdsState,
  (state: JobAdsState) => state.loading
);

export const selectJobAdsLoaded = createSelector(
  selectJobAdsState,
  (state: JobAdsState) => state.loaded
);

export const selectJobAdsError = createSelector(
  selectJobAdsState,
  (state: JobAdsState) => state.error
);

export const selectJobAdById = (id: number) => createSelector(
  selectJobAdEntities,
  (entities) => entities[id]
);
