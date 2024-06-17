import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as JobAdsActions from './actions';
import { DataService } from '../../shared/services/data.service';
import { JobAd } from '../../shared/models/job-ad.model';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';

@Injectable()
export class JobAdsEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private dataService: DataService
  ) {}

  loadJobAds$ = createEffect(() => this.actions$.pipe(
    ofType(JobAdsActions.loadJobAds),
    mergeMap(action => this.dataService.getJobs(action.keyword)
      .pipe(
        map((jobAds: JobAd[]) => JobAdsActions.loadJobAdsSuccess({ jobAds })),
        catchError(error => of(JobAdsActions.loadJobAdsFailure({ error })))
      ))
  ));
  
  createJobAds$ = createEffect(() => this.actions$.pipe(
    ofType(JobAdsActions.createJobAd),
    mergeMap(action => this.dataService.createJob( action.jobAd )
      .pipe(
        map((jobAd: JobAd) => {
          return JobAdsActions.createJobAdSuccess({ jobAd })
        }),
        catchError(error => of(JobAdsActions.createJobAdFailure({ error })))
      ))
  ));

  createJobAdSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(JobAdsActions.createJobAdSuccess),
    tap(() => {
      this.router.navigate(['/job-ads']);
    })),
    { dispatch: false }
  );

  editJobAd$ = createEffect(() => this.actions$.pipe(
    ofType(JobAdsActions.editJobAd),
    mergeMap(action => this.dataService.updateJob(action.jobAd.id as number, action.jobAd.changes).pipe(
      map((updatedJobAd: JobAd) => {
        const update: Update<JobAd> = {
          id: updatedJobAd.id,
          changes: updatedJobAd
        };
        return JobAdsActions.editJobAdSuccess({ jobAd: update });
      }),
      catchError(error => of(JobAdsActions.editJobAdFailure({ error })))
    ))
  ));

  editJobAdSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JobAdsActions.editJobAdSuccess),
        tap(() => {
          this.router.navigate(['/job-ads']);
        })
      ),
    { dispatch: false }
  );

  changeJobAdStatus$ = createEffect(() => this.actions$.pipe(
    ofType(JobAdsActions.changeJobAdStatus),
    mergeMap(action => this.dataService.updateJob(action.jobAd.id as number, action.jobAd.changes).pipe(
      map((updatedJobAd: JobAd) => {
        const update: Update<JobAd> = {
          id: updatedJobAd.id,
          changes: { status: updatedJobAd.status }
        };
        return JobAdsActions.changeJobAdStatusSuccess({ jobAd: update });
      }),
      catchError(error => of(JobAdsActions.changeJobAdStatusFailure({ error })))
    ))
  ));

  removeJobAds$ = createEffect(() => this.actions$.pipe(
    ofType(JobAdsActions.deleteJobAd),
    mergeMap(action => this.dataService.removeJob( action.jobAd )
      .pipe(
        map((jobAd: JobAd) => {
          return JobAdsActions.deleteJobAdSuccess({ jobAd })
        }),
        catchError(error => of(JobAdsActions.createJobAdFailure({ error })))
      ))
  ));
  
}
