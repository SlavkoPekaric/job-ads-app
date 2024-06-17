import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { InvoiceItemComponent } from './invoice-item.component';
import { InvoicesState, selectInvoiceById } from '../../store';
import { Invoice } from '../../../shared/models/invoice.model';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';

describe('InvoiceItemComponent', () => {
  let component: InvoiceItemComponent;
  let fixture: ComponentFixture<InvoiceItemComponent>;
  let store: MockStore<InvoicesState>;

  const mockInvoice: Invoice = {
    id: 1,
    jobAdId: 101,
    amount: 1500,
    dueDate: new Date('2023-06-01')
  };

  const initialState: InvoicesState = {
    ids: [1],
    entities: {
      1: mockInvoice
    },
    loading: false,
    loaded: true,
    error: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule,
        MatListModule,
        MatExpansionModule,
        FlexLayoutModule,
        MatButtonModule,
        BrowserAnimationsModule,
        InvoiceItemComponent
      ],
      providers: [
        provideMockStore({
          initialState: {
            invoices: initialState
          }
        })
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<InvoicesState>;

    store.overrideSelector(selectInvoiceById(1), mockInvoice);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemComponent);
    component = fixture.componentInstance;
    component.id = 1;
    fixture.detectChanges();
  });

  it('should create the InvoiceItemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize invoice$ observable with the selected invoice', waitForAsync(() => {
    component.invoice$.subscribe(invoice => {
      expect(invoice).toEqual(mockInvoice);
    });
  }));

  it('should render the invoice details', waitForAsync(() => {
    fixture.detectChanges(); // Ensure the DOM is updated
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Ensure the DOM is updated after async pipe resolves
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-list-item:nth-child(1)')?.textContent).toContain('ID: 1');
      expect(compiled.querySelector('mat-list-item:nth-child(2)')?.textContent).toContain('Job Ad ID: 101');
      expect(compiled.querySelector('mat-list-item:nth-child(3)')?.textContent).toContain('Amount: 1500');
      expect(compiled.querySelector('mat-list-item:nth-child(4)')?.textContent).toContain('Due Date: Jun 1, 2023');
    });
  }));

  it('should render "Invalid invoice." if no invoice found', waitForAsync(() => {
    // Recreate the component with a different ID
    fixture = TestBed.createComponent(InvoiceItemComponent);
    component = fixture.componentInstance;
    component.id = 2; // Set an ID that does not exist
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Ensure the DOM is updated after async pipe resolves
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Invalid invoice.');
    });
  }));
});
