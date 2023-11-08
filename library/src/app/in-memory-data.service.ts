import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const books = [
      { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: '2014', publisher: 'Harper', cover: '../../assets/covers/cover1.jpg', category: 'fiction', copies: 2 },
      { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', year: '2015', publisher: 'Simon & Schuster UK', cover: '../../assets/covers/cover2.jpg', category: 'fiction', copies: 1 },
      { id: 3, title: 'The Call of the Wild', author: 'Jack London', year: '2014', publisher: 'Open Road Media Teen & Tween', cover: '../../assets/covers/cover3.jpg', category: 'teen', copies: 2 },
      { id: 4, title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', year: '2000', publisher: 'Clarion Books', cover: '../../assets/covers/cover4.jpg', category: 'teen', copies: 3 },
      { id: 5, title: 'The Last Lecture', author: 'Randy Pausch', year: '2008', publisher: 'Hachette Books', cover: '../../assets/covers/cover5.jpg', category: 'politics', copies: 1 },
      { id: 6, title: 'A Walk in the Woods: Rediscovering America on the Appalachian Trail', author: ' Bill Bryson', year: '2010', publisher: 'Crown', cover: '../../assets/covers/cover6.jpg', category: 'travel', copies: 1 },
      { id: 7, title: 'A Tree Grows in Brooklyn', author: 'Betty Smith', year: '2009', publisher: 'HarperCollins', cover: '../../assets/covers/cover7.jpg', category: 'fiction', copies: 2 },
      { id: 8, title: 'Fundamentals of Web Development', author: 'Randy Connolly and Ricardo Hoar', year: '2017', publisher: 'Pearson', cover: '../../assets/covers/cover8.jpg', category: 'technology', copies: 1 },
      { id: 9, title: 'Programming TypeScript: Making Your JavaScript Applications Scale', author: 'Boris Cherny', year: '2019', publisher: 'O\'Reilly Media', cover: '../../assets/covers/cover9.jpg', category: 'technology', copies: 1 },
      { id: 10, title: 'Agatha Christie: An Elusive Woman', author: 'Lucy Worsley', year: '2022', publisher: 'Pegasus Crime', cover: '../../assets/covers/cover10.jpg', category: 'Biographies', copies: 2 }
    ];
    return {books};
  }

  // If the book array is empty, the method below returns the initial number (1).
  // if the book array is not empty, the method below returns the highest book id + 1.
  genId(books: Book[]): number {
    return books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
  }
}