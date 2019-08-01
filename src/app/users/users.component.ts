import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'
import { User } from '../model/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    //this.getUsers();
    this.getUsersAsyncStyle();
    //this.getUsersAsyncStyleWithPromise();
  }

  getUsers(): void {
    this.users = this.userService.getUsers();
  }


  getUsersAsyncStyle(): void {
    this.userService.getUsersAsync()
        .subscribe(users => {
          console.log("On subscribe...");
          this.users = users          
        });
  }

  getUsersAsyncStyleWithPromise(): void {
    this.userService.getUsersAsyncWithPromises().then(users => {
          console.log("On subscribe...");
          this.users = users          
        });
  }
}

