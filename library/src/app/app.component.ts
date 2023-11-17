import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
    this.auth.signInWithEmailAndPassword(val.email, val.password).then(() => {
      window.alert('Welcome to the Library!');
    }).catch(() => {
      window.alert('Please check your email and password');
    });
  }

  signUp(): void {
    const val = this.form.value;
    this.auth.createUserWithEmailAndPassword(val.email, val.password).then(() => {
      window.alert('Sign up successful!');
    }).catch(() => {
      window.alert('The email address is already in use by another account');
    });
  }
}