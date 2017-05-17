import { Component } from '@angular/core';
import { GLOBAL } from "./config/global";

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
                  //this.user.image = result.image;
                  //localStorage.setItem("identity", JSON.stringify(this.user));
                  console.log("Resultados:");
                  console.log(result);
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
            xhr.send(formData);
        });
    }

}
