import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  description: string;
}


@Component({
  selector: 'app-booklist',
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './booklist.component.html',
  styleUrl: './booklist.component.css'
})
export class BooklistComponent {
  
   books = [
    {
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "category": "Software",
      "price": 39.99,
      "description": "A handbook of Agile software craftsmanship."
    },
    {
      "title": "Design Patterns",
      "author": "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      "category": "Software",
      "price": 49.99,
      "description": "Elements of Reusable Object-Oriented Software."
    },
    {
      "title": "The Pragmatic Programmer",
      "author": "Andrew Hunt, David Thomas",
      "category": "Software",
      "price": 35.99,
      "description": "Your journey to mastery starts here."
    },
    {
      "title": "Refactoring",
      "author": "Martin Fowler",
      "category": "Software",
      "price": 42.99,
      "description": "Improving the design of existing code."
    }
  ];
   editingBook: Book | null = null;
  showAddForm = false;
  newBook: Partial<Book> = {};

  editBook(book: Book) {
    this.editingBook = { ...book };
  }

  saveEdit() {
    if (this.editingBook) {
      const index = this.books.findIndex((b:any) => b.id === this.editingBook!.id);
      if (index !== -1) {
        this.books[index] = { ...this.editingBook } as Book;
      }
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingBook = null;
  }

  deleteBook(id: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.books = this.books.filter((book:any) => book.id !== id);
    }
  }

  addBook() {
    const newId = Math.max(...this.books.map((b:any) => b.id)) + 1;
    // this.books.push({
    //   id: newId,
    //   title: this.newBook.title || '',
    //   author: this.newBook.author || '',
    //   category: this.newBook.category || '',
    //   price: this.newBook.price || 0,
    //   description: this.newBook.description || ''
    // });
    this.cancelAdd();
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newBook = {};
  }
}
