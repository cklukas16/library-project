import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../shared/user.service';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  user: User | undefined;
  email: string = '';
  password: string = '******';

  constructor(
    private userService: UserService, 
    private _location: Location,
    public auth: AngularFireAuth,) {}

  ngOnInit() {
    if (!this.userService.currentUser) {
      this._location.back();
    }
    this.user = this.userService.currentUser;
    this.email = this.user?.email || '';
  }

  //this does not work
  editUser() {
    //TODO
    this.auth.currentUser.then((user)=>{

    })
  }
}
