import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { LoadingService } from '../../core/services/loading.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [], {
      loading$: loadingSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [LoadingComponent],
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    }).compileComponents();

    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show loading overlay when loading is false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();
    
    const overlay = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(overlay).toBeNull();
  });

  it('should show loading overlay when loading is true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    
    const overlay = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(overlay).toBeTruthy();
    
    const spinner = fixture.debugElement.query(By.css('.spinner'));
    expect(spinner).toBeTruthy();
    
    const text = fixture.debugElement.query(By.css('p'));
    expect(text.nativeElement.textContent).toContain('Loading...');
  });

  it('should update visibility when loading state changes', () => {
    // Initial state - not loading
    loadingSubject.next(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.loading-overlay'))).toBeNull();
    
    // Change to loading
    loadingSubject.next(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.loading-overlay'))).toBeTruthy();
    
    // Change back to not loading
    loadingSubject.next(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.loading-overlay'))).toBeNull();
  });

  it('should have proper styling classes', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    
    const overlay = fixture.debugElement.query(By.css('.loading-overlay')).nativeElement;
    expect(overlay).toBeTruthy();
    
    const spinnerContainer = fixture.debugElement.query(By.css('.loading-spinner')).nativeElement;
    expect(spinnerContainer).toBeTruthy();
    
    const spinner = fixture.debugElement.query(By.css('.spinner')).nativeElement;
    expect(spinner).toBeTruthy();
  });
});