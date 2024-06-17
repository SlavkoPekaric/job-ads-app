import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { Invoice } from '../../../shared/models/invoice.model';
import { select, Store } from '@ngrx/store';
import { InvoicesState, selectInvoiceById } from '../../store';

/**
 * Component to display a single invoice item.
 */
@Component({
  selector: 'invoice-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatButtonModule
  ]
})
export class InvoiceItemComponent implements OnInit {
  /**
   * The ID of the job ad to display.
   */
  @Input() id?: number;

  /**
   * Observable that emits the invoice to display.
   */
  invoice$: Observable<Invoice | undefined> = EMPTY;

  /**
   * The ID of the invoice.
   */
  invoiceId: number | null = null;

  constructor(private store: Store<InvoicesState>) {}

  /**
   * Initializes the invoice observable if the ID is provided.
   */
  ngOnInit(): void {
    if (typeof this.id !== 'undefined') {
      this.invoice$ = this.store.pipe(select(selectInvoiceById(this.id)));
    }
  }
}
