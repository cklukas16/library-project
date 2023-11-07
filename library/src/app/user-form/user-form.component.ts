import { Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  
  model = {id: 1, name: ''};

  submitted = false;

  onSubmit() { this.submitted = true; }

}
