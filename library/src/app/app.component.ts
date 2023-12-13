import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserService } from './shared/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: FormGroup;

  constructor(
    public auth: AngularFireAuth,
    public router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ){
    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
  });
  }

  signIn(): void {
    const val = this.form.value;
    this.auth.signInWithEmailAndPassword(val.email.trim(), val.password).then(() => {
      this.userService.initializeUser(val.email.trim()).then(() => {
        window.alert('Welcome to the Library!');
        this.router.navigate(['']);
        //window.location.reload();
      });
    }).catch(() => {
      window.alert('Please check your email and password');
    });
  }

  signUp(): void {
    const val = this.form.value;
    this.auth.createUserWithEmailAndPassword(val.email.trim(), val.password).then(() => {
      
      let newUser: User = {
        email: val.email.trim(),
        name: val.email.trim(),
        currentBorrows: [],
        historyBorrows: []
      }
      this.userService.addUser(newUser).subscribe({
        next: () => {
          window.alert('Sign up successful!');
          this.router.navigate(['']);
        }
      })
    }).catch(() => {
      window.alert('The email address is already in use by another account');
    });
  }
}