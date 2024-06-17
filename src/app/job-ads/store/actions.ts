import { createAction, props } from '@ngrx/store';
import { JobAd } from '../../shared/models/job-ad.model';
import { Update } from '@ngrx/entity';

export const loadJobAds = createAction('[Job Ads] Load Job Ads', props<{ keyword?: string }>());
export const loadJobAdsSuccess = createAction('[Job Ads] Load Job Ads Success', props<{ jobAds: JobAd[] }>());
export const loadJobAdsFailure = createAction('[Job Ads] Load Job Ads Failure', props<{ error: any }>());

export const createJobAd = createAction('[Job Ads] Create Job Ad', props<{ jobAd: JobAd }>());
export const createJobAdSuccess = createAction('[Job Ads] Create Job Ad Success', props<{ jobAd: JobAd }>());
export const createJobAdFailure = createAction('[Job Ads] Create Job Ad Failure', props<{ error: any }>());

export const editJobAd = createAction('[Job Ads] Edit Job Ad', props<{ jobAd: Update<JobAd> }>());
export const editJobAdSuccess = createAction('[Job Ads] Edit Job Ad Success', props<{ jobAd: Update<JobAd> }>());
export const editJobAdFailure = createAction('[Job Ads] Edit Job Ad Failure', props<{ error: any }>());

export const changeJobAdStatus = createAction('[Job Ads] Change Job Ad Status', props<{ jobAd: Update<JobAd> }>());
export const changeJobAdStatusSuccess = createAction('[Job Ads] Change Job Ad Status Success', props<{ jobAd: Update<JobAd> }>());
export const changeJobAdStatusFailure = createAction('[Job Ads] Change Job Ad Status Failure', props<{ error: any }>());

export const deleteJobAd = createAction('[Job Ads] Delete Job Ad', props<{ jobAd: JobAd }>());
export const deleteJobAdSuccess = createAction('[Job Ads] Delete Job Ad Success', props<{ jobAd: JobAd }>());
export const deleteJobAdFailure = createAction('[Job Ads] Delete Job Ad Failure', props<{ error: any }>());

