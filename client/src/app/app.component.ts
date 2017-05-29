import { Component } from '@angular/core';
import { GLOBAL } from "./config/global";
import { FileService } from "./services/file.service";
import * as d3 from "d3";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FileService]
})

export class AppComponent {
  public url;
  public file_id;
  title = 'GLOBAL DATA APP';

  public filesToUpload: Array<File>;

  constructor(private _fileService: FileService) {}

  public uploadFile(){
     if (!this.filesToUpload) {
          // Redirect
      } else {
          this.makeFileRequest(GLOBAL.url + "api/data", [], this.filesToUpload).then(
              (result:any) => {
                  console.log(result);
                  this.file_id = result._id;
                  console.log(this.file_id);
                  var uploadModal: any = $("#uploadModal");
                  var cleanDataModal: any = $("#cleanDataModal");
                  uploadModal.modal("hide");
                  cleanDataModal.modal("show");

                  let table = d3.select("#showData").append("table").attr("class", "table table-hover");
                  let thead = table.append("thead");
                  let tbody = table.append("tbody");

                  var firstRow = result.data[0];

                  for (let a in firstRow) {
                        if (firstRow.hasOwnProperty(a)) {
                            thead.append("th").text(a);
                        }
                    }

                  var rows = tbody.selectAll("tr")
                                .data(result.data)
                                .enter().append("tr")
                                    .html(function(d:any, index){
                                        var size = 0, key;
                                        var str = "";
                                        for (key in d) {
                                            if (d.hasOwnProperty(key)) {

                                                size++;
                                                str = str + "<td>" + d[key] + "</td>";
                                            }
                                        }
                                        return str;
                                    });

              }
          );
      }
  }

  public fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  public startMining() {
    this._fileService.dataMining({file_id: this.file_id}).subscribe(
        respose => {
            console.log(respose);
            
        },
        error =>{
            console.log("Hubo un error");
            console.log(error);
        }
    );
  }

    public makeFileRequest(url: string, params: Array<string>, files: Array<File>){

        return new Promise((resolve, reject) => {
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++) {
                formData.append("data", files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                    //resolve(JSON.parse(xhr.response));                    
                }
            }

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            xhr.send(formData);
        });
    }

}
