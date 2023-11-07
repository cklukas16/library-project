import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'login', component: UserFormComponent},
  { path: 'homepage', component: DashboardComponent },
  { path: 'book', component: BooksComponent },
  { path: 'book/:id', component: BookDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }