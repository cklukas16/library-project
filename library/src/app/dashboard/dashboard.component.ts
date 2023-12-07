import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name: string |undefined;
  
  constructor(
    public auth: AngularFireAuth,
    private userService: UserService
  ){ }

  ngOnInit(): void {
    let uid = '';
    this.auth.user.subscribe((userLog) => {
      uid = userLog?.email as string;
      this.name = uid;
      this.userService.initializeUser(uid).then();
    });
  }

  // check user type
  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  signOut(): void {
    this.auth.signOut();
  }
  
}
