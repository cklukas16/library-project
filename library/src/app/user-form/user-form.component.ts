import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { BookService } from '../shared/book.service';
import { User } from '../models/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  users: User[] = [];
  
  constructor(
    private userService: UserService,
    private bookService: BookService
  ){ }

  ngOnInit() {
    this.getUsers();
  }

  getUser(): any {
    return this.userService.currentUser;
  }

  getUsers(): any {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  // check user type
  isAdmin(email?: string): boolean {
    if (email) {
      return this.userService.isAdmin(email);
    } else {
      return this.userService.isAdmin();
    }
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
    this.userService.updateUser(this.userService.currentUser).subscribe();
    //update book inventory
    let book;
    this.bookService.getBook(id).subscribe(bk => {
      book = bk;
      book.copies += 1;
      this.bookService.updateBook(bk).subscribe(() => {
        window.alert('This book is successfully returned!');
        //window.location.reload();
      });
    }); 
  }

  sendMessages(uid: any, borrow: any): void {
    let msg = window.prompt(`Send a message to notify ${uid}.`);
    
    if (msg) {
      let user = this.users.find(user => user.email == uid) as User;
      let index = user.currentBorrows.indexOf(borrow);
      user.currentBorrows[index].message = msg;
      this.userService.updateUser(user).subscribe({
        next: () => {
          window.alert('Message sent!');
        }
      });
    }
    
  }
}
