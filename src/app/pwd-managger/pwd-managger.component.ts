import { Component } from '@angular/core';
import {MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import _ from 'lodash';


@Component({
  selector: 'app-pwd-managger',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIcon,
    MatButton,
    HttpClientModule
  ],
  templateUrl: './pwd-managger.component.html',
  styleUrl: './pwd-managger.component.css'
})
export class PwdManaggerComponent {
  showPwd: boolean = false;
  rawData: any;
  copyRawData: any;
  data: any;
  appsList: any
  url: string = '/api/pwd-manager.json';
  newAppName: string = "";
  newPwd: string = "";
  

  constructor(private httpService: HttpClient) {
    this.data = this.httpService.get(this.url)
      .subscribe((data: any) => {
        console.log(data);
        this.rawData = data;
        this.appsList = this.rawData.pwdManager;
        this.appsList.forEach((elem: any) => {
          elem.showPwd = false;
        });
      })
  }

  togglePwdVisibility(app: any) {
    app.showPwd = !app.showPwd;
    console.log(app);
  }

  generateNewPwd() {
    let result: string = "";
    for (let i = 0; i<14; i++) {
      const indice = Math.floor(Math.random() * 95 + 32);
      result += String.fromCharCode(indice);
    }

    this.newPwd = result;
  }

  saveNewPwd() {
    this.newAppName = (document.getElementById('newAppName') as HTMLInputElement).value; 
    console.log(this.newAppName);
    if(this.newAppName &&  this.newPwd) {
      let newApp = {
        appname: this.newAppName,
        pwd: this.newPwd
      }
      this.copyRawData = _.cloneDeep(this.rawData);
      this.rawData.pwdManager.push(newApp);
      console.log("datos: ",this.rawData);

      this.httpService.post(this.url, this.rawData);
      this.resetFrom();
    }
  }

  resetFrom() {
    this.newAppName = "";
    this.newPwd = "";
    (document.getElementById('newAppName') as HTMLInputElement).value = "";
  }
}
