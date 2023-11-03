import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
      { id: 12, name: 'Shannon' },
      { id: 13, name: 'Andrew' },
      { id: 14, name: 'Samuel' },
      { id: 15, name: 'Nancy' },
      { id: 16, name: 'Grace' },
      { id: 17, name: 'Michael' },
      { id: 18, name: 'Matthew' },
      { id: 19, name: 'Sam' },
      { id: 20, name: 'Peter' }
    ];
    return {users};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 11;
  }
}