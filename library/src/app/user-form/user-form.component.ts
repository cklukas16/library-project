import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/user.service';
import { BookService } from '../shared/book.service';
import { User } from '../models/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  
  user: User | undefined;


  constructor(
    public auth: AngularFireAuth,
    private userService: UserService,
    private bookService: BookService,
    private _location: Location
  ){ }

  ngOnInit(): void {
    //to fix the refresh problem
    if (!this.userService.currentUser) {
      this._location.back();
    }
    this.user = this.userService.currentUser;
  }

  //return book
  returnBook(id:number): void{
    console.log(this.userService.currentUser);
    //delete from current borrowing list
    let currBorrows = this.userService.currentUser?.currentBorrows;
    let bookBorrowed;
    if (currBorrows) {
      for (let i = 0; i < currBorrows.length; i++) {
        if (currBorrows[i].id === id) {
          bookBorrowed = currBorrows[i];
          currBorrows.splice(i, 1);
          //update borrowing history
          this.userService.currentUser?.historyBorrows.push(bookBorrowed);
        }
      }
    }
    //update user
    this.userService.updateUser(this.userService.currentUser).subscribe();
    console.log(this.userService.currentUser);
    //update book inventory
    let book;
    this.bookService.getBook(id).subscribe(bk => {
      book = bk;
      book.copies += 1;
      this.bookService.updateBook(bk).subscribe();
    }); 
  }
}
