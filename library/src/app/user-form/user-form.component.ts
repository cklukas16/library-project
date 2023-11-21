import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/user.service';
import { BookService } from '../shared/book.service';
import { Borrow, User } from '../models/user';

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
    private bookService: BookService
  ){ }

  ngOnInit(): void {
    let uid = '';
    this.auth.user.subscribe((userLog) => {
      uid = userLog?.email as string
      this.getUser(uid);
    });
  }

  getUser(uid: string): void {
    if (this.userService.currentUser) {
      this.user = this.userService.currentUser;
      return;
    }
    this.userService.getUser(uid).subscribe(user => {
      this.user = user;
    });
  }

  //return book
  returnBook(id:number): void{
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
    this.userService.updateUser(this.userService.currentUser);
    //update book inventory
    let book;
    this.bookService.getBook(id).subscribe(bk => {
      book = bk;
      book.copies += 1;
      this.bookService.updateBook(bk).subscribe();
    }); 
  }
}
