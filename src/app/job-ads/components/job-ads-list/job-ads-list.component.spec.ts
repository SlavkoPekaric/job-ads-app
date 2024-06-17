import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { JobAdsListComponent } from './job-ads-list.component';
import { JobAdsState, selectAllJobAds, selectJobAdsLoading, selectJobAdsError, selectJobAdsLoaded } from '../../store';
import { JobAd, JobAdStatus } from '../../../shared/models/job-ad.model';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as JobAdsActions from '../../store/actions';
import { routes } from '../../../app.routes';

describe('JobAdsListComponent', () => {
  let component: JobAdsListComponent;
  let fixture: ComponentFixture<JobAdsListComponent>;
  let store: MockStore<JobAdsState>;

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

  const initialState: JobAdsState = {
    entities: {
      1: mockJobAds[0],
      2: mockJobAds[1]
    },
    ids: [1, 2],
    loading: false,
    loaded: false,
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
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        JobAdsListComponent
      ],
      providers: [
        provideMockStore({ initialState: { jobAds: initialState } }),
        provideRouter(routes)
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<JobAdsState>;

    store.overrideSelector(selectAllJobAds, mockJobAds);
    store.overrideSelector(selectJobAdsLoading, false);
    store.overrideSelector(selectJobAdsError, null);
    store.overrideSelector(selectJobAdsLoaded, false); // Mock it as false initially
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the JobAdsListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize jobAds$ observable with the list of job ads', waitForAsync(() => {
    component.jobAds$.subscribe(jobAds => {
      expect(jobAds).toEqual(mockJobAds);
    });
  }));

  it('should render the job ads titles', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const titles = compiled.querySelectorAll('mat-panel-title');
      expect(titles.length).toBe(2);
      expect(titles[0].textContent).toContain(mockJobAds[0].title);
      expect(titles[1].textContent).toContain(mockJobAds[1].title);
    });
  }));

  it('should dispatch loadJobAds action on init when not loaded', () => {
    const action = JobAdsActions.loadJobAds({});
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should not dispatch loadJobAds action on init when already loaded', () => {
    store.overrideSelector(selectJobAdsLoaded, true);
    const action = JobAdsActions.loadJobAds({});
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).not.toHaveBeenCalledWith(action);
  });

  it('should dispatch search action when searchControl value changes', fakeAsync(() => {
    spyOn(store, 'dispatch');
    const searchValue = 'test';
    component.searchControl.setValue(searchValue);
    tick(500);
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(JobAdsActions.loadJobAds({ keyword: searchValue }));
  }));

  it('should dispatch deleteJobAd action on delete', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(store, 'dispatch');
    component.onDelete(mockJobAds[0]);
    expect(store.dispatch).toHaveBeenCalledWith(JobAdsActions.deleteJobAd({ jobAd: mockJobAds[0] }));
  });

  it('should dispatch changeJobAdStatus action on status change', () => {
    spyOn(store, 'dispatch');
    const update = {
      id: mockJobAds[0].id as number,
      changes: { status: 'published' as JobAdStatus }
    };
    component.onChangeStatus(mockJobAds[0].id as number, 'published' as JobAdStatus);
    expect(store.dispatch).toHaveBeenCalledWith(JobAdsActions.changeJobAdStatus({ jobAd: update }));
  });
});
