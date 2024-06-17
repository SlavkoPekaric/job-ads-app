import { TestBed } from '@angular/core/testing';
import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent], // Import the standalone component
    }).compileComponents();
  });

  it('should create the NotFoundPageComponent', () => {
    const fixture = TestBed.createComponent(NotFoundPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render h1 element with text "404"', () => {
    const fixture = TestBed.createComponent(NotFoundPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h1Element = compiled.querySelector('h1');
    expect(h1Element?.textContent).toContain('404');
  });
});
