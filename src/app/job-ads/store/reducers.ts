import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as JobAdActions from './actions';
import { JobAd } from '../../shared/models/job-ad.model';

export interface JobAdsState extends EntityState<JobAd> {
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const adapter: EntityAdapter<JobAd> = createEntityAdapter<JobAd>();

export const initialState: JobAdsState = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: null
});

export const jobAdReducer = createReducer(
  initialState,
  
  on(JobAdActions.loadJobAds, (state) => ({ ...state, loading: true })),
  on(JobAdActions.loadJobAdsSuccess, (state, { jobAds }) => adapter.setAll(jobAds, { ...state, loading: false, loaded: true })
  ),
  on(JobAdActions.loadJobAdsFailure, (state, { error }) => ({ ...state, error, loading: false, loaded: false })),
  
  on(JobAdActions.createJobAd, state => ({ ...state })),
  on(JobAdActions.createJobAdSuccess, (state, { jobAd }) => adapter.addOne(jobAd, state)),
  on(JobAdActions.createJobAdFailure, (state, { error }) => ({ ...state, error })),
  
  on(JobAdActions.editJobAd, state => ({ ...state })),
  on(JobAdActions.editJobAdSuccess, (state, { jobAd }) => adapter.updateOne(jobAd, state)),
  on(JobAdActions.editJobAdFailure, (state, { error }) => ({ ...state, error })),
  
  on(JobAdActions.deleteJobAd, state => ({ ...state })),
  on(JobAdActions.deleteJobAdSuccess, (state, { jobAd }) => adapter.removeOne(jobAd.id, state)),
  on(JobAdActions.deleteJobAdFailure, (state, { error }) => ({ ...state, error })),

  on(JobAdActions.changeJobAdStatus, state => ({ ...state })),
  on(JobAdActions.changeJobAdStatusSuccess, (state, { jobAd }) => adapter.updateOne(jobAd, state)),
  on(JobAdActions.changeJobAdStatusFailure, (state, { error }) => ({ ...state, error })),
);

export const { selectAll, selectEntities } = adapter.getSelectors();
