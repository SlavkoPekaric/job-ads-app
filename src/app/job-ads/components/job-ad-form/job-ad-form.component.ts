import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { JobAdsStore } from '../../store/job-ads.store';
import * as JobAdsActions from '../../store/actions';
import { JobAd } from '../../../shared/models/job-ad.model';
import { JobAdsState, selectJobAdById } from '../../store';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

/**
 * Component for the job ad form.
 */
@Component({
  selector: 'job-ad-form',
  standalone: true,
  templateUrl: './job-ad-form.component.html',
  styleUrls: ['./job-ad-form.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule
  ],
  providers: [JobAdsStore]
})
export class JobAdFormComponent implements OnInit {
  /**
   * The form group for the job ad form.
   * @type {FormGroup}
   */
  jobAdForm!: FormGroup;

  /**
   * Observable that emits the job ad to edit (if in edit mode).
   * @type {Observable<JobAd | undefined>}
   */
  jobAd$: Observable<JobAd | undefined> = EMPTY;

  /**
   * The ID of the job ad (if in edit mode).
   * @type {number | null}
   */
  jobId: number | null = null;

  /**
   * Indicates whether the form is in edit mode.
   * @type {boolean}
   */
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<JobAdsState>
  ) {}

  /**
   * Initializes the form and loads the job ad if in edit mode.
   */
  ngOnInit(): void {
    const selectedJobId = this.route.snapshot.paramMap.get('id');

    if (selectedJobId) {
      this.jobId = parseInt(selectedJobId);
      this.isEdit = true;
    }

    this.initForm();
    
    if (this.isEdit) {
      this.store.dispatch(JobAdsActions.loadJobAds({}));
      if (this.jobId) {
        this.jobAd$ = this.store.pipe(select(selectJobAdById(this.jobId)));
        this.jobAd$.subscribe(jobAd => {
          if (jobAd) {
            this.jobAdForm.patchValue(jobAd);
          }
        });
      }
    }
  }

  /**
   * Initialize the form.
   */
  initForm(): void {
    this.jobAdForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [
        Validators.required,
        Validators.minLength(10)]
      ],
      skills: ['', [Validators.required]],
      status: [{ value: '', disabled: this.isEdit }, [Validators.required]]
    });
  }

  /**
   * Handles form submission.
   * Dispatches appropriate actions to create or update a job ad.
   */
  onSubmit(): void {
    if (this.jobAdForm.valid) {
      // Enable the status control to include its value in the form
      this.jobAdForm.get('status')?.enable();
      
      const jobAd: JobAd = this.jobAdForm.value;

      if (this.isEdit && this.jobId !== null) {
        const update: Update<JobAd> = {
          id: this.jobId,
          changes: jobAd
        };
        this.store.dispatch(JobAdsActions.editJobAd({ jobAd: update }));
      } else {
        this.store.dispatch(JobAdsActions.createJobAd({ jobAd }));
      }

      // Re-disable the status control if the form is in edit mode
      if (this.isEdit) {
        this.jobAdForm.get('status')?.disable();
      }
    }
  }
}
