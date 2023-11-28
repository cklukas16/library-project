import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BookService } from '../shared/book.service';
import { Book } from '../models/book';
import { UserService } from '../shared/user.service';
import { Borrow, User } from '../models/user';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;
  coverFile: File | undefined;
  coverView: any;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getBook();
  }
  
  getBook(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBook(id).subscribe(book => {
      this.book = book;
    });
  }

  updateBook(updateBook: Book): void {
    this.bookService.updateBook(updateBook).subscribe(() => {
      window.alert('This book is successfully updated!');
      window.location.reload();
    });
  }

  save(): void {
    if (this.book) {
      let updateBook = this.book;
      if (this.coverFile) {
        const formData = new FormData();
        formData.append('cover', this.coverFile, `cover${this.book.id}.jpg`);
        this.bookService.addCover(formData).subscribe(cover => {
          updateBook.cover = cover.url;
          this.updateBook(updateBook);
        });
      } else {
        this.updateBook(updateBook);
      }
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

  //borrow current book by this user
  borrowBook(): void {

    if (this.book && this.book.copies > 0 && this.userService.currentUser) {
      //check if the user already have this book, if so, reject the user
      if (isBorrowed(this.book.id, this.userService.currentUser.currentBorrows)) {
        alert('You already borrowed this book. Please choose another book.');
        return;
      }
      this.book.copies -= 1;
      this.bookService.updateBook(this.book).subscribe();
      this.userService.currentUser?.currentBorrows.push({
        id: this.book.id,
        date: new Date()
      });
      this.userService.updateUser(this.userService.currentUser).subscribe(() => {
        alert(`You borrowed ${this.book?.title} successfully!`);
      });
    } else {
      alert("There is no copy available");
    }
  }
}

// check if a book have been borrowed already.
function isBorrowed(id :number, books: Borrow[]): boolean {
  for (let i=0; i < books.length; i++) {
    if (id === books[i].id) {
      return true;
    }
  }
  return false;
}
