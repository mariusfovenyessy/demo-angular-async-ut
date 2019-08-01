import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { USERS } from '../model/mock-users';
import { Observable, of } from 'rxjs';
import { error } from 'util';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }


  getUsers(): User[] {
    return USERS;
  }

  getUsersAsync(): Observable<User[]> {
    let ob = Observable.create((observer) => {
      console.log("Async - Observable - emitting ...");
      setTimeout(()=>{
        observer.next(USERS);        
      },2000);     
    });
    return ob;
  }

  getUsersAsyncWithPromises(): Promise<User[]> {
    const promise = new Promise<User[]>((resolve, reject) => {
      setTimeout(() => {
        console.log('Async - Promise - work complete');
        if (error) {
          reject();
        } else {
          resolve(USERS);
        }
      }, 2000);
    });
    return promise;
  }
}
