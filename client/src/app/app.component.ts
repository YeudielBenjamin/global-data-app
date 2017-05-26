import { Component } from '@angular/core';
import { GLOBAL } from "./config/global";
import * as d3 from "d3";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'GLOBAL DATA APP';

  public filesToUpload: Array<File>;

  public uploadFile(){
     if (!this.filesToUpload) {
          // Redirect
      } else {
          this.makeFileRequest(GLOBAL.url + "api/data", [], this.filesToUpload).then(
              (result:any) => {
                  var uploadModal: any = $("#uploadModal");
                  var cleanDataModal: any = $("#cleanDataModal");
                  console.log("Resultados:");
                  console.log(result);
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
