import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { JobAdFormComponent } from './job-ad-form.component';
import { JobAdsState, selectJobAdById } from '../../store';
import { JobAd } from '../../../shared/models/job-ad.model';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as JobAdsActions from '../../store/actions';
import { routes } from '../../../app.routes';

describe('JobAdFormComponent', () => {
  let component: JobAdFormComponent;
  let fixture: ComponentFixture<JobAdFormComponent>;
  let store: MockStore<JobAdsState>;

  const mockJobAd: JobAd = {
    id: 1,
    title: 'Title',
    description: 'Description',
    skills: ['testskill1', 'testskill2'],
    status: 'draft'
  };

  const initialState: JobAdsState = {
    entities: {
      1: mockJobAd
    },
    ids: [1],
    loading: false,
    loaded: true,
    error: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatButtonModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        JobAdFormComponent
      ],
      providers: [
        provideRouter(routes),
        provideMockStore({ initialState: { jobAds: initialState } }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]      
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<JobAdsState>;

    store.overrideSelector(selectJobAdById(1), mockJobAd);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the JobAdFormComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form in edit mode when jobId is present', waitForAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    component.jobAd$.subscribe(jobAd => {
      expect(jobAd).toEqual(mockJobAd);
      expect(component.jobAdForm.value.title).toEqual(mockJobAd.title);
      expect(component.jobAdForm.value.description).toEqual(mockJobAd.description);
      expect(component.jobAdForm.value.skills).toEqual(mockJobAd.skills);
      // expect(component.jobAdForm.value.status).toEqual(mockJobAd.status);
    });
  }));

  it('should render the correct title for edit mode', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent).toContain('Edit Job Ad');
  });

  it('should render the correct title for create mode', () => {
    component.isEdit = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent).toContain('Create New Job Ad');
  });

  it('should dispatch createJobAd action on submit when form is valid and in create mode', () => {
    spyOn(store, 'dispatch');
    component.isEdit = false;
    const newJobAdObj = {
      title: 'New Job Ad',
      description: 'Description.',
      skills: ['testskill'],
      status: 'draft'
    }
    component.jobAdForm.setValue(newJobAdObj);
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(JobAdsActions.createJobAd({
      // @ts-ignore
      jobAd: newJobAdObj
    }));
  });

  it('should dispatch editJobAd action on submit when form is valid and in edit mode', () => {
    spyOn(store, 'dispatch');
    component.isEdit = true;
    component.jobId = 1;
    const updatedJobAdObj = {
      title: 'Updated Job Ad',
      description: 'Description',
      skills: ['testskill'],
      status: 'published'
    }
    component.jobAdForm.setValue(updatedJobAdObj);
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(JobAdsActions.editJobAd({
      jobAd: {
        id: 1,
        changes: {
          title: 'Updated Job Ad',
          description: 'Description',
          skills: ['testskill'],
          status: 'published'
        }
      }
    }));
  });

  it('should not dispatch any action on submit when form is invalid', () => {
    spyOn(store, 'dispatch');
    component.isEdit = false;
    component.jobAdForm.setValue({
      title: '',
      description: '',
      skills: '',
      status: ''
    });
    component.onSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
