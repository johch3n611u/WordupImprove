import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, combineLatest, filter, take, tap } from 'rxjs';
import Chart from 'chart.js/auto';
import { Theme, ThemeService } from 'lib/feature/theme/theme.service';

import { inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  CollectionReference,
  DocumentData,
  addDoc,
  DocumentReference,
  setDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  Auth,
  User,
  authState,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { GlgorithmsService, REGEXP_TYPE } from 'lib/feature';

@Component({
  selector: 'mod-wordup-improve',
  templateUrl: './wordup-improve.component.html',
  styleUrls: ['./wordup-improve.component.scss'],
})
export class WordupImproveComponent {
  url = './assets/scoreData.json';
  cards: any = [];
  sentence: any;
  sentenceAnswerDisplay: any = true;
  DisplayMode = DisplayMode;
  displayMode = DisplayMode.Questions;
  answerScore: any = [];
  chart: any;
  theme = Theme;
  config: any = {};
  allWords: any;
  REGEXP_TYPE = REGEXP_TYPE;

  constructor(
    private httpClient: HttpClient,
    public themeService: ThemeService,
    private glgorithmsService: GlgorithmsService
  ) {
    this.httpClient
      .get(this.url)
      .pipe(
        tap((res: any) => {
          this.cards = res.sort(
            (a: any, b: any) => b.sentences.length - a.sentences.length
          );
          this.answerScore = JSON.parse(
            localStorage.getItem('answerScore') ?? '[]'
          );
          this.configInit();
        })
      )
      .subscribe((res: any) => {
        this.drawCard();
      });

    this.themeService.SetTheme(this.themeService.GetTheme());
  }

  ngOnDestroy() {
    this.logsSub.unsubscribe();
  }

  debug: any;
  card: any;
  drawCard(count: any = 1): void {
    try {
      if (this.config.drawMode !== 'errorFirst') {
        this.debug = { drawScore: 0, list: [] };
        const pickedObjects: any = [];
        const totalScore = this.cards.reduce(
          (sum: any, obj: any) => sum + obj.sentences.length,
          0
        );

        let cumulativeScore = 0;
        const random = Math.random() * totalScore;
        this.debug.drawScore = random;
        let i = 1;
        while (pickedObjects.length < count) {
          let drawNumber = this.getRandomNum(this.cards.length - 1);
          let preCumulativeScore = JSON.parse(JSON.stringify(cumulativeScore));
          cumulativeScore += this.cards[drawNumber].sentences.length;
          let familiar = this.answerScore.find(
            (res: any) => res.en === this.cards[drawNumber].en
          );
          if (familiar) {
            cumulativeScore +=
              familiar.score *
              -1 *
              (this.config?.questionsScore
                ? this.config?.questionsScore
                : 1000);
            if (familiar.updateTime && familiar.score <= 0) {
              let dayScore = this.config?.dayScore
                ? this.config?.dayScore
                : 1000;
              let timeDifference = this.calculateTime(familiar?.updateTime);
              cumulativeScore += timeDifference?.days * dayScore;
            }
          }

          this.debug.list.push({
            finalScore: cumulativeScore,
            en: this.cards[drawNumber]?.en,
            drawCount: i++,
            sentencesLength: this.cards[drawNumber]?.sentences?.length,
            questionScore: familiar?.score,
            questionUpdateTime: this.calculateTime(familiar?.updateTime),
            weightedScore: cumulativeScore - preCumulativeScore,
          });

          if (
            random <= cumulativeScore &&
            this.cards[drawNumber]?.en !== this.card?.en
          ) {
            if (!pickedObjects.includes(this.cards[drawNumber])) {
              pickedObjects.push(this.cards[drawNumber]);
              this.card = JSON.parse(JSON.stringify(this.cards[drawNumber]));
              this.card.score = familiar?.score;
              this.card.questionUpdateTime = this.calculateTime(
                familiar?.updateTime
              );
            }
            break;
          }
        }

        this.debug.list = this.debug.list.sort(
          (a: any, b: any) => b.drawCount - a.drawCount
        );
      } else {
        this.cards.forEach((card: any) => {
          card.score =
            this.answerScore?.find((word: any) => word?.en?.match(card?.en))
              ?.score ?? 0;
        });

        this.cards?.sort((a: any, b: any) => a.score - b.score);

        for (let i = 0; i < this.cards.length; i++) { }
      }

      this.displayMode = DisplayMode.Questions;
      this.drawSentence();
      this.calculateFamiliarity();
      this.unfamiliarReflash();
      this.tempSentencesIndex = [];
      this.updateTimer();
    } catch (err) {
      alert(err);
    }
  }

  tempSentencesIndex: any = [];
  drawSentence() {
    try {
      this.sentenceAnswerDisplay = false;
      this.sentence = undefined
      let randomNumber;
      if (this.tempSentencesIndex.length == this.card.sentences.length) {
        this.tempSentencesIndex = [];
      }
      while (!this.sentence) {
        randomNumber = this.getRandomNum(this.card.sentences.length - 1);
        if (this.tempSentencesIndex.indexOf(randomNumber) == -1) {
          if (this.sentence?.en != this.card?.sentences[randomNumber]?.en) {
            this.sentence = this.card?.sentences[randomNumber];
            this.tempSentencesIndex.push(randomNumber);
          }
        }
      }
    } catch (err) {
      alert(err);
    }
  }

  answerTodayArray: any = [];
  answerCountToday: any = 0;
  answerScoreReset(answer: any) {
    try {
      this.answerCountToday++;
      const today = new Date().setHours(0, 0, 0, 0);
      const apartDay = this.calculateTime(today);
      const nowDay = this.answerTodayArray.find(
        (ansToday: any) => ansToday.day === today
      );

      if (nowDay && apartDay.days === 0) {
        nowDay.count = this.answerCountToday;
      } else {
        this.answerTodayArray.push({
          day: today,
          count: this.answerCountToday,
        });
      }

      localStorage.setItem(
        'answerTodayArray',
        JSON.stringify(this.answerTodayArray)
      );

      let word = this.answerScore.find((word: any) => word.en == this.card.en);

      // 回答的越快增加越多分，越慢扣越多
      let trueScore = 6 - this.mapSeconds(this.seconds);
      let falseScore = this.mapSeconds(this.seconds) * -1;
      if (word) {
        answer ? (word.score += trueScore) : (word.score += falseScore);
        word.updateTime = Date.now();
      } else {
        let newWord = answer ? trueScore : falseScore;
        this.answerScore.push({
          en: this.card.en,
          score: newWord,
          updateTime: Date.now(),
        });
      }

      localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
      this.drawCard();
    } catch (err) {
      alert(err);
    }
  }

  familiarity: Familiarity | any = {};

  calculateFamiliarity() {
    try {
      this.familiarity.total = this.cards.length;
      // 未複習到 0 / undefined
      let zero = this.answerScore.filter((res: any) => res.score === 0).length;
      let undefined = this.cards.length - this.answerScore.length;
      this.familiarity.notReviewed = zero + undefined;
      // 超不熟悉 -5
      this.familiarity.veryUnfamiliar = this.answerScore.filter(
        (res: any) => res.score <= -5
      ).length;
      // 不熟悉 -
      this.familiarity.unfamiliar = this.answerScore.filter(
        (res: any) => res.score < 0 && res.score > -5
      ).length;
      // 熟悉 +
      this.familiarity.familiar = this.answerScore.filter(
        (res: any) => res.score > 0 && res.score < 5
      ).length;
      // 超熟悉 +5
      this.familiarity.veryFamiliar = this.answerScore.filter(
        (res: any) => res.score >= 5
      ).length;

      this.drawChat();
    } catch (err) {
      alert(err);
    }
  }

  drawChat() {
    try {
      if (this.chart) {
        this.chart.destroy();
      }

      const labels = [
        `未複習到 ${this.familiarity.notReviewed}`,
        `超不熟悉 ${this.familiarity.veryUnfamiliar}`,
        `不熟悉 ${this.familiarity.unfamiliar}`,
        `熟悉 ${this.familiarity.familiar}`,
        `超熟悉 ${this.familiarity.veryFamiliar}`,
      ];

      const data = [
        this.familiarity.notReviewed,
        this.familiarity.veryUnfamiliar,
        this.familiarity.unfamiliar,
        this.familiarity.familiar,
        this.familiarity.veryFamiliar,
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
              text: '熟悉度',
            },
          },
          animation: {
            duration: 0,
          },
        },
      });
    } catch (err) {
      alert(err);
    }
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
    score: '',
    similarWords: '',
  };

  searchWordMark() {
    try {
      let searchWord = this.searchWord.word.split(' ').join('');
      if (
        searchWord !== undefined &&
        searchWord !== null &&
        searchWord !== ''
      ) {
        let temp: any = [];
        this.cards.forEach((el: any) => {
          let cal = this.glgorithmsService.calculateSimilarity(
            el?.en,
            searchWord
          );
          temp.push({
            en: el?.en,
            cn: el?.cn,
            searchWord: searchWord,
            cal: cal,
          });
        });

        let sortTemp = temp.sort((a: any, b: any) => b.cal - a.cal);
        this.searchWord.similarWords = `相似單字：${sortTemp
          .slice(0, 5)
          .map((obj: any) => `[${obj.en}]${obj.cn}`)
          .join('，')}`;

        const pattern = new RegExp(`\\b${searchWord}\\b`, 'gi');
        const searched = this.cards.find((card: any) => card.en.match(pattern));
        if (searched) {
          const word = this.answerScore.find((word: any) =>
            word.en.match(pattern)
          );
          const updateTime = JSON.stringify(word?.updateTime);
          if (word) {
            word.score -= 5;
            this.searchWord.questionUpdateTime = this.calculateTime(updateTime);
            word.updateTime = Date.now();
            this.searchWord.score = word?.score;
          } else {
            this.answerScore.push({
              en: searchWord,
              score: -5,
              updateTime: Date.now(),
            });
            this.searchWord.score = -5;
          }

          localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
          this.searchWord.explain = searched.cn;
          alert('已扣 5 分');
          this.calculateFamiliarity();

          this.searchWord.display = searchWord;
          this.searchWord.word = '';
        } else {
          alert(
            `字庫搜尋不到此單字，\n以下為[距離算法]選出字庫前五個相似度高的單字。`
          );
          this.searchWord.word = sortTemp[0].en;
        }

        this.unfamiliarReflash();
      }
      this.goToAnchor('searchWordInput');
    } catch (err) {
      alert(err);
    }
  }

  nowTheme = this.themeService.GetTheme();

  setTheme() {
    this.nowTheme === this.theme.dark
      ? (this.nowTheme = this.theme.light)
      : (this.nowTheme = this.theme.dark);
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
      localStorage.setItem('drawCardConfig', JSON.stringify(this.config));
      this.drawCard();
    }
  }

  configInit() {
    let drawCardConfig: any = localStorage.getItem('drawCardConfig');
    drawCardConfig
      ? (this.config = JSON.parse(drawCardConfig))
      : (this.config = {
        dayScore: 1000,
        questionsScore: 1000,
        drawMode: 'errorFirst',
      });

    this.answerTodayArray = JSON.parse(
      localStorage.getItem('answerTodayArray') ?? `[]`
    );
    if (this.answerTodayArray.length > 0) {
      let nowDay = this.answerTodayArray?.find(
        (ansToday: any) => ansToday.day == new Date().setHours(0, 0, 0, 0)
      );
      if (nowDay) {
        this.answerCountToday = nowDay.count;
      }
    }
  }

  calculateTime(timestamp: any) {
    var timeDifference = Math.abs(Date.now() - timestamp); // 計算時間差（取絕對值）

    // 轉換為相差的天數、小時和分鐘
    var days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    var hours = Math.floor(
      (timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    var minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));

    return {
      days: days,
      hours: hours,
      minutes: minutes,
    };
  }

  displayUnfamiliar: any = JSON.parse(
    localStorage.getItem('displayUnfamiliar') ?? 'false'
  );
  changeDisplayUnfamiliar() {
    this.displayUnfamiliar = !this.displayUnfamiliar;
    localStorage.setItem(
      'displayUnfamiliar',
      JSON.stringify(this.displayUnfamiliar)
    );
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
          questionUpdateTime: this.calculateTime(el?.updateTime),
        });
      }
    });

    this.unfamiliarList.sort(
      (a: any, b: any) => a.questionScore - b.questionScore
    );
  }

  getRandomNum(max: any, min: any = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Firebase Auth & CRUD
   * // https://console.firebase.google.com/u/0/project/angular-vector-249608/firestore/data/~2FLogs~2FBIjfl9Y432Rtt3lwZJx0klt0j8M2
   * // https://github.com/angular/angularfire/blob/master/docs/firestore.md#cloud-firestore
   * // https://www.positronx.io/full-angular-firebase-authentication-system/
   */

  email: any;
  password: any;
  isEnterRegistPage: boolean = false;
  logs$!: Observable<any>;
  logs!: any;
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  user!: User | null;
  logsCollection!: CollectionReference<DocumentData, DocumentData>;

  logsSub!: Subscription;

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.user$ = authState(this.auth);
      this.refleshUser();
      this.refleshLogs();
    } catch (err) {
      alert(err);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      if (this.logsSub) {
        this.logsSub.unsubscribe();
        this.user = null;
        this.logs = null;
      }
      alert('登出成功');
    } catch (err) {
      alert(err);
    }
  }

  async signUp() {
    try {
      await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      this.refleshUser();
      this.refleshLogs();
    } catch (err) {
      alert(err);
    }
  }

  enterRegistPage() {
    this.refleshUser();
    this.refleshLogs();
    this.isEnterRegistPage = true;
  }

  refleshLogs() {
    this.logsCollection = collection(this.firestore, 'Logs');
    this.logs$ = collectionData(this.logsCollection);
    this.logsSub = this.logs$
      .pipe(
        take(1),
        tap((logs) => {
          this.logs = logs;
          this.countRankingList();
        })
      )
      .subscribe();
  }

  refleshUser() {
    if (!this.user) {
      this.user$
        .pipe(
          tap((user) => {
            this.user = user;
          }),
          take(1)
        )
        .subscribe();
    }
  }

  async updateLog() {
    if (confirm('確定要更新雲端紀錄嗎？(此動作不可逆)')) {
      if (this.user) {
        let email = this.user?.email ?? '???';
        this.logsCollection = collection(this.firestore, 'Logs');
        await setDoc(doc(this.logsCollection, this.user.uid), {
          email: email,
          answerScore: this.answerScore,
        });
        this.refleshLogs();
        alert('更新成功');
      }
    }
  }

  downloadLog() {
    if (confirm('確定要更新本地紀錄嗎？(此動作不可逆)') && this.user) {
      const log = this.logs.find((log: any) => log.email === this.user?.email);
      if (log) {
        this.answerScore = JSON.parse(JSON.stringify(log.answerScore));
        localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
        this.calculateFamiliarity();
        this.unfamiliarReflash();
        alert('更新成功');
      } else {
        alert('未找到紀錄');
      }
    }
  }

  changeDisplayName() {
    // if (res !== null) {
    //   updateProfile(res, { displayName: 'AAA' });
    // }
  }

  answeredMostQuestions: any;
  mostPositivePoints: any;
  mostNegativePoints: any;

  countRankingList() {
    if (this.logs) {
      this.answeredMostQuestions = this.logs.sort(
        (a: any, b: any) => a.answerScore.length - b.answerScore.length
      );

      this.logs.forEach((log: any) => {
        let positive = 0,
          negative = 0;
        log.answerScore.forEach((item: any) => {
          if (item.score >= 0) {
            positive += item.score;
          } else {
            negative += item.score;
          }
        });
        log.positive = positive ?? 0;
        log.negative = negative ?? 0;
      });

      this.mostPositivePoints = this.logs.sort(
        (a: any, b: any) => a.positive - b.positive
      );
      this.mostNegativePoints = this.logs.sort(
        (a: any, b: any) => a.negative - b.negative
      );
    }
  }

  timerId: any;
  seconds = 0;
  updateTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.seconds = 0;
    }
    const self = this; // 儲存組件的參考
    this.timerId = setInterval(function () {
      self.seconds++;
    }, 1000);
  }

  @ViewChild('searchWordInput') searchWordInput!: ElementRef;
  goToAnchor(anchor: string) {
    this.searchWordInput.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

  mapSeconds(inputSeconds: number) {
    const minSeconds = 1;
    const maxSeconds = 120;
    const minOutput = 1;
    const maxOutput = 5;

    // 將 inputSeconds 限制在最小秒數和最大秒數之間
    const normalizedSeconds = Math.min(
      Math.max(inputSeconds, minSeconds),
      maxSeconds
    );

    // 計算輸入範圍和輸出範圍之間的比例
    const inputRange = maxSeconds - minSeconds;
    const outputRange = maxOutput - minOutput;

    // 將秒數映射到輸出範圍內
    const mappedValue =
      Math.ceil(
        ((normalizedSeconds - minSeconds + 1) * outputRange) / inputRange
      ) +
      minOutput -
      1;

    return mappedValue;
  }
}

export enum DisplayMode {
  Answer = '答題',
  Questions = '看答案',
}

export interface Familiarity {
  total: number;
  notReviewed: number;
  unfamiliar: number;
  veryUnfamiliar: number;
  familiar: number;
  veryFamiliar: number;
}
