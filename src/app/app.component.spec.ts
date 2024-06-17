import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        NoopAnimationsModule,
        AppComponent,
      ],
      providers: [
        provideRouter(routes)
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'job-ads-coding-challenge'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('job-ads-coding-challenge');
  });

  it('should render header link elements "Job Ads" and "Invoices"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const jobAdsLink = compiled.querySelector('a[routerLink="/job-ads"]');
    const invoicesLink = compiled.querySelector('a[routerLink="/invoices"]');
    expect(jobAdsLink?.textContent).toContain('Job Ads');
    expect(invoicesLink?.textContent).toContain('Invoices');
  });

  it('should render element with css class "content-container"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const contentContainer = compiled.querySelector('.content-container');
    expect(contentContainer).toBeTruthy();
  });
});

