import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, distinctUntilChanged, first, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Update } from '@ngrx/entity';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import * as JobAdsActions from '../../store/actions';
import * as JobAdsSelectors from '../../store/selectors';
import { JobAd, JobAdStatus, JobAdsViewModel } from '../../../shared/models/job-ad.model';
import { JobAdsState } from '../../store';
import { JobAdItemComponent } from '../job-ad-item/job-ad-item.component';

/**
 * Component to display and manage a list of job ads.
 */
@Component({
  selector: 'job-ads-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './job-ads-list.component.html',
  styleUrls: ['./job-ads-list.component.scss'],
  imports: [
    CommonModule,
    MatListModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    JobAdItemComponent
  ]
})
export class JobAdsListComponent implements OnInit, OnDestroy {
  /**
   * Observable that emits the list of job ads.
   * @type {Observable<JobAd[]>}
   */
  jobAds$: Observable<JobAd[]>;

  /**
   * Observable that emits the loading state.
   * @type {Observable<boolean>}
   */
  loading$: Observable<boolean>;

  /**
   * Observable that emits any errors.
   * @type {Observable<any>}
   */
  error$: Observable<any>;

  /**
   * Form control for the search input.
   * @type {FormControl}
   */
  searchControl: FormControl = new FormControl();

  /**
   * Subject to manage the unsubscription of observables.
   * @type {Subject<void>}
   */
  private destroy$ = new Subject<void>();

  /**
   * ViewModel observable combining job ads, loading, and error state.
   * @type {Observable<JobAdsViewModel>}
   */
  readonly vm$: Observable<JobAdsViewModel>;

  constructor(private store: Store<JobAdsState>) {
    this.jobAds$ = this.store.select(JobAdsSelectors.selectAllJobAds);
    this.loading$ = this.store.select(JobAdsSelectors.selectJobAdsLoading);
    this.error$ = this.store.select(JobAdsSelectors.selectJobAdsError);

    this.vm$ = combineLatest([this.jobAds$, this.loading$, this.error$]).pipe(
      map(([jobAds, loading, error]): JobAdsViewModel => ({ jobAds, loading, error }))
    );
  }

  /**
   * Initializes data and search functionality.
   */
  ngOnInit(): void {
    this.initData();
    this.initSearch();
  }

  /**
   * Initializes data by loading job ads if not already loaded.
   */
  initData(): void {
    this.store.select(JobAdsSelectors.selectJobAdsLoaded).pipe(
      first(),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(JobAdsActions.loadJobAds({}));
        }
      })
    ).subscribe();
  }

  /**
   * Initializes the search functionality with debounce and distinct checks.
   */
  initSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value.length >= 3) {
        this.onSearchJobAds(value);
      } else {
        this.store.dispatch(JobAdsActions.loadJobAds({}));
      }
    });
  }

  /**
   * Dispatches an action to search for job ads based on the keyword.
   * @param {string} keyword - The search keyword.
   */
  onSearchJobAds(keyword: string): void {
    this.store.dispatch(JobAdsActions.loadJobAds({ keyword }));
  }

  /**
   * Dispatches an action to delete a job ad.
   * @param {JobAd} jobAd - The job ad to delete.
   */
  onDelete(jobAd: JobAd): void {
    if (confirm(`Are you sure you want to delete job ad "${jobAd.title}"?`)) {
      this.store.dispatch(JobAdsActions.deleteJobAd({ jobAd }));
    }
  }

  /**
   * Dispatches an action to change the status of a job ad.
   * @param {number} jobAdId - The ID of the job ad.
   * @param {JobAdStatus} newStatus - The new status to set.
   */
  onChangeStatus(jobAdId: number, newStatus: JobAdStatus): void {
    const update: Update<JobAd> = {
      id: jobAdId,
      changes: { status: newStatus }
    };
    this.store.dispatch(JobAdsActions.changeJobAdStatus({ jobAd: update }));
  }

  /**
   * Cleans up observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
