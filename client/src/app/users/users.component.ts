import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})




export class UsersComponent implements OnInit {
  	


	users = [

		{
			name: "luis",
			lastname: "gomez",
			phone: 123456,
			email: "email@gmail.com"

		},
		{
			name: "pedro",
			lastname: "gomez",
			phone: 123456,
			email: "email.com"

		},
		{
			name: "mario",
			lastname: "gomez",
			phone: 123456,
			email: "email.com"

		}


	]

  constructor() {
  		
   }
  ngOnInit() {
  }

}
