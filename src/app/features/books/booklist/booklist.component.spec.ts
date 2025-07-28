import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BooklistComponent } from './booklist.component';
import { BooksService } from '../../../core/services/books.service';
import { AlertService } from '../../../core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { IBook } from '../../../core/models/book.model';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { By } from '@angular/platform-browser';

describe('BooklistComponent', () => {
  let component: BooklistComponent;
  let fixture: ComponentFixture<BooklistComponent>;
  let booksService: jasmine.SpyObj<BooksService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  const mockBooks: IBook[] = [
    { id: '1', title: 'Book 1', author: 'Author 1', category: 'Fiction', price: 10.99, description: 'Description 1' },
    { id: '2', title: 'Book 2', author: 'Author 2', category: 'Non-Fiction', price: 15.99, description: 'Description 2' }
  ];

  beforeEach(async () => {
    const booksServiceSpy = jasmine.createSpyObj('BooksService', ['GetAll', 'Delete']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showMessage']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatMenuModule,
        RouterTestingModule
      ],
      declarations: [BooklistComponent],
      providers: [
        { provide: BooksService, useValue: booksServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy }
      ]
    }).compileComponents();

    booksService = TestBed.inject(BooksService) as jasmine.SpyObj<BooksService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    changeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

    booksService.GetAll.and.returnValue(of(mockBooks));
    
    fixture = TestBed.createComponent(BooklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load books on init', () => {
      expect(booksService.GetAll).toHaveBeenCalledWith('', '');
      expect(component.books()).toEqual(mockBooks);
    });

    it('should initialize form controls', () => {
      expect(component.searchControl).toBeTruthy();
      expect(component.sortControl).toBeTruthy();
    });
  });

  describe('Search Functionality', () => {
    it('should debounce search input', fakeAsync(() => {
      component.searchControl.setValue('test');
      tick(300); // Not enough for debounce
      expect(booksService.GetAll).toHaveBeenCalledTimes(1); // Initial load
      
      tick(100); // Complete the debounce time (400ms total)
      expect(booksService.GetAll).toHaveBeenCalledTimes(2);
      expect(booksService.GetAll).toHaveBeenCalledWith('test', '');
    }));

    it('should not trigger search for same value', fakeAsync(() => {
      component.searchControl.setValue('test');
      tick(400);
      component.searchControl.setValue('test'); // Same value
      tick(400);
      expect(booksService.GetAll).toHaveBeenCalledTimes(2); // Initial + first search
    }));
  });

  describe('Sort Functionality', () => {
    it('should trigger sort when selection changes', () => {
      component.sortControl.setValue('price');
      expect(booksService.GetAll).toHaveBeenCalledTimes(2); // Initial + sort
      expect(booksService.GetAll).toHaveBeenCalledWith('', 'price');
    });
  });

  describe('Delete Functionality', () => {
    it('should open confirmation dialog on delete', () => {
      const mockDialogRef = { afterClosed: () => of(true) };
      dialog.open.and.returnValue(mockDialogRef as any);
      
      component.deleteItem('1');
      
      expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        width: '350px',
        data: { 
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete this item?'
        }
      });
    });

    it('should delete book when confirmed', () => {
      const mockDialogRef = { afterClosed: () => of(true) };
      dialog.open.and.returnValue(mockDialogRef as any);
      booksService.Delete.and.returnValue(of({} as IBook));
      
      component.deleteItem('1');
      
      expect(booksService.Delete).toHaveBeenCalledWith('1');
      expect(alertService.showMessage).toHaveBeenCalledWith('success', 'تم حذف العنصر بنجاح');
    });

    it('should not delete book when not confirmed', () => {
      const mockDialogRef = { afterClosed: () => of(false) };
      dialog.open.and.returnValue(mockDialogRef as any);
      
      component.deleteItem('1');
      
      expect(booksService.Delete).not.toHaveBeenCalled();
    });

    it('should handle delete error', () => {
      const mockDialogRef = { afterClosed: () => of(true) };
      dialog.open.and.returnValue(mockDialogRef as any);
      booksService.Delete.and.returnValue(throwError(() => new Error('Delete failed')));
      
      component.deleteItem('1');
      
      expect(booksService.Delete).toHaveBeenCalled();
      // Add expectation for error handling if you implement it
    });
  });

  describe('UI Interactions', () => {
    it('should display books in the grid', () => {
      fixture.detectChanges();
      const bookCards = fixture.debugElement.queryAll(By.css('.book-card'));
      expect(bookCards.length).toBe(mockBooks.length);
    });

    it('should display empty state when no books', () => {
      booksService.GetAll.and.returnValue(of([]));
      component.ngOnInit();
      fixture.detectChanges();
      
      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeTruthy();
    });

    it('should trigger search when typing in search box', fakeAsync(() => {
      const searchInput = fixture.debugElement.query(By.css('input[type="text"]')).nativeElement;
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input'));
      tick(400);
      fixture.detectChanges();
      
      expect(booksService.GetAll).toHaveBeenCalledWith('test', '');
    }));

    it('should trigger sort when selecting sort option', () => {
      const sortSelect = fixture.debugElement.query(By.css('select')).nativeElement;
      sortSelect.value = 'price';
      sortSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      
      expect(booksService.GetAll).toHaveBeenCalledWith('', 'price');
    });
  });

  describe('Error Handling', () => {
    it('should handle getAll error', () => {
      booksService.GetAll.and.returnValue(throwError(() => new Error('Load failed')));
      component.ngOnInit();
      
      // Add expectations for error handling if you implement it
      expect(booksService.GetAll).toHaveBeenCalled();
    });
  });
});