import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { JobAdItemComponent } from './job-ad-item.component';
import { JobAdsState, selectJobAdById } from '../../store';
import { JobAd } from '../../../shared/models/job-ad.model';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { provideRouter, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { routes } from '../../../app.routes';

describe('JobAdItemComponent', () => {
  let component: JobAdItemComponent;
  let fixture: ComponentFixture<JobAdItemComponent>;
  let store: MockStore<JobAdsState>;

  const mockJobAd: JobAd = {
    id: 1,
    title: 'Title',
    description: 'Description',
    skills: ['testskill1', 'testskill2'],
    status: 'draft'
  };

  const initialState: JobAdsState = {
    ids: [1],
    entities: {
      1: mockJobAd
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
        JobAdItemComponent
      ],
      providers: [
        provideMockStore({
          initialState: {
            jobAds: initialState
          }
        }),
        provideRouter(routes)
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<JobAdsState>;

    store.overrideSelector(selectJobAdById(1), mockJobAd);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdItemComponent);
    component = fixture.componentInstance;
    component.id = 1;
    fixture.detectChanges();
  });

  it('should create the JobAdItemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize jobAd$ observable with the selected job ad', waitForAsync(() => {
    component.jobAd$.subscribe(jobAd => {
      expect(jobAd).toEqual(mockJobAd);
    });
  }));

  it('should render the job ad details', waitForAsync(() => {
    fixture.detectChanges(); // Ensure the DOM is updated
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Ensure the DOM is updated after async pipe resolves
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-list-item:nth-child(1)')?.textContent).toContain('Title: Title');
      expect(compiled.querySelector('mat-list-item:nth-child(2)')?.textContent).toContain('ID: 1');
      expect(compiled.querySelector('mat-list-item:nth-child(3)')?.textContent).toContain('Description: Description');
      expect(compiled.querySelector('mat-list-item:nth-child(4)')?.textContent).toContain('Skills: testskill1,testskill2');
      expect(compiled.querySelector('mat-list-item:nth-child(5)')?.textContent).toContain('Status: draft');
    });
  }));

  it('should render the edit button when editToggle is true', waitForAsync(() => {
    fixture = TestBed.createComponent(JobAdItemComponent);
    component = fixture.componentInstance;
    component.editToggle = true;
    component.id = 1;
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('button')?.textContent).toContain('Edit Job');
    });
  }));

  it('should render "Invalid job." if no job ad found', waitForAsync(() => {
    // Recreate the component with a different ID
    fixture = TestBed.createComponent(JobAdItemComponent);
    component = fixture.componentInstance;
    component.id = 2; // Set an ID that does not exist
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Invalid job.');
    });
  }));
});
