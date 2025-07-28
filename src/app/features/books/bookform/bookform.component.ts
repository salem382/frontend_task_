import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../../../core/services/books.service';
import { takeUntil } from 'rxjs';
import { BaseService } from '../../../core/utils/base.service';
import { IBook } from '../../../core/models/book.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';



@Component({
  selector: 'app-bookform',
  imports: [ReactiveFormsModule],
  templateUrl: './bookform.component.html',
  styleUrl: './bookform.component.css'
})
export class BookformComponent extends BaseService{

  bookForm: FormGroup;
  id:string | null = null;
    

  constructor(
    private fb: FormBuilder,
    private _BooksService:BooksService,
    private AlertService:AlertService, 
    private NagivateRoute: Router,
    private route: ActivatedRoute
   ) {
    super();
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      category: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  add():void {
    this._BooksService.Add(this.bookForm.value).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res:IBook)=> {
          this.NagivateRoute.navigate(['/features/book/list'])
          this.AlertService.showMessage('success', 'تم الحفظ بنجاح');
        }
      })
  }
  update(id:string):void {
    this._BooksService.Update(this.bookForm.value, id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res:IBook)=> {
          this.NagivateRoute.navigate(['/features/book/list'])
          this.AlertService.showMessage('success', 'تم التعديل بنجاح');
        }
      })
  }

  onSubmit() {
    if (this.bookForm.valid) {
      if (this.id) {
        this.update(this.id);
      } else {
        this.add();
      }
    }
  }

  getById(id:string):void {
    this._BooksService.GetByID(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res:IBook)=> {
          this.bookForm.patchValue(res);
        }
      })
  }

  ngOnInit():void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getById(this.id)
    }
  }
  
}
