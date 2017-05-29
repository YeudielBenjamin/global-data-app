import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../config/global";
import "rxjs/add/operator/map";

@Injectable()
export class UserService{
    public url: string;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    public login(email, password){
        let params = JSON.stringify({email:email, password: password});
        let headers = new Headers({"Content-Type": "application/json"});
        return this._http.post(this.url + "auth/login", params, {headers}).map(res => res.json());
    }
}