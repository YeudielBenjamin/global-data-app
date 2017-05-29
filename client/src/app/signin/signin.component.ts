import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { User } from "../models/user";

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [UserService]
})
export class SigninComponent implements OnInit {

  public user: User;

  constructor(private _userService: UserService) { 
	  this.user = new User("", "", "", "", "");
  }

  ngOnInit() {
  }

  public login(){
    this._userService.login($("#emailL").val(), $("#passL").val()).subscribe(
      response => {
        console.log(response);
        let modal:any = $("#modalSignIn");
        modal.modal("hide");
        $("#personName").text("Bienvenido de vuelta " + response.name);
      },
      error => {
        console.log(error);
        
		}
	);
  }
}
