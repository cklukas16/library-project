import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/user.service';
import { BookService } from '../shared/book.service';
import { User } from '../models/user';

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

}
