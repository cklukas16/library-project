import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  
  form: FormGroup;

  constructor(
    public auth: AngularFireAuth,
    private fb: FormBuilder
  ){
    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
  });
  }

  signIn(): void {
    const val = this.form.value;
    this.auth.signInWithEmailAndPassword(val.email, val.password).catch(() => {
      window.alert('Please check your email and password');
    });
  }

  signOut(): void {
    this.auth.signOut();
  }

  signUp(): void {
    const val = this.form.value;
    this.auth.createUserWithEmailAndPassword(val.email, val.password).then(() => {
      window.alert('Sign up successful!');
    })
    .catch(() => {
      window.alert('The email address is already in use by another account');
    });
  }

}
