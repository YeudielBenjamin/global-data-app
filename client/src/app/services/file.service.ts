import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../config/global";
import "rxjs/add/operator/map";

@Injectable()
export class FileService{
    public url: string;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    public dataMining(file_id){
        let params = JSON.stringify(file_id);
        let headers = new Headers({
            "Content-Type": "application/json" 
        });
        console.log(params);
        return this._http.post(this.url + "api/data/datamining", params, {headers}).map(res => res.json());
    }
}