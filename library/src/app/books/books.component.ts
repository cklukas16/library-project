import { Component, OnInit } from '@angular/core';
import { BookService } from '../shared/book.service';
import { UserService } from '../shared/user.service';
import { Book } from '../models/book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  userID: any = this.userService.currentUser?.email;
  
  constructor(
    private bookService: BookService, 
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.bookService.getBooks().subscribe(books => this.books = books);
  }

  delete(book: Book): void {
    this.books = this.books.filter(b => b !== book);
    this.bookService.deleteBook(book.id).subscribe();
  }

  add(): void {
    this.bookService.addBook({} as Book).subscribe(book => {
        this.books.push(book);
      });
  }

  // check user type
  isAdmin(): boolean {
    return this.userService.currentUser?.email === 'admin@example.com';
  }
}