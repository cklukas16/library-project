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
  coverUrl: string | undefined;
  coverFile: File | undefined;
  coverView: any;

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
    this.bookService.getBook(id).subscribe(book => {
      this.book = book;
      this.coverUrl = book.cover;
    });
  }

  save(): void {
    if (this.book) {
      let book = this.book;
      if (this.coverFile) {
        const formData = new FormData();
        formData.append('cover', this.coverFile, `cover${book.id}.jpg`);
        this.bookService.addCover(formData).subscribe(cover => {book.cover = cover.url});
      }
      window.location.reload();
      this.bookService.updateBook(book).subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }

  onFileSelected(event: any) {
    this.coverFile = event.target.files[0];
    if (this.coverFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.coverFile);
      reader.onload= () => { this.coverView = reader.result}
    }
  }
}