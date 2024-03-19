import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  Subscriber,
  Subscription,
  combineLatest,
  debounce,
  delay,
  filter,
  of,
  take,
  tap,
  timer,
} from 'rxjs';
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
            (a: any, b: any) => b?.sentences?.length - a?.sentences?.length
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
    this.debounceSub.unsubscribe();
  }

  automaticDrawCardTimer: any;
  record: any = {
    drawCountRecord: [],
    drawCountRecordDisplay: undefined,
    finalScoreRecord: [],
    finalScoreRecordDisplay: undefined,
    avgAnswerSpeed: [],
    avgAnswerSpeedDisplay: undefined,
  };

  recordCalculate() {
    this.record.drawCountRecordDisplay = this.getAverage(
      this.record.drawCountRecord
    );
    this.record.finalScoreRecordDisplay = this.getAverage(
      this.record.finalScoreRecord
    );
    this.record.avgAnswerSpeedDisplay = this.getAverage(
      this.record.avgAnswerSpeed
    );
  }

  automaticDrawCard() {
    if (this.automaticDrawCardTimer) {
      clearInterval(this.automaticDrawCardTimer);
      this.automaticDrawCardTimer = undefined;
    } else {
      if (confirm('自動抽取開始，若要結束請重複點擊按鈕')) {
        this.record.drawCountRecord = [];
        this.record.finalScoreRecord = [];
        this.automaticDrawCardTimer = setInterval(() => {
          this.drawCard();
        }, this.config.autoDrawSeconds * 1000);
      }
    }
  }

  getAverage(array: number[]) {
    return Math.round(
      array.reduce((sum, currentValue) => sum + currentValue, 0) / array.length
    );
  }

  debug: any;
  card: any;
  drawCard(): void {
    try {
      // 錯誤優先模式
      if (this.config.drawMode === 'errorFirst') {
        // 將答題表與卡片關聯
        this.cards.forEach((card: any) => {
          let findAnswer = this.answerScore?.find(
            (word: any) => word?.en === card?.en
          );
          card.score = findAnswer?.score ?? 0;
          card.updateTime = this.calculateTime(findAnswer ?? undefined);
        });

        // 依照分數與答題時間排序
        this.cards?.sort((a: any, b: any) => this.unfamiliarSorting(a, b));
      }

      this.debug = { thresholdScore: 0, list: [] };
      const totalScore = this.cards.reduce(
        (sum: any, obj: any) => sum + obj?.sentences?.length,
        0
      );

      let cumulativeScore = 0;
      const thresholdScore = Math.random() * totalScore;
      this.debug.thresholdScore = thresholdScore;
      this.record.finalScoreRecord.push(thresholdScore);
      let drawCount = 0;
      let isLocked = true;
      while (isLocked) {
        let drawNumber = 0;

        if (this.config.drawMode === 'errorFirst') {
          drawNumber = drawCount;
        } else {
          drawNumber = this.getRandomNum(this.cards?.length - 1);
        }

        let preCumulativeScore = cumulativeScore;

        // 例句數量權重
        cumulativeScore += this.cards[drawNumber]?.sentences?.length;

        // 答題權重
        let answerInfo = this.answerScore.find(
          (res: any) => res.en === this.cards[drawNumber].en
        );
        if (answerInfo) {
          cumulativeScore +=
            answerInfo.score *
            -1 *
            (this.config?.questionsScore ? this.config?.questionsScore : 1000);
          // 時間權重
          if (answerInfo.updateTime && answerInfo.score <= 0) {
            let dayScore = this.config?.dayScore ? this.config?.dayScore : 1000;
            let timeDifference = this.calculateTime(answerInfo?.updateTime);
            cumulativeScore += (timeDifference?.days ?? 1) * dayScore;
          }
        }

        // 每次抽取結果
        this.debug.list.push({
          finalScore: cumulativeScore,
          en: this.cards[drawNumber]?.en,
          drawCount: drawCount++ + 1,
          sentencesLength: this.cards[drawNumber]?.sentences?.length,
          score: answerInfo?.score,
          updateTime: this.calculateTime(answerInfo?.updateTime),
          weightedScore: cumulativeScore - preCumulativeScore,
        });

        // 累積分數超過臨界值則得獎
        if (
          thresholdScore <= cumulativeScore &&
          this.cards[drawNumber]?.en !== this.card?.en
        ) {
          this.card = JSON.parse(JSON.stringify(this.cards[drawNumber]));
          this.card.score = answerInfo?.score;
          this.card.updateTime = this.calculateTime(answerInfo?.updateTime);
          isLocked = false;
          this.record.drawCountRecord.push(drawCount);
        }
      }

      // 排序 debug 榜單
      this.debug.list = this.debug.list.sort(
        (a: any, b: any) => b.drawCount - a.drawCount
      );

      this.searchWord = {};
      this.displayMode = DisplayMode.Questions;
      this.tempSentencesIndex = [];
      this.recordCalculate();
      this.drawSentence();
      this.calculateFamiliarity();
      this.unfamiliarReflash();
      this.updateTimer();
    } catch (err) {
      alert(err);
    }
  }

  seeAnswer() {
    this.displayMode = DisplayMode.Answer;
    this.sentenceAnswerDisplay = true;

    let word = this.answerScore.find((word: any) => word.en == this.card.en);
    this.notFamiliarScore = this.notFamiliarScoreCalculations(word);

    if (this.speakSelection) {
      this.debounceBeSub$.next([this.speak, this.sentence?.en]);
    }
  }

  unfamiliarSorting(a: any, b: any) {
    if (a?.score === b?.score) {
      if (b?.updateTime?.day === a?.updateTime?.day) {
        if (b?.updateTime?.hours === a?.updateTime?.hours) {
          return b?.updateTime?.minutes - a?.updateTime?.minutes;
        } else {
          return b?.updateTime?.hours - a?.updateTime?.hours;
        }
      } else {
        return b?.updateTime?.day - a?.updateTime?.day;
      }
    } else {
      return a?.score - b?.score;
    }
  }

  tempSentencesIndex: any = [];
  drawSentence() {
    try {
      this.sentenceAnswerDisplay = false;
      this.sentence = undefined;
      let randomNumber;
      if (this.tempSentencesIndex?.length == this.card?.sentences?.length) {
        this.tempSentencesIndex = [];
      }
      while (!this.sentence) {
        randomNumber = this.getRandomNum(this.card?.sentences?.length - 1);
        if (this.tempSentencesIndex.indexOf(randomNumber) == -1) {
          if (this.sentence?.en != this.card?.sentences[randomNumber]?.en) {
            this.sentence = this.card?.sentences[randomNumber];
            this.tempSentencesIndex.push(randomNumber);
          }
        }
      }

      this.searchWord = {};
    } catch (err) {
      alert(err);
    }
  }

  answerTodayArray: any = [];
  answerCountToday: any = 0;
  answerScoreReset(answer: any) {

    if (this.speakSelection) {
      this.debounceBeSub$.next([this.speak, this.card.en]);
    }

    try {
      this.record.avgAnswerSpeed.push(this.seconds);
      this.answerCountToday++;
      const today = new Date().setHours(0, 0, 0, 0);
      const apartDay = this.calculateTime(today);
      const nowDay = this.answerTodayArray.find(
        (ansToday: any) => ansToday.day === today
      );

      if (nowDay && apartDay?.days === 0) {
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
      let trueScore = 6 - this.mapScore(this.seconds);
      // let falseScore = this.mapScore(this.seconds) * -1;
      if (word) {
        // answer ? (word.score += trueScore) : (word.score -= 5);
        // 30 內天類依比例扣分 7-15 天扣最低，7 天內與 15 至其餘天數 & 一天以內直接扣最大分
        // 看答案時計算 notFamiliarScore 顯示後再拿來此處使用
        answer ? (word.score += trueScore) : this.notFamiliarScore;
        word.updateTime = Date.now();
      } else {
        // 第一次錯直接扣 50 
        // let newWord = answer ? trueScore : falseScore;
        let newWord = answer ? trueScore : -50;
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

  familiarScore = 1;
  notFamiliarScore = 0;
  notFamiliarScoreCalculations(word: any) {
    // 30 內天類依比例扣分 7-15 天扣最低，7 天內與 15 至其餘天數 & 一天以內直接扣最大分
    let falseScoreTime = this.calculateTime(word?.updateTime);
    let falseScore;
    let familiarDays = falseScoreTime?.days ?? 0;
    if (familiarDays > 0 && familiarDays <= 7) {
      falseScore = (50 - this.mapScore(familiarDays, 7, 5, 50) + 4) * -1;
    } else if (familiarDays >= 15) {
      falseScore = this.mapScore(familiarDays, 30, 5, 50) * -1;
    } else if (familiarDays <= 0) {
      falseScore = -20;
    } else {
      falseScore = -10;
    }

    return falseScore;
  }

  mapScore(inputValue: number, maxInput: number = 120, minOutput: number = 1, maxOutput: number = 5) {
    const minSeconds = 1;
    // 將 inputSeconds 限制在最小秒數和最大秒數之間
    const normalizedinputValue = Math.min(
      Math.max(inputValue, minSeconds),
      maxInput
    );
    // 計算輸入範圍和輸出範圍之間的比例
    const inputRange = maxInput - minSeconds;
    const outputRange = maxOutput - minOutput;

    // 將秒數映射到輸出範圍內
    let mappedValue = Math.ceil(((normalizedinputValue / inputRange) * outputRange));

    if ((normalizedinputValue / inputRange) > 1) {
      mappedValue = maxOutput;
    }

    if (mappedValue < minOutput) {
      mappedValue = minOutput;
    }

    return mappedValue;
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

  // https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
  searchWordMark() {
    try {

      if (window.getSelection()?.empty) {  // Chrome
        window.getSelection()?.empty();
      }

      if (
        this.searchWord.word !== undefined &&
        this.searchWord.word !== null &&
        this.searchWord.word.replace(/\s*/g, '') !== ''
      ) {
        let temp: any = [];
        this.cards.forEach((el: any) => {
          let cal = this.glgorithmsService.calculateSimilarity(
            el?.en,
            this.searchWord.word
          );
          temp.push({
            en: el?.en,
            cn: el?.cn,
            searchWord: this.searchWord.word,
            cal: cal,
          });
        });

        let sortTemp = temp.sort((a: any, b: any) => b.cal - a.cal);
        this.searchWord.similarWords = `相似單字：${sortTemp
          .slice(0, 5)
          .map((obj: any) => `[${obj.en}]${obj.cn}`)
          .join('，')}`;

        const pattern = new RegExp(`\\b${this.searchWord.word}\\b`, 'gi');
        const searched = this.cards.find((card: any) => card.en.match(pattern));
        if (searched) {
          const word = this.answerScore.find((word: any) =>
            word.en.match(pattern)
          );
          const updateTime = JSON.stringify(word?.updateTime);
          if (word) {
            word.score -= this.notFamiliarScoreCalculations(word);
            this.searchWord.updateTime = this.calculateTime(updateTime);
            word.updateTime = Date.now();
            this.searchWord.score = word?.score;
          } else {
            this.answerScore.push({
              en: this.searchWord.word,
              score: -50,
              updateTime: Date.now(),
            });
            this.searchWord.score = -50;
          }

          localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
          this.searchWord.explain = searched.cn;
          // alert('已扣 5 分'); todo 彈出自動消失匡
          this.calculateFamiliarity();

          this.searchWord.display = this.searchWord.word;
          this.searchWord.word = '';
        } else {
          // alert(
          //   `字庫搜尋不到此單字，\n以下為[距離算法]選出字庫前五個相似度高的單字。`
          // ); todo 彈出自動消失匡
          this.searchWord.word = sortTemp[0].en;
        }

        if (this.speakSelection) {
          this.debounceBeSub$.next([this.speak, this.searchWord.display ?? this.searchWord.word]);
        }

        this.unfamiliarReflash();
      }
      // this.goToAnchor('searchWordInput');
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
        dayScore: 500,
        questionsScore: 10,
        drawMode: 'completelyRandom',
        autoDrawSeconds: 45,
        speakSelectVoice: 'Google UK English Male',
      });

    if (!this.config.drawMode) {
      localStorage.removeItem('drawCardConfig');
      this.config = {
        dayScore: 500,
        questionsScore: 10,
        drawMode: 'completelyRandom',
      };
    }

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
    if (!timestamp) {
      return undefined;
    }

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
          score: el?.score,
          updateTime: this.calculateTime(el?.updateTime),
          displayAnswer: false,
        });
      }
    });

    this.unfamiliarList.sort((a: any, b: any) => this.unfamiliarSorting(a, b));
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
        this.isEnterRegistPage = false;
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
        this.isEnterRegistPage = false;
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
      // 每 20 秒檢查得分數
      if (self.seconds % 20 === 0) {
        self.familiarScore = self.mapScore(self.seconds);
      }
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

  setUnfamiliarDisplayAnswer(item: any) {
    item.displayAnswer = !item.displayAnswer;
    setTimeout(() => {
      item.displayAnswer = !item.displayAnswer;
    }, 5000);

    if (this.speakSelection) {
      this.debounceBeSub$.next([this.speak, item?.en]);
    }
  }

  answerUnfamiliarScoreReset(answer: any, keyword: string) {
    let word = this.answerScore.find((word: any) => word.en == keyword);
    answer ? (word.score += 10) : (word.score -= 10);
    word.updateTime = Date.now();
    localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
    this.calculateFamiliarity();
    this.unfamiliarReflash();
  }

  // https://gist.github.com/Eotones/d67be7262856a79a77abeeccef455ebf
  // https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
  synth = window.speechSynthesis;
  speakSelection: any = false;
  voices: any = [];
  @HostListener('window:mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  mouseUp(event: MouseEvent) {
    let d: any = document;
    let selection: any = null;
    let word = '';

    if (window.getSelection) {
      selection = window.getSelection();
      word = selection?.toString();
    } else if (typeof d.selection != 'undefined') {
      selection = d.selection;
      word = d.selection.createRange().text;
    }

    if (
      word !== undefined &&
      word !== null &&
      word.replace(/\s*/g, '') !== ''
    ) {
      this.searchWord.word = word;
      if (this.speakSelection) {
        this.debounceBeSub$.next([this.speak, this.searchWord.word]);
      }
    }
  }

  // https://stackoverflow.com/questions/41539680/speechsynthesis-speak-not-working-in-chrome
  debounceBeSub$: BehaviorSubject<any> = new BehaviorSubject([
    this.speak,
    this.speakSelection,
  ]);
  debounceSub!: Subscription;
  debounceHandler() {
    this.debounceSub = this.debounceBeSub$
      ?.pipe(
        debounce(() => timer(1000)),
        tap(([fn, val]: any) => {
          // 因為 chrome 政策，無法使用匿名函式觸發 speak，但其他函式應該還是可以
          // fn(val)
          this.speak(val);
        })
      )
      ?.subscribe();
  }

  speak(msg: string): void {
    if (this.synth) {
      this.voices = this.synth?.getVoices();
      let voice: any = this.voices?.find(
        (voice: any) => voice.name === this.config?.speakSelectVoice
      );
      let speechSynthesisUtterance = new SpeechSynthesisUtterance();
      if (voice) {
        speechSynthesisUtterance.voice = voice;
      }
      speechSynthesisUtterance.text = msg;
      this.synth?.speak(speechSynthesisUtterance);
    }
  }

  setSpeakSelection() {
    this.speakSelection = !this.speakSelection;
    alert(this.speakSelection ? '開啟點擊朗讀模式' : '關閉點擊朗讀模式');
    if (this.speakSelection) {
      this.debounceHandler();
    } else {
      this.debounceSub.unsubscribe();
    }
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
