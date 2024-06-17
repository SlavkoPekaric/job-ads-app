import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { JobAd } from '../../../shared/models/job-ad.model';
import { select, Store } from '@ngrx/store';
import { JobAdsState, selectJobAdById } from '../../store';

/**
 * Component to display a single job ad item.
 */
@Component({
  selector: 'job-ad-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './job-ad-item.component.html',
  styleUrls: ['./job-ad-item.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatButtonModule
  ]
})
export class JobAdItemComponent implements OnInit {
  /**
   * The ID of the job ad to display.
   */
  @Input() id?: number;

  /**
   * Toggle to indicate if the job display has an edit button visible
   */
  @Input() editToggle: boolean = false;
  
  /**
   * Observable that emits the job ad to display.
   */
  jobAd$: Observable<JobAd | undefined> = EMPTY;

  /**
   * The ID of the job ad.
   */
  jobId: number | null = null;

  constructor(private store: Store<JobAdsState>) {}

  /**
   * Initializes the job ad observable if the ID is provided.
   */
  ngOnInit(): void {
    if (typeof this.id !== 'undefined') {
      this.jobAd$ = this.store.pipe(select(selectJobAdById(this.id)));
    }
  }
}
