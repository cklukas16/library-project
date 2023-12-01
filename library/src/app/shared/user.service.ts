import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //save the information for current user
  currentUser : User | undefined;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /** Log a BookService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`BookService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for book consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // URL to web api
  private usersUrl = 'api/users';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  async initializeUser(email: string) {
    this.getUser(email).subscribe((user)=> {
      this.currentUser=user;
    });
  }

  /** GET user by id and freturn 404 if id is not found */
  getUser(email: string): Observable<User> {
    const url = `${this.usersUrl}/${email}`;
    
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched User id=${email}`)),
      catchError(this.handleError<User>(`getUser email=${email}`))
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      tap(_ => this.log(`fetched Users`)),
      catchError(this.handleError<User[]>(`getUsers`))
    );
  }


  updateUser(user: User | undefined) : Observable<any> {
    return this.http.put(this.usersUrl, user, this.httpOptions).pipe(
      tap(_ => this.log(`updated user`)),
      catchError(this.handleError<any>('update User'))
    );
  }

}
