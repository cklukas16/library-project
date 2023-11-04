import { Component } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  
  model: User = {id: 1, name: ''};

  submitted = false;

  onSubmit() { this.submitted = true; }

}
