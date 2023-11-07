import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BookService } from '../book.service';
import { Book } from '../book';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getBook();
  }
  
  getBook(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.bookService.getBook(id).subscribe(book => this.book = book);
  }

  getUrl(thumbnail: boolean): string {
    if (thumbnail) {
      return `../../assets/covers/${this.book?.cover}S.jpg`;
    } else {
      return `../../assets/covers/${this.book?.cover}L.jpg`;
    }
  }

  save(): void {
    if (this.book) {
      this.bookService.updateBook(this.book).subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }
}
