export interface User {
    email: string;
    name: string;
    currentBorrows: Borrow[];
    historyBorrows: Borrow[]
  }

  export interface Borrow {
    id: number;
    date: Date;
    message: string
  }