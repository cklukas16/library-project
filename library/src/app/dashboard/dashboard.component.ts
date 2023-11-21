import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name: string = '';
  
  constructor(
    public auth: AngularFireAuth,
    private userService: UserService
  ){ }

  ngOnInit(): void {
    let uid = '';
    this.auth.user.subscribe((userLog) => {
      uid = userLog?.email as string
      this.getUsername(uid);
      this.userService.setCurrentUserEmail(uid);
    });
    
  }

  getUsername(uid: string): void {
    this.userService.getUser(uid).subscribe(user => {this.name = user.name});
  }

  signOut(): void {
    this.auth.signOut();
  }
  
}
