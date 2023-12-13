import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../shared/user.service';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: User | undefined;
  userForm: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.required),
  });

  constructor(
    private userService: UserService,
    private location: Location,
    public auth: AngularFireAuth
  ) { }

  ngOnInit() {
    if (!this.userService.currentUser) {
      this.location.back();
    } else {
      this.user = this.userService.currentUser;
    }
  }

  editUser() {
    const val = this.userForm.value;
    if (val.userName && this.user) {
      this.user.name = val.userName;
      this.userService.updateUser(this.user).subscribe({
        next: () => {
          window.alert('Profile updated!');
        }
      });
    }
  }
}
