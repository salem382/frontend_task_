import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookformComponent } from './bookform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BooksService } from '../../../core/services/books.service';
import { AlertService } from '../../../core/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IBook } from '../../../core/models/book.model';
import { By } from '@angular/platform-browser';

describe('BookformComponent', () => {
  let component: BookformComponent;
  let fixture: ComponentFixture<BookformComponent>;
  let booksService: jasmine.SpyObj<BooksService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockBook: IBook = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    category: 'Fiction',
    price: 10.99,
    description: 'Test Description'
  };

  beforeEach(async () => {
    const booksServiceSpy = jasmine.createSpyObj('BooksService', ['Add', 'Update', 'GetByID']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showMessage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [BookformComponent],
      providers: [
        { provide: BooksService, useValue: booksServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    booksService = TestBed.inject(BooksService) as jasmine.SpyObj<BooksService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(BookformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values when no ID', () => {
      expect(component.bookForm.value).toEqual({
        title: '',
        author: '',
        category: '',
        price: '',
        description: ''
      });
    });

    it('should load book data when ID exists', () => {
      activatedRoute.snapshot.paramMap.get.and.returnValue('1');
      booksService.GetByID.and.returnValue(of(mockBook));
      
      fixture = TestBed.createComponent(BookformComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
      expect(booksService.GetByID).toHaveBeenCalledWith('1');
      expect(component.bookForm.value).toEqual({
        title: mockBook.title,
        author: mockBook.author,
        category: mockBook.category,
        price: mockBook.price,
        description: mockBook.description
      });
    });
  });

  describe('Form Validation', () => {
    it('should make title required', () => {
      const titleControl = component.bookForm.get('title');
      titleControl?.setValue('');
      expect(titleControl?.valid).toBeFalsy();
      expect(titleControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate title min length', () => {
      const titleControl = component.bookForm.get('title');
      titleControl?.setValue('ab');
      expect(titleControl?.valid).toBeFalsy();
      expect(titleControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should make author required', () => {
      const authorControl = component.bookForm.get('author');
      authorControl?.setValue('');
      expect(authorControl?.valid).toBeFalsy();
      expect(authorControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate author min length', () => {
      const authorControl = component.bookForm.get('author');
      authorControl?.setValue('ab');
      expect(authorControl?.valid).toBeFalsy();
      expect(authorControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should make price required', () => {
      const priceControl = component.bookForm.get('price');
      priceControl?.setValue('');
      expect(priceControl?.valid).toBeFalsy();
      expect(priceControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate price minimum value', () => {
      const priceControl = component.bookForm.get('price');
      priceControl?.setValue(-1);
      expect(priceControl?.valid).toBeFalsy();
      expect(priceControl?.errors?.['min']).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.bookForm.setValue({
        title: 'Valid Title',
        author: 'Valid Author',
        category: 'Fiction',
        price: 10.99,
        description: 'Valid Description'
      });
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
      expect(submitButton.disabled).toBeFalsy();
    });

    it('should disable submit button when form is invalid', () => {
      component.bookForm.setValue({
        title: '',
        author: '',
        category: '',
        price: '',
        description: ''
      });
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
      expect(submitButton.disabled).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.bookForm.setValue({
        title: 'Test Book',
        author: 'Test Author',
        category: 'Fiction',
        price: 10.99,
        description: 'Test Description'
      });
    });

    it('should call add method when no ID', () => {
      booksService.Add.and.returnValue(of({} as IBook));
      
      component.onSubmit();
      
      expect(booksService.Add).toHaveBeenCalledWith(component.bookForm.value);
      expect(router.navigate).toHaveBeenCalledWith(['/features/book/list']);
      expect(alertService.showMessage).toHaveBeenCalledWith('success', 'تم الحفظ بنجاح');
    });

    it('should call update method when ID exists', () => {
      component.id = '1';
      booksService.Update.and.returnValue(of({} as IBook));
      
      component.onSubmit();
      
      expect(booksService.Update).toHaveBeenCalledWith(component.bookForm.value, '1');
      expect(router.navigate).toHaveBeenCalledWith(['/features/book/list']);
      expect(alertService.showMessage).toHaveBeenCalledWith('success', 'تم التعديل بنجاح');
    });

    it('should not submit when form is invalid', () => {
      component.bookForm.get('title')?.setValue('');
      component.onSubmit();
      
      expect(booksService.Add).not.toHaveBeenCalled();
      expect(booksService.Update).not.toHaveBeenCalled();
    });

    it('should show error messages when invalid fields are touched', () => {
      const titleInput = fixture.debugElement.query(By.css('#title')).nativeElement;
      titleInput.value = '';
      titleInput.dispatchEvent(new Event('input'));
      titleInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      const errorMessage = fixture.debugElement.query(By.css('.error-message')).nativeElement;
      expect(errorMessage.textContent).toContain('Title is required');
    });
  });

  describe('UI Interactions', () => {
    it('should update form control values on input', () => {
      const titleInput = fixture.debugElement.query(By.css('#title')).nativeElement;
      titleInput.value = 'New Title';
      titleInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.bookForm.get('title')?.value).toBe('New Title');
    });

    it('should show validation errors when submitting invalid form', () => {
      const form = fixture.debugElement.query(By.css('form')).nativeElement;
      form.dispatchEvent(new Event('submit'));
      fixture.detectChanges();
      
      const errorMessages = fixture.debugElement.queryAll(By.css('.error-message'));
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });
});