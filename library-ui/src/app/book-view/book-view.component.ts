import { Component, Input, OnInit } from '@angular/core';
import { BookService } from '../shared/book.service';
import { Book } from '../models/book';

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.css']
})
export class BookViewComponent implements OnInit {
  @Input() id: number = 0;
  book: Book | undefined;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.getBook();
  }
  
  getBook(): void {
    this.bookService.getBook(this.id).subscribe(book => {
      this.book = book;
    });
  }

}