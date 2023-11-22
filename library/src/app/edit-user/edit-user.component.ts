import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../shared/user.service';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  user: User | undefined;
  email: string = '';
  password: string = '******';
  form: FormGroup;

  constructor(
    private userService: UserService, 
    private _location: Location,
    public auth: AngularFireAuth,
    private fb: FormBuilder) {
      this.form = this.fb.group({
        email: ['',Validators.required],
        password: ['',Validators.required]
    });
  }

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
    const val = this.form.value;
    console.log(val.email, val.password);
  }
}
