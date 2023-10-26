import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { tap } from 'rxjs';
import Chart from 'chart.js/auto';
import { Theme, ThemeService } from 'lib/feature/theme/theme.service';

@Component({
  selector: 'mod-wordup-improve',
  templateUrl: './wordup-improve.component.html',
  styleUrls: ['./wordup-improve.component.scss']
})
export class WordupImproveComponent {

  url = './assets/scoreData.json';
  cards: any = [];
  card: any;
  sentence: any;
  SUSS: any = 0;
  sentenceAnswerDisplay: any = true;
  DisplayMode = DisplayMode;
  displayMode = DisplayMode.Questions;
  answerScore: any = [];
  chart: any;
  theme = Theme;

  constructor(
    private httpClient: HttpClient,
    public themeService: ThemeService,
  ) {
    this.httpClient.get(this.url)
      .pipe(
        tap((res: any) => {
          this.cards = res.sort((a: any, b: any) => b.sentences.length - a.sentences.length);
          this.answerScore = JSON.parse(localStorage.getItem('answerScore') ?? '[]');
        })
      )
      .subscribe((res: any) => {
        this.drawCard();
      });

    this.themeService.SetTheme(this.themeService.GetTheme());
  }

  drawCard(count: any = 1) {
    const pickedObjects: any = [];
    const totalScore = this.cards.reduce((sum: any, obj: any) => sum + obj.sentences.length, 0);
    while (pickedObjects.length < count) {
      const random = Math.random() * totalScore;
      let cumulativeScore = 0;

      for (let i = 0; i < this.cards.length; i++) {
        cumulativeScore += this.cards[i].sentences.length;

        let familiar = this.answerScore.find((res: any) => res.en === this.cards[i].en);
        if (familiar) {
          cumulativeScore += (familiar.score * -1000);
        }

        if (random <= cumulativeScore && this.cards[i]?.en !== this.card?.en) {
          if (!pickedObjects.includes(this.cards[i])) {
            pickedObjects.push(this.cards[i]);
          }
          break;
        }
      }
    }

    this.card = pickedObjects[0];
    this.displayMode = DisplayMode.Questions;
    this.drawSentence();

    this.calculateFamiliarity();
  }

  drawSentence() {
    this.sentenceAnswerDisplay = false;
    const randomNumber = Math.floor(Math.random() * (this.card.sentences.length - 1));
    this.sentence = this.card.sentences[randomNumber];
  }

  answerScoreReset(answer: any) {
    answer ? this.SUSS++ : this.SUSS = 0;

    let word = this.answerScore.find((word: any) =>
      word.en == this.card.en
    );

    if (word) {
      answer ? word.score++ : word.score--;
    } else {
      let newWord = answer ? 1 : -1;
      this.answerScore.push({ en: this.card.en, score: newWord });
    }

    localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
    this.drawCard();
  }

  familiarity: Familiarity | any = {};

  calculateFamiliarity() {
    this.familiarity.total = this.cards.length;
    // 未複習到 0 / undefined
    let zero = this.answerScore.filter((res: any) => res.score === 0).length;
    let undefined = this.cards.length - this.answerScore.length;
    this.familiarity.notReviewed = zero + undefined;
    // 超不熟悉 -5
    this.familiarity.veryUnfamiliar = this.answerScore.filter((res: any) => res.score <= -5).length;
    // 不熟悉 -
    this.familiarity.unfamiliar = this.answerScore.filter((res: any) => res.score < 0 && res.score > -5).length;
    // 熟悉 +
    this.familiarity.familiar = this.answerScore.filter((res: any) => res.score > 0 && res.score < 5).length;
    // 超熟悉 +5
    this.familiarity.veryFamiliar = this.answerScore.filter((res: any) => res.score >= 5).length;

    this.drawChat();
  }

  drawChat() {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = [
      `未複習到 ${this.familiarity.notReviewed}`,
      `超不熟悉 ${this.familiarity.veryUnfamiliar}`,
      `不熟悉 ${this.familiarity.unfamiliar}`,
      `熟悉 ${this.familiarity.familiar}`,
      `超熟悉 ${this.familiarity.veryFamiliar}`
    ];

    const data = [
      this.familiarity.notReviewed,
      this.familiarity.veryUnfamiliar,
      this.familiarity.unfamiliar,
      this.familiarity.familiar,
      this.familiarity.veryFamiliar
    ];

    this.chart = new Chart('canvas', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# of Votes',
            data: data,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '熟悉度'
          }
        },
        animation: {
          duration: 5000
        }
      },
    });
  }

  onResize(event: any) {
    this.drawChat();
  }

  resetAnswerScore() {
    if (confirm('確定要刪除紀錄嗎？')) {
      this.answerScore = [];
      localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
      this.calculateFamiliarity();
    }
  }

  searchWord: any;
  searchWordExplain: any;
  searchWordDisplay: any;

  searchWordMark() {
    const pattern = new RegExp(`\\b${this.searchWord}\\b`, "gi");
    const searched = this.cards.find((card: any) => card.en.match(pattern));

    if (searched) {
      const word = this.answerScore.find((word: any) => word.en.match(pattern));

      if (word) {
        word.score -= 5;
      } else {
        this.answerScore.push({ en: this.searchWord, score: -5 });
      }

      localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
      this.searchWordExplain = searched.cn;
      alert('已扣 5 分');
      this.calculateFamiliarity();

      this.searchWordDisplay = this.searchWord;
      this.searchWord = '';

    } else {
      alert('搜尋不到此單字');
    }
  }

  nowTheme = this.themeService.GetTheme();

  setTheme() {
    this.nowTheme === this.theme.dark ? this.nowTheme = this.theme.light : this.nowTheme = this.theme.dark;
    this.themeService.SetTheme(this.nowTheme);
  }
}

export enum DisplayMode {
  Answer = '答題',
  Questions = '看答案'
}

export interface Familiarity {
  total: number;
  notReviewed: number;
  unfamiliar: number;
  veryUnfamiliar: number;
  familiar: number;
  veryFamiliar: number;
}
