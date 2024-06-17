import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap, switchMap, map } from 'rxjs/operators';
import { JobAd } from '../../shared/models/job-ad.model';
import { DataService } from '../../shared/services/data.service';

import cloneDeep from 'clone-deep';

import { Observable } from 'rxjs';


export interface JobAdsState {
  jobAds: JobAd[];
  loading: boolean;
  loaded: boolean;
  error: any;
}

const initialState: JobAdsState = {
  jobAds: [],
  loading: false,
  loaded: false,
  error: null,
};

@Injectable()
export class JobAdsStore extends ComponentStore<JobAdsState> {
  constructor(private dataService: DataService) {
    super(initialState);
  }

  // Selectors
  readonly jobAds$ = this.select(state => state.jobAds);
  readonly jobAdsById$ = this.select(state => state.jobAds);

  readonly getItemById = (id: number): Observable<JobAd | undefined> => this.select(state => state.jobAds).pipe(
    map((items: JobAd[]) => items.find(item => item.id === id))
  );

  readonly loading$ = this.select(state => state.loading);
  readonly loaded$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);

  // Updaters
  readonly setJobAds = this.updater((state, jobAds: JobAd[]) => ({
    ...state,
    jobAds,
    loading: false,
    loaded: true
  }));

  readonly createJob = this.updater((state, jobAd: JobAd) => ({
    ...state,
    jobAds: [
      ...cloneDeep(state.jobAds),
      jobAd
    ]
  }))
  
  readonly updateJob = this.updater((state, jobAd: JobAd) => ({
    ...state,
    jobAds: cloneDeep(state.jobAds).map((item: JobAd) => {
      // update single entry
      if (jobAd.id === item.id) {
        item = jobAd;
      }

      return item;
    })
  }))
  
  readonly removeJob = this.updater((state, jobAd: JobAd) => ({
    ...state,
    jobAds: cloneDeep(state.jobAds).filter((item: JobAd) => jobAd.id !== item.id)
  }))

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));
  
  readonly setLoaded = this.updater((state, loaded: boolean) => ({
    ...state,
    loaded
  }));

  readonly setError = this.updater((state, error: any) => ({
    ...state,
    error,
    loading: false,
    loaded: false
  }));

  readonly loadJobAds = this.effect(trigger$ =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.dataService.getJobs().pipe(
          tap({
            next: (jobAds: JobAd[]) => {
              console.log(jobAds);
              return this.setJobAds(jobAds)
            },
            error: error => this.setError(error),
          })
        )
      )
    )
  );
}
