import { ChangeDetectorRef, Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { BaseService } from '../../../core/utils/base.service';
import { IBook } from '../../../core/models/book.model';
import { BooksService } from '../../../core/services/books.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertService } from '../../../core/services/alert.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-booklist',
  imports: [MatButtonModule, MatMenuModule, RouterModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './booklist.component.html',
  styleUrl: './booklist.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush, // <-- Enable OnPush
})
export class BooklistComponent extends BaseService{


 
books = signal<IBook[]>([]);

  isLoading = signal(false);
    
  // Search and Sort Controls
  searchControl = new FormControl('');
  sortControl = new FormControl('');
  
  // Destroy subject for cleanup
  
  private searchSubject$ = new Subject<void>();

constructor(private cdr: ChangeDetectorRef, private _BooksService:BooksService, private dialog: MatDialog, private AlertService:AlertService) {
  super();
}
  
GetAll():void {
  const searchTerm = this.searchControl.value || '';
  const sortOption = this.sortControl.value || '';
  
  this._BooksService.GetAll(searchTerm, sortOption).pipe(takeUntil(this.destroy$)).subscribe({
    next:(res:IBook[])=> {
      this.books.set(res)
      this.cdr.detectChanges();
    }
  })
}
delete(id:string) {
   this._BooksService.Delete(id).pipe(takeUntil(this.destroy$)).subscribe({
    next:(res:IBook)=> {
      this.books.update(currentBooks => 
        currentBooks.filter(book => book.id !== id)
      );
      this.AlertService.showMessage('success', 'تم حذف العنصر بنجاح');
      this.cdr.detectChanges();
    }
  })
}

deleteItem(itemId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(itemId)
      }
    });
}

ngOnInit():void {
  this.GetAll();
   // Setup search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.searchSubject$.next();
    });
    
    // React to sort changes
    this.sortControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.searchSubject$.next();
    });
    
    // Handle combined search and sort requests
    this.searchSubject$.pipe(
      switchMap(async () => this.GetAll())
    ).subscribe();
}

}
