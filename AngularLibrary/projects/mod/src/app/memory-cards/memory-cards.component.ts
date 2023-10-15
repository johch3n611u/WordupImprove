import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'mod-memory-cards',
  templateUrl: './memory-cards.component.html',
  styleUrls: ['./memory-cards.component.scss']
})
export class MemoryCardsComponent {

  nowQuestion: any = {};
  display: any;
  filterActive = 'all';
  btnWord = '答案';

  object = {
    titles: [] as string[],
    types: [] as string[],
    questions: [] as object[]
  };

  url = 'https://sheets.googleapis.com/v4/spreadsheets/1KelsVdzmFwaW7zZtMzAgYX4YflhhBhC71O0nS995CDY/values/MemoryCards?key=AIzaSyA9Rj7WbM2Zsq-Yy2heVkcalnuX8Z98oOg'

  constructor(private httpClient: HttpClient) {
    this.httpClient.get(this.url)
      .subscribe((res: any) => {
        this.object.titles = [...res.values[0]];
        this.object.types = [...new Set(res.values.slice(1).map((item: any) => item[0]) as string[])];
        console.log('this.object.types',this.object.types)
        this.object.questions = [...res.values.slice(1).map((item: any) => {
          return {
            t: item[0], q: item[1], a: item[2]
          }
        })];
        this.drawCard();
      });
  }

  getRandomIndex(max: number, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  drawCard() {
    let nowCard = this.object.questions;
    if (this.filterActive != 'all') {
      nowCard = [...this.object.questions.filter((res: any) => res.t == this.filterActive)];
    }
    this.nowQuestion = nowCard[this.getRandomIndex(nowCard.length - 1)];
    console.log('nowCard',nowCard)
    this.display = this.nowQuestion.q.toString();
    console.log(this.display);
    this.btnWord = '答案';
  }

  seeAnswer() {
    this.display = this.nowQuestion.a.toString();
    console.log(this.display);
    this.btnWord = '抽卡';
  }

  clickBtn() {
    if (this.btnWord == '抽卡') {
      this.drawCard();
    } else {
      this.seeAnswer();
    }
  }
}
