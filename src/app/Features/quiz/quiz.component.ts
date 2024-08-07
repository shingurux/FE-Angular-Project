import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UrlBaseService } from '../../Services/url-base.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    CommonModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  private rowdata: any;
  private quizList!: any[];
  private apiUrl: string = "/FeQuiz.json"
  private quizUrl: string = "";
  imgRoute: string = "";
  start: boolean = false;
  nextQuestion: boolean = false;
  disabledButton: boolean = false;
  progressBar: number = 0;
  bufferValue: number = 0;
  quizCompleted: boolean = false;
  
  question: string = '';
  opt1Lavel: string = '';
  opt2Lavel: string = '';
  opt3Lavel: string = '';
  opt4Lavel: string = '';
  correct: string = '';
  reason: string = '';
  opt1: boolean = false;
  opt2:  boolean = false;
  opt3: boolean = false;
  opt4:  boolean = false;

  constructor(private urlservice: UrlBaseService, @Inject(PLATFORM_ID) private platformId: Object, private httpService: HttpClient) {
    this.quizUrl = this.urlservice.getApiUrl() + this.apiUrl;
    this.imgRoute = this.urlservice.getImgUrl();

    this.httpService.get(this.quizUrl)
    .subscribe((data: any) => {
      this.rowdata = data;
      this.quizList = this.rowdata.quiz;
      this.bufferValue = Math.ceil(this.quizList.length / 2)
    });
    
  }
  startQuiz() {
    this.start = true;

    let index = Math.floor(Math.random() * (this.quizList.length - 1));
    
    if (index > -1) {
      let item = this.quizList[index];
      this.quizList.splice(index, 1);

      this.question = item.question;
      this.opt1Lavel = item.answer.a;
      this.opt2Lavel = item.answer.b;
      this.opt3Lavel = item.answer.c;
      this.opt4Lavel = item.answer.d;
      this.correct = item.correct;
      this.reason = item.reason;
    }
  }

  selectOpt(opt: any) {
    if (isPlatformBrowser(this.platformId)) {
      let elem;
      switch(opt) {
        case "a":
          elem = document.getElementById('ansA');
          break;
        case "b":
          elem = document.getElementById('ansB');
          break;
        case "c":
          elem = document.getElementById('ansC');
          break;
        case "d":
          elem = document.getElementById('ansD');
          break;
      }

      if (opt === this.correct) {
        elem?.classList.add("correct");
        this.nextQuestion = true;
        this.disabledButton = true

        if (this.progressBar < 100) {
          this.progressBar += this.bufferValue * 10;
    
          if (this.progressBar >= 100) {
            this.quizCompleted = true;
          }
        }
      } else {
        elem?.classList.add("incorrect");
      }
    }
  }

  changeQuestion() {
    this.nextQuestion = false;

    let elem = document.querySelectorAll('button');
    elem.forEach((el) => {
      el.classList.remove('correct');
      el.classList.remove('incorrect');
    });

    this.startQuiz();
  }

}
/* Para mejorar el quiz, se puede añadir un boton al inicio para
 que el usuario añada sus propia pregntas y haya mas variedad.
 De esta forma no hay que mirar el codigo y añadirlo manualmente en el fichero
 de datos*/
