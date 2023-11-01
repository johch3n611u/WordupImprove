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
  config: any;
  configDisplay: any;

  constructor(
    private httpClient: HttpClient,
    public themeService: ThemeService,
  ) {
    this.httpClient.get(this.url)
      .pipe(
        tap((res: any) => {
          this.cards = res.sort((a: any, b: any) => b.sentences.length - a.sentences.length);
          this.answerScore = JSON.parse(localStorage.getItem('answerScore') ?? '[]');
          this.configInit();
        })
      )
      .subscribe((res: any) => {
        this.drawCard();
      });

    this.themeService.SetTheme(this.themeService.GetTheme());
  }

  debug: any;

  drawCard(count: any = 1) {

    this.debug = { drawScore: 0, list: [] };
    const pickedObjects: any = [];
    const totalScore = this.cards.reduce((sum: any, obj: any) => sum + obj.sentences.length, 0);

    let cumulativeScore = 0;
    const random = Math.random() * totalScore;
    this.debug.drawScore = random;
    let i = 1;
    while (pickedObjects.length < count) {

      let drawNumber = this.getRandomNum(this.cards.length - 1);
      let preCumulativeScore = JSON.parse(JSON.stringify(cumulativeScore));
      cumulativeScore += this.cards[drawNumber].sentences.length;
      let familiar = this.answerScore.find((res: any) => res.en === this.cards[drawNumber].en);
      if (familiar) {
        cumulativeScore += (familiar.score * -1 * (this.config?.questionsScore?.score ? this.config?.questionsScore?.score : 1000));
        if (familiar.updateTime && familiar.score <= 0) {
          let aDay = this.config?.dayScore?.days ? this.config?.dayScore?.days * 86400000 : 86400000;
          let passDay = Date.now() - familiar.updateTime;
          if (passDay <= aDay) {
            cumulativeScore += this.config?.dayScore?.score ? this.config?.dayScore?.score : 1000;
          }
        }
      }

      this.debug.list.push(
        {
          finalScore: cumulativeScore,
          en: this.cards[drawNumber]?.en,
          drawCount: i++,
          sentencesLength: this.cards[drawNumber]?.sentences?.length,
          questionScore: familiar?.score,
          questionUpdateTime: this.calculateTime(familiar?.updateTime - Date.now()),
          weightedScore: (cumulativeScore - preCumulativeScore)
        }
      );

      if (random <= cumulativeScore && this.cards[drawNumber]?.en !== this.card?.en) {
        if (!pickedObjects.includes(this.cards[drawNumber])) {
          pickedObjects.push(this.cards[drawNumber]);
          this.card = JSON.parse(JSON.stringify(this.cards[drawNumber]));
          this.card.score = familiar?.score;
        }
        break;
      }

    }

    this.debug.list = this.debug.list.sort((a: any, b: any) => b.drawCount - a.drawCount);
    this.displayMode = DisplayMode.Questions;
    this.drawSentence();
    this.calculateFamiliarity();
    this.unfamiliarReflash();
  }

  drawSentence() {
    this.sentenceAnswerDisplay = false;
    let randomNumber;
    let locked = true;
    while (this.sentence == undefined || locked) // false 不動
    {
      randomNumber = this.getRandomNum(this.card.sentences.length - 1);
      if (this.sentence?.en != this.card?.sentences[randomNumber]?.en) {
        this.sentence = this.card?.sentences[randomNumber];
        locked = false;
      }
    }
  }

  answerScoreReset(answer: any) {
    answer ? this.SUSS++ : this.SUSS = 0;

    let word = this.answerScore.find((word: any) =>
      word.en == this.card.en
    );

    if (word) {
      answer ? word.score++ : word.score--;
      word.updateTime = Date.now();
    } else {
      let newWord = answer ? 1 : -1;
      this.answerScore.push({ en: this.card.en, score: newWord, updateTime: Date.now() });
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
          duration: 0
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

  searchWord: any = {
    word: '',
    explain: '',
    display: '',
    score: ''
  };

  searchWordMark() {
    let searchWord = this.searchWord.word.split(" ").join("");
    const pattern = new RegExp(`\\b${searchWord}\\b`, "gi");
    const searched = this.cards.find((card: any) => card.en.match(pattern));
    if (searched && searchWord !== undefined && searchWord !== null && searchWord !== '') {
      const word = this.answerScore.find((word: any) => word.en.match(pattern));
      console.log(word);
      if (word) {
        word.score -= 5;
        word.updateTime = Date.now();
        this.searchWord.score = word?.score
      } else {
        this.answerScore.push({ en: searchWord, score: -5, updateTime: Date.now() });
        this.searchWord.score = -5;
      }

      localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
      this.searchWord.explain = searched.cn;
      alert('已扣 5 分');
      this.calculateFamiliarity();

      this.searchWord.display = searchWord;
      this.searchWord.word = '';

    } else {
      alert('搜尋不到此單字');
    }

    this.unfamiliarReflash();
  }

  nowTheme = this.themeService.GetTheme();

  setTheme() {
    this.nowTheme === this.theme.dark ? this.nowTheme = this.theme.light : this.nowTheme = this.theme.dark;
    this.themeService.SetTheme(this.nowTheme);
  }

  isExportAnswerScore = false;
  answerScoreDisplay: any = [];
  clickImExport() {
    this.isExportAnswerScore = !this.isExportAnswerScore;
    this.answerScoreDisplay = JSON.stringify([...this.answerScore]);
  }
  importAnswerScore() {
    if (confirm('確定要匯入(紀錄更改後無法返回)？')) {
      this.answerScore = [...JSON.parse(this.answerScoreDisplay)];
      localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
      this.isExportAnswerScore = false;
      this.calculateFamiliarity();
    }
  }

  debugDisplay = JSON.parse(localStorage.getItem('clickDebug') ?? 'false');
  clickDebug() {
    this.debugDisplay = !this.debugDisplay;
    localStorage.setItem('clickDebug', this.debugDisplay);
  }

  importConfig() {
    if (confirm('確定要更改設定檔嗎？')) {
      this.debug = JSON.parse(this.configDisplay);
      console.log(this.debug)
      localStorage.setItem('drawCardConfig', JSON.stringify(this.debug));
      this.drawCard();
    }
  }

  configInit() {
    let drawCardConfig: any = localStorage.getItem('drawCardConfig');
    drawCardConfig ? this.config = JSON.parse(drawCardConfig) : this.config = { dayScore: { score: 1000, days: 1 }, questionsScore: { score: 1000 } };

    this.configDisplay = JSON.stringify(this.config) ?? {};
  }

  calculateTime(timestamp: any) {
    let date: any = new Date(timestamp * 1000); // 將時間戳記轉換為毫秒
    let days = Math.floor(date / (24 * 60 * 60 * 1000)); // 計算天數
    if (days < 0) {
      days = 0
    }
    let hours = date.getUTCHours(); // 獲取小時數（UTC時間）
    let minutes = date.getUTCMinutes(); // 獲取分鐘數（UTC時間）

    return {
      days: days,
      hours: hours,
      minutes: minutes
    };
  }

  displayUnfamiliar: any = JSON.parse(localStorage.getItem('displayUnfamiliar') ?? 'false');;
  changeDisplayUnfamiliar() {
    this.displayUnfamiliar = !this.displayUnfamiliar;
    localStorage.setItem('displayUnfamiliar', JSON.stringify(this.displayUnfamiliar))
  }
  unfamiliarList: any = [];
  unfamiliarReflash() {
    this.unfamiliarList = [];
    this.answerScore.forEach((el: any) => {
      let card = this.cards.find((res: any) => res.en === el.en);
      if (card?.en) {
        this.unfamiliarList.push({
          en: card?.en,
          cn: card?.cn,
          sentencesLength: card?.sentences?.length,
          questionScore: el?.score,
          questionUpdateTime: this.calculateTime(el?.updateTime - Date.now()),
        });
      }
    });

    this.unfamiliarList.sort((a: any, b: any) => a.questionScore - b.questionScore);
  }

  getRandomNum(max: any, min: any = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
