import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import * as invoiceSelectors from '../../store/selectors';
import * as InvoicesActions from '../../store/actions';
import { InvoicesState } from '../../store/reducers';

import { Invoice } from '../../../shared/models/invoice.model';
import { JobAdItemComponent } from '../../../job-ads/components/job-ad-item/job-ad-item.component';
import { InvoiceItemComponent } from '../invoice-item/invoice-item.component';

/**
 * Component to display a list of invoices.
 */
@Component({
  selector: 'invoice-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  imports: [
    CommonModule,
    MatListModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule,
    JobAdItemComponent,
    InvoiceItemComponent
  ]
})
export class InvoiceListComponent implements OnInit {
  /**
   * Observable that emits an array of invoices.
   */
  invoices$: Observable<Invoice[]> = this.store.select(invoiceSelectors.selectAllInvoices);

  constructor(private store: Store<InvoicesState>) {}

  /**
   * Initializes the data by dispatching an action to load invoices if they are not already loaded.
   */
  ngOnInit(): void {
    this.initData();
  }

  /**
   * Initializes the data by checking if invoices are loaded, and if not, dispatches an action to load them.
   */
  private initData(): void {
    this.store.select(invoiceSelectors.selectInvoicesLoaded).pipe(
      first(),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(InvoicesActions.loadInvoices());
        }
      })
    ).subscribe();
  }
}
