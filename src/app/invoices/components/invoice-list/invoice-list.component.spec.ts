import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { InvoiceListComponent } from './invoice-list.component';
import { InvoicesState, selectAllInvoices, selectInvoicesLoaded } from '../../store';
import { Invoice } from '../../../shared/models/invoice.model';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as InvoicesActions from '../../store/actions';
import { JobAdItemComponent } from '../../../job-ads/components/job-ad-item/job-ad-item.component';
import { InvoiceItemComponent } from '../invoice-item/invoice-item.component';
import { Store } from '@ngrx/store';
import { JobAdsState } from '../../../job-ads/store';
import { JobAd } from '../../../shared/models/job-ad.model';

describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent;
  let fixture: ComponentFixture<InvoiceListComponent>;
  let store: MockStore<InvoicesState>;

  const mockInvoices: Invoice[] = [
    {
      id: 1,
      jobAdId: 101,
      amount: 1500,
      dueDate: new Date('2023-06-01')
    },
    {
      id: 2,
      jobAdId: 102,
      amount: 2000,
      dueDate: new Date('2023-06-15')
    }
  ];

  const mockJobAds: JobAd[] = [
    {
      id: 1,
      title: 'Title 1',
      description: 'Description 1',
      skills: ['testskill1', 'testskill2'],
      status: 'draft'
    },
    {
      id: 2,
      title: 'Title 2',
      description: 'Description 2',
      skills: ['testskill1', 'testskill2'],
      status: 'published'
    }
  ];

  const initialStateJobAds: JobAdsState = {
    entities: {
      1: mockJobAds[0],
      2: mockJobAds[1]
    },
    ids: [1, 2],
    loading: false,
    loaded: false,
    error: null
  };

  const initialStateInvoices: InvoicesState = {
    ids: [1, 2],
    entities: {
      1: mockInvoices[0],
      2: mockInvoices[1]
    },
    loading: false,
    loaded: false,
    error: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatListModule,
        MatExpansionModule,
        FlexLayoutModule,
        MatButtonModule,
        BrowserAnimationsModule,
        InvoiceListComponent,
        JobAdItemComponent,
        InvoiceItemComponent
      ],
      providers: [
        provideMockStore({
          initialState: { 
            invoices: initialStateInvoices,
            jobAds: initialStateJobAds
          }
        })
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<InvoicesState>;

    store.overrideSelector(selectAllInvoices, mockInvoices);
    store.overrideSelector(selectInvoicesLoaded, false); // Mock it as false initially
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the InvoiceListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize invoices$ observable with the list of invoices', waitForAsync(() => {
    component.invoices$.subscribe(invoices => {
      expect(invoices).toEqual(mockInvoices);
    });
  }));

  it('should dispatch loadInvoices action on init when not loaded', () => {
    const action = InvoicesActions.loadInvoices();
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should not dispatch loadInvoices action on init when already loaded', () => {
    store.overrideSelector(selectInvoicesLoaded, true);
    const action = InvoicesActions.loadInvoices();
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

  it('should render the invoice titles', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const titles = compiled.querySelectorAll('mat-panel-title');
      expect(titles.length).toBe(2);
      expect(titles[0].textContent).toContain('Invoice #1');
      expect(titles[1].textContent).toContain('Invoice #2');
    });
  }));

  it('should render the job ad data for each invoice', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const jobData = compiled.querySelectorAll('job-ad-item');
      expect(jobData.length).toBe(2);
    });
  }));

  it('should render the invoice data for each invoice', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const invoiceData = compiled.querySelectorAll('invoice-item');
      expect(invoiceData.length).toBe(2);
    });
  }));
});
