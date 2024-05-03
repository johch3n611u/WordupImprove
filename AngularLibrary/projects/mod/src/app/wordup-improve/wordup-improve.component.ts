import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild, isDevMode } from '@angular/core';
import {
  Subscription,
  combineLatest,
  debounce,
  filter,
  switchMap,
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
import { GlgorithmsService, REGEXP_TYPE, ServiceWorkerService } from 'lib/feature';
import { DatePipe } from '@angular/common';
import { CommonService } from 'lib/feature/common/common.service';

@Component({
  selector: 'mod-wordup-improve',
  templateUrl: './wordup-improve.component.html',
  styleUrls: ['./wordup-improve.component.scss'],
})
export class WordupImproveComponent {
  DisplayMode = DisplayMode;
  displayMode = DisplayMode.Questions;
  REGEXP_TYPE = REGEXP_TYPE;

  constructor(
    private httpClient: HttpClient,
    public themeService: ThemeService,
    private glgorithmsService: GlgorithmsService,
    private serviceWorkerService: ServiceWorkerService,
    private datePipe: DatePipe,
    private commonService: CommonService,
  ) {
    this.initCards();

    this.themeService.setTheme(this.themeService.getTheme());

    // if (!isDevMode()) {
    //   this.autoUpdateLog();
    // }
  }

  ngOnDestroy() {
    this.combineUserAndLogs$?.unsubscribe();
    this.debounceSub$?.unsubscribe();
    if (this.automaticDrawCardTimer) {
      clearInterval(this.automaticDrawCardTimer);
      this.timerId = null;
    }
  }

  ngAfterViewInit() {
    this.serviceWorkerService.judgmentUpdate();
  }

  record: any = {
    drawCountRecord: [],
    drawCountRecordDisplay: undefined,
    finalScoreRecord: [],
    finalScoreRecordDisplay: undefined,
    avgAnswerSpeed: [],
    avgAnswerSpeedDisplay: undefined,
  };
  recordCalculate() {
    this.record.drawCountRecordDisplay = Math.round(
      this.record.drawCountRecord.reduce((sum: any, currentValue: any) => sum + currentValue, 0) / this.record.drawCountRecord.length
    );

    this.record.finalScoreRecordDisplay = Math.round(
      this.record.finalScoreRecord.reduce((sum: any, currentValue: any) => sum + currentValue, 0) / this.record.finalScoreRecord.length
    );

    this.record.avgAnswerSpeedDisplay = Math.round(
      this.record.avgAnswerSpeed.reduce((sum: any, currentValue: any) => sum + currentValue, 0) / this.record.avgAnswerSpeed.length
    );
  }

  automaticDrawCardTimer: any;
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

  url = './assets/enHelper/scoreData.json';
  cards: Array<Card> = [];
  answerScore: any = [];
  initCards() {
    this.httpClient
      .get(this.url)
      .pipe(
        tap((res: any) => {
          this.cards = res;
          this.answerScore = JSON.parse(
            localStorage.getItem('answerScore') ?? '[]'
          );
          this.cardslinkScore();
          this.configInit();
          this.editedCardsInit();
        })
      )
      .subscribe((res: any) => {
        this.drawCard();
      });
  }

  // cards 資料太大包，是固定 json 檔案，搭配 firebase 上記錄分數的檔案
  cardslinkScore() {
    this.cards.forEach((card: Card) => {
      let findAnswer = this.answerScore?.find(
        (word: any) => word?.en === card?.en
      );
      card.score = findAnswer?.score ?? 0;
      card.updateTime = this.calculateTime(findAnswer?.updateTime);
    });
  }

  debug: any;
  card: Card = new Card();
  drawCard(): void {
    // 錯誤優先模式
    if (this.config.drawMode === 'errorFirst') {
      // 依照分數與答題時間排序
      this.cardslinkScore();
      this.cards?.sort((a: any, b: any) => this.unfamiliarSorting(a, b));
    }

    this.debug = { thresholdScore: 0, list: [] };
    const totalScore = this.cards.reduce(
      (sum: any, obj: any) => sum + obj?.sentences?.length,
      0
    );

    let cumulativeScore = 0;
    const thresholdScore = Math.floor(Math.random() * totalScore);
    this.debug.thresholdScore = thresholdScore;
    this.record.finalScoreRecord.push(thresholdScore);
    let drawCount = 0;
    let isLocked = true;

    while (isLocked) {

      let drawNumber = 0;
      let answerInfo = this.answerScore.find((res: any) => res.en === this.cards[drawNumber].en);

      if (this.config.drawMode !== 'errorFirst') {
        drawNumber = this.glgorithmsService.getRandomNum(this.cards?.length - 1);
        answerInfo = this.answerScore.find((res: any) => res.en === this.cards[drawNumber].en);
        let preCumulativeScore = cumulativeScore;

        // 例句數量權重
        let exSentsScore, ansScore, timeDiffeScore, recordAvgScore, noAnsRandomScore;
        exSentsScore = Math.floor(this.cards[drawNumber]?.sentences?.length / 50);
        cumulativeScore += exSentsScore;

        // 答題權重
        if (answerInfo) {
          ansScore = answerInfo.score * -1 * (this.config?.questionsScore ?? 10);
          cumulativeScore += ansScore;
          // 時間權重
          if (answerInfo.updateTime && answerInfo.score <= 0) {
            let dayScore = this.config?.dayScore ?? 50;
            timeDiffeScore = Math.floor(((this.calculateTime(answerInfo?.updateTime)?.days ?? 1) * dayScore * (answerInfo.score * -1)) / 50);
            cumulativeScore += timeDiffeScore;
          }
        } else {
          // 未答題隨機基礎權重
          recordAvgScore = Math.floor(this.record?.finalScoreRecordDisplay / this.record?.drawCountRecordDisplay);
          noAnsRandomScore = Math.floor(Math.random() * (Number.isNaN(recordAvgScore) ? 1000 : recordAvgScore)) + 1;
          cumulativeScore += noAnsRandomScore;
        }

        // 每次抽取結果
        this.debug.list.push({
          finalScore: cumulativeScore,
          en: this.cards[drawNumber]?.en,
          drawCount: drawCount++ + 1,
          sentencesLength: exSentsScore,
          score: answerInfo?.score,
          updateTime: this.calculateTime(answerInfo?.updateTime),
          weightedScore: cumulativeScore - preCumulativeScore,
          ansScore: ansScore,
          timeDiffeScore: timeDiffeScore,
          noAnsRandomScore: noAnsRandomScore,
          recordAvgScore: recordAvgScore,
        });

        // 答題正的也能被抽到
        if (cumulativeScore < 0) {
          cumulativeScore = (this.config?.questionsScore ?? 10);
        }
      }

      // 累積分數超過臨界值則得獎
      if (
        (thresholdScore <= cumulativeScore && this.cards[drawNumber]?.en !== this.card?.en) || this.config.drawMode === 'errorFirst'
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
  }

  sentence: any;
  sentenceAnswerDisplay: any = true;
  seeAnswer() {
    this.displayMode = DisplayMode.Answer;
    this.sentenceAnswerDisplay = true;

    let word = this.answerScore.find((word: any) => word.en == this.card.en);
    this.notFamiliarScore = this.notFamiliarScoreCalculations(word);
    this.familiarScore = this.glgorithmsService.mapScore(this.seconds);

    if (this.config.seeAnswerSpeak) {
      this.debounceBeSub$?.next([this.speak, this.sentence?.en]);
    }

    // 避免不熟榜 lag
    this.displayUnfamiliar = false;
  }

  showExanpleAnswers() {
    this.sentenceAnswerDisplay = true;
    this.debounceBeSub$?.next([this.speak, this.sentence?.en]);
  }

  unfamiliarSorting(a: any, b: any) {
    if (a?.score > 0 || b?.score > 0) {
      return a?.score - b?.score;
    } else {
      let tempSortA = (a?.score * 1.15) - a?.updateTime?.days;
      let tempSortB = (b?.score * 1.15) - b?.updateTime?.days;
      if (tempSortA === tempSortB) {
        if (a?.updateTime?.days === b?.updateTime?.days) {
          if (a?.score === b?.score) {
            if (a?.updateTime?.hours === b?.updateTime?.hours) {
              return b?.updateTime?.minutes - a?.updateTime?.minutes;
            } else {
              return b?.updateTime?.hours - a?.updateTime?.hours;
            }
          } else {
            return a?.score - b?.score;
          }
        } else {
          return b?.updateTime?.days - a?.updateTime?.days;
        }
      } else {
        let aUpdateTime = a?.updateTime?.days == 0 && a?.updateTime?.hours <= 1;
        let bUpdateTime = b?.updateTime?.days == 0 && b?.updateTime?.hours <= 1;
        if (aUpdateTime && bUpdateTime) {
          return tempSortB - tempSortA;
        } else if (aUpdateTime) {
          return 1;
        } else if (bUpdateTime) {
          return -1;
        } else {
          return tempSortA - tempSortB;
        }
      }
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
        randomNumber = this.glgorithmsService.getRandomNum(this.card?.sentences?.length - 1);
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

  answerScoreReset(answer: any) {
    // 避免不熟榜 lag
    this.displayUnfamiliar = false;

    this.debounceBeSub$?.next([this.speak, this.card.en]);

    try {
      this.record.avgAnswerSpeed.push(this.seconds);

      let word = this.answerScore.find((word: any) => word.en == this.card.en);

      // 回答的越快增加越多分，越慢扣越多
      let trueScore = 11 - this.glgorithmsService.mapScore(this.seconds, 200, 1, 10);
      // let falseScore = this.mapScore(this.seconds) * -1;
      if (word) {
        // answer ? (word.score += trueScore) : (word.score -= 5);
        // 30 內天類依比例扣分 7-15 天扣最低，7 天內與 15 至其餘天數 & 一天以內直接扣最大分
        // 看答案時計算 notFamiliarScore 顯示後再拿來此處使用
        answer ? (word.score += trueScore) : word.score += this.notFamiliarScore;
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
    if (!word) {
      falseScore = -50;
    } else if (familiarDays > 0 && familiarDays <= 7) {
      falseScore = (50 - this.glgorithmsService.mapScore(familiarDays, 7, 5, 50) + 4) * -1;
    } else if (familiarDays >= 15) {
      falseScore = this.glgorithmsService.mapScore(familiarDays, 30, 5, 50) * -1;
    } else if (familiarDays <= 0) {
      falseScore = -20;
    } else {
      falseScore = -10;
    }

    return falseScore;
  }

  familiarity: Familiarity = new Familiarity();
  calculateFamiliarity() {
    this.familiarity = new Familiarity();
    this.familiarity.total = this.cards.length;

    for (const card of this.cards) {
      if (card.score === 0) {
        this.familiarity.notReviewed++; // 未複習到
      } else if (card.score <= -50) {
        this.familiarity.veryUnfamiliar++; // 超不熟悉
      } else if (card.score < 0 && card.score > -50) {
        this.familiarity.unfamiliar++; // 不熟悉
      } else if (card.score > 0 && card.score < 25) {
        this.familiarity.familiar++; // 熟悉 +
      } else if (card.score >= 50) { // 超熟悉 +5
        this.familiarity.veryFamiliar++;
      }

      if (card.score <= 0) {
        if (card.updateTime?.days === 0 && card.updateTime?.hours === 0 && card.updateTime?.minutes <= 20 && card.updateTime?.minutes > 0) {
          this.familiarity.twentyMinutes++; // 20分鐘後，42%被遺忘掉，58%被記住。
        }
        if (card.updateTime?.days < 1 && card.updateTime?.hours >= 1) {
          this.familiarity.oneHour++; // 1小時後，56%被遺忘掉，44%被記住。
          this.config.answerCountToday = this.familiarity.oneHour;
        }
        if (card.updateTime?.days >= 1 && card.updateTime?.days <= 7) {
          this.familiarity.oneDay++; // 1天後，74%被遺忘掉，26%被記住。
        }
        if (card.updateTime?.days >= 7 && card.updateTime?.days <= 30) {
          this.familiarity.sevenDays++; // 1周後，77%被遺忘掉，23%被記住。
        }
        if (card.updateTime?.days >= 30) {
          this.familiarity.oneMonth++; // 1個月後，79%被遺忘掉，21%被記住。
        }
      }
    }

    // this.drawChat();
  }

  // chart: any;
  // drawChat() {
  //   try {
  //     if (this.chart) {
  //       this.chart.destroy();
  //     }

  //     const labels = [
  //       `未複習到 ${this.familiarity.notReviewed}`,
  //       `超不熟悉 ${this.familiarity.veryUnfamiliar}`,
  //       `不熟悉 ${this.familiarity.unfamiliar}`,
  //       `熟悉 ${this.familiarity.familiar}`,
  //       `超熟悉 ${this.familiarity.veryFamiliar}`,
  //     ];

  //     const data = [
  //       this.familiarity.notReviewed,
  //       this.familiarity.veryUnfamiliar,
  //       this.familiarity.unfamiliar,
  //       this.familiarity.familiar,
  //       this.familiarity.veryFamiliar,
  //     ];

  //     this.chart = new Chart('canvas', {
  //       type: 'pie',
  //       data: {
  //         labels: labels,
  //         datasets: [
  //           {
  //             label: '# of Votes',
  //             data: data,
  //             borderWidth: 1,
  //           },
  //         ],
  //       },
  //       options: {
  //         responsive: true,
  //         plugins: {
  //           legend: {
  //             position: 'top',
  //           },
  //           title: {
  //             display: true,
  //             text: '熟悉度',
  //           },
  //         },
  //         animation: {
  //           duration: 0,
  //         },
  //       },
  //     });
  //   } catch (err) {
  //     alert(err);
  //   }
  // }

  onResize(event: any) {
    // this.drawChat();
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

  // @ViewChild('searchWordInput') searchWordInput!: ElementRef;
  // https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
  searchWordMark() {
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
        try {
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
        } catch (ex) {
          console.log(el);
        }
      });

      let sortTemp = temp.sort((a: any, b: any) => b.cal - a.cal);
      this.searchWord.similarWords = `相似單字：${sortTemp
        .slice(0, 10)
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
          let notFamiliarScore = this.notFamiliarScoreCalculations(word);
          word.score += notFamiliarScore > 0 ? notFamiliarScore * -1 : notFamiliarScore;
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

      this.debounceBeSub$?.next([this.speak, this.searchWord.display ?? this.searchWord.word]);
      this.unfamiliarReflash();
    }
    // this.commonService.goToAnchor(this.searchWordInput);
  }

  theme = Theme;
  nowTheme = this.themeService.getTheme();
  setTheme() {
    this.nowTheme === this.theme.dark
      ? (this.nowTheme = this.theme.light)
      : (this.nowTheme = this.theme.dark);
    this.themeService.setTheme(this.nowTheme);
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

  debugDisplay = false;
  clickDebug() {
    this.debugDisplay = !this.debugDisplay;
  }

  config: Config = new Config();
  configInit() {
    let drawCardConfig: any = localStorage.getItem('drawCardConfig');
    if (drawCardConfig) {
      this.config = JSON.parse(drawCardConfig)
    }
  }

  importConfig() {
    if (confirm('確定要更改設定檔嗎？')) {
      localStorage.setItem('drawCardConfig', JSON.stringify(this.config));
      this.drawCard();
    }
  }

  calculateTime(timestamp: any) {
    if (!timestamp) {
      return { days: 0, hours: 0, minutes: 0 };
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

  displayUnfamiliar: any = false;
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

  sortByMostNegative() {
    this.unfamiliarList.sort((a: any, b: any) => a.score - b.score);
  }

  /**
   * Firebase Auth & CRUD
   * // https://console.firebase.google.com/u/0/project/angular-vector-249608/firestore/data/~2FLogs~2FBIjfl9Y432Rtt3lwZJx0klt0j8M2
   * // https://github.com/angular/angularfire/blob/master/docs/firestore.md#cloud-firestore
   * // https://www.positronx.io/full-angular-firebase-authentication-system/
   */

  firebaseAuth: FirebaseAuth = new FirebaseAuth();
  combineUserAndLogs$!: Subscription;
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  logsCollection!: CollectionReference<DocumentData, DocumentData>;

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.firebaseAuth.email, this.firebaseAuth.password);
      this.user$ = authState(this.auth);
    } catch (err) {
      alert(err);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      if (this.combineUserAndLogs$) {
        this.combineUserAndLogs$.unsubscribe();
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
        this.firebaseAuth.email,
        this.firebaseAuth.password
      );
    } catch (err) {
      alert(err);
    }
  }

  enterRegistPage() {
    // if (isDevMode()) {
    //   this.autoUpdateLog();
    // }
    this.firebaseAuth.isEnterRegistPage = true;
  }

  async updateLog(direct: boolean = true) {
    if (direct || confirm('確定要更新雲端紀錄嗎？(此動作不可逆)')) {
      user(this.auth).pipe(
        take(1),
        tap(async (user) => {
          if (user) {
            this.logsCollection = collection(this.firestore, 'Logs');
            const editedCardsString = JSON.stringify(this.editedCards?.cards);
            await setDoc(doc(this.logsCollection, user.uid), {
              email: user.email,
              answerScore: this.answerScore,
              editedCards: editedCardsString,
              editedCardsDate: this.editedCards?.date,
            });
            alert('更新成功');
            this.firebaseAuth.isEnterRegistPage = false;
          }
        }),
        take(1),
      ).subscribe();
    }
  }

  downloadLog(direct: boolean = true) {
    if (direct || confirm('確定要更新本地紀錄嗎？(此動作不可逆)')) {
      this.combineUserAndLogs$ = combineLatest([
        this.user$,
        collectionData(collection(this.firestore, 'Logs'))
      ]).pipe(
        take(1),
        tap(async ([user, logs]) => {
          const log: any = logs.find((log: any) => log.email === user?.email);
          if (log) {
            this.answerScore = JSON.parse(JSON.stringify(log.answerScore));
            localStorage.setItem('answerScore', JSON.stringify(this.answerScore));

            let tempEditedCards = JSON.parse(log.editedCards);
            this.editedCards.cards = tempEditedCards;
            this.editedCards.card = new Card();
            this.editedCards.date = log.editedCardsDate;
            localStorage.setItem('editedCards', JSON.stringify(this.editedCards));

            this.calculateFamiliarity();
            this.unfamiliarReflash();
            alert('更新成功');
            this.firebaseAuth.isEnterRegistPage = false;
            this.drawCard();
          } else {
            alert('未找到紀錄');
          }
        }),
        take(1),
      ).subscribe();
    }
  }

  timerId: any;
  seconds = 0;
  updateTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      this.seconds = 0;
    }
    const self = this; // 儲存組件的參考
    this.timerId = setInterval(function () {
      self.seconds++;
      // 每 5 秒檢查得分數
      if (self.seconds % 5 === 0) {
        self.familiarScore = self.glgorithmsService.mapScore(self.seconds, 200, 1, 10);
      }
    }, 1000);
  }

  setUnfamiliarDisplayAnswer(item: any) {
    item.displayAnswer = !item.displayAnswer;
    setTimeout(() => {
      item.displayAnswer = !item.displayAnswer;
    }, 5000);

    this.debounceBeSub$?.next([this.speak, item?.en]);
  }

  answerUnfamiliarScoreReset(answer: any, keyword: string) {
    let word = this.answerScore.find((word: any) => word.en == keyword);
    let notFamiliarScore = this.notFamiliarScoreCalculations(word);
    answer ? (word.score += 10) : (word.score += notFamiliarScore > 0 ? notFamiliarScore * -1 : notFamiliarScore);
    word.updateTime = Date.now();
    localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
    this.calculateFamiliarity();
    this.unfamiliarReflash();
  }

  // https://gist.github.com/Eotones/d67be7262856a79a77abeeccef455ebf
  // https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
  synth = window.speechSynthesis;
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
      this.debounceBeSub$?.next([this.speak, this.searchWord.word]);
    }
  }

  // https://stackoverflow.com/questions/41539680/speechsynthesis-speak-not-working-in-chrome
  debounceBeSub$: BehaviorSubject<any> = new BehaviorSubject([
    this.speak,
    'Turn on reading mode',
  ]);
  debounceSub$!: Subscription;
  debounceHandler() {
    let initMsg = 'Turn on reading mode';
    this.debounceSub$ = this.debounceBeSub$
      ?.pipe(
        debounce(() => timer(1000)),
        tap(([fn, val]: any) => {
          // 因為 chrome 政策，無法使用匿名函式觸發 speak，但其他函式應該還是可以
          // fn(val)
          val = val ?? initMsg;
          this.speak(val);
        })
      )
      ?.subscribe();
  }

  tempSpeakMsg = '';
  speak(msg: string): void {
    if (this.synth) {
      this.voices = this.synth?.getVoices();
      let voice: any = this.voices?.find(
        (voice: any) => voice.name === this.config?.speakSelectVoice
      );
      let speechSynthesisUtterance = new SpeechSynthesisUtterance();
      // https://stackoverflow.com/questions/52975068/speechsynthesis-in-android-chrome-cannot-change-english-voice-from-us-english
      if (voice) {
        speechSynthesisUtterance.voice = voice;
      }
      speechSynthesisUtterance.text = msg;

      // 念一次降速後念一次增速
      if (this.tempSpeakMsg === msg) {
        speechSynthesisUtterance.rate = 0.5;
      } else {
        speechSynthesisUtterance.rate = this.config?.speakRate ?? 1;
      }

      this.synth?.speak(speechSynthesisUtterance);
      this.tempSpeakMsg = msg;
    }
  }

  setSpeakSelection() {
    let isReadingMode = this.debounceSub$ && !this.debounceSub$.closed;
    alert(!isReadingMode ? '開啟點擊朗讀模式' : '關閉點擊朗讀模式');
    if (!isReadingMode) {
      this.debounceHandler();
    } else {
      this.debounceSub$.unsubscribe();
    }
  }

  speakXXX(XXX: string) {
    if (!(this.debounceSub$ && !this.debounceSub$.closed)) {
      this.debounceHandler();
    }

    this.debounceBeSub$.next([this.speak, XXX]);
  }

  searchChineseObj = { word: '', similarWords: '' };
  searchChinese() {
    if (
      this.searchChineseObj.word !== undefined &&
      this.searchChineseObj.word !== null &&
      this.searchChineseObj.word.replace(/\s*/g, '') !== ''
    ) {
      let temp: any = [];
      this.searchChineseObj.similarWords = '找無';
      this.cards.forEach((el: any) => {
        try {
          let cn = el.cn.join(',');
          if (this.searchChineseObj.word.match(new RegExp(el.cn, 'i')) || cn.match(new RegExp(this.searchChineseObj.word, 'i'))) {
            temp.push(`[${el.en}]${el.cn}`);
          }
        } catch (ex) {
          console.log(typeof (el.cn), el.en)
        }
      });

      if (temp.length > 0) {
        this.searchChineseObj.similarWords = '相似單字：' + temp.join('、');
      }
    } else {
      this.searchChineseObj.similarWords = '';
    }
  }


  editedCards: any = { date: '', cards: [], card: new Card(), notEditMode: true, displayAddNewCard: false, displayUpdateCnEdite: false };
  editedCardsInit() {
    let temp = localStorage.getItem('editedCards');
    if (temp) {
      this.editedCards = JSON.parse(temp);
    }

    this.editedCards.displayAddNewCard = false;
    this.editedCards.card = new Card();
    this.editedCards.notEditMode = true;
    this.refreshCnEdited();
  }

  updateCnEdite(card: any) {
    this.editedCards.displayUpdateCnEdite = false;
    this.editedCards.notEditMode = true;

    this.editedCards.date = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss');
    let tempCard = this.editedCards.cards.find((c: any) => c.en === card.en.trim().toLowerCase());
    let tempCard2 = this.cards.find((c: any) => c.en === card.en.trim().toLowerCase());

    if (tempCard) {
      tempCard.cn = [card.cn];
    } else {
      let newCard: any = new Card();
      newCard.en = tempCard2?.en;
      newCard.cn = [card.cn];
      this.editedCards.cards.push(newCard);
    }

    let editedCards = JSON.stringify(this.editedCards);
    localStorage.setItem('editedCards', editedCards);
    this.editedCards.card = new Card();
    this.refreshCnEdited();
  }

  refreshCnEdited() {
    // this.editedCards.cards.forEach((c: any) => {
    //   let tempCard = this.cards.find((card: any) => card.en === c.en);
    //   if (tempCard) {
    //     tempCard.cn = c.cn;
    //   } else {
    //     this.cards.push(c);
    //   }
    // });

    // 這樣做的好處是將 cards 中每張卡片的 en 屬性作為索引，這樣就可以直接通過 en 屬性查找，
    // 而不需要每次都使用 find 方法在 this.cards 中搜索。這樣可以提高效率，特別是在 this.cards 非常大的情況下。

    const cardIndex: any = {};
    this.cards.forEach((card) => {
      cardIndex[card.en] = card;
    });

    this.editedCards.cards.forEach((card: Card) => {
      if (cardIndex[card.en]) {
        cardIndex[card.en].cn = card.cn;
      } else {
        this.cards.push(card);
      }
    });
  }

  addNewCard() {
    // this.editedCards.displayUpdateCnEdite = false;
    // if (this.editedCards.card.en.replace(/\s*/g, '') !== '' && confirm('確認新增卡片?')) {
    //   let tempCard = this.cards.find((card: any) => card.en === this.editedCards.card.en.trim().toLowerCase());
    //   if (this.editedCards.card.cn.toString() === '') {
    //     if (tempCard) {
    //       alert('卡片已存在，是否更新中文？');
    //       console.log(tempCard.cn)
    //       this.editedCards.displayUpdateCnEdite = true;
    //       this.editedCards.card = new Card();
    //       this.editedCards.card.en = tempCard.en.trim().toLowerCase();
    //       let temp = tempCard.cn.join(', ');
    //       this.editedCards.card.cn = [];
    //       this.editedCards.card.cn.push(temp);
    //     } else {
    //       alert('卡片不存在，請繼續新增');
    //     }
    //   } else {
    //     if (!tempCard) {
    //       this.editedCards.card.en = this.editedCards.card.en.trim().toLowerCase();
    //       this.editedCards.cards.push(this.editedCards.card);
    //       this.editedCards.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
    //       let editedCards = JSON.stringify(this.editedCards);
    //       localStorage.setItem('editedCards', editedCards);
    //       this.editedCards.card = new Card();
    //       // this.editedCards.displayAddNewCard = !this.editedCards.displayAddNewCard;
    //       this.refreshCnEdited();
    //     } else {
    //       alert('卡片已存在，是否更新中文？');
    //       this.editedCards.displayUpdateCnEdite = true;
    //       this.editedCards.card = new Card();
    //       this.editedCards.card.en = tempCard.en.trim().toLowerCase();
    //       let temp = tempCard.cn.join(', ');
    //       this.editedCards.card.cn = [];
    //       this.editedCards.card.cn.push(temp);
    //     }
    //   }
    // }

    const { en, cn } = this.editedCards.card;
    const trimmedEn = en.trim().toLowerCase();

    if (trimmedEn.replace(/\s*/g, '') !== '' && confirm('確認新增卡片?')) {
      const tempCard = this.cards.find((card: any) => card.en === trimmedEn);

      const handleExistingCard = () => {
        alert('卡片已存在，是否更新中文？');
        this.editedCards.displayUpdateCnEdite = true;
        this.editedCards.card = new Card();
        this.editedCards.card.en = trimmedEn;
        this.editedCards.card.cn = [tempCard?.cn.join(', ')];
      };

      if (cn.toString() === '') {
        if (tempCard) {
          handleExistingCard();
        } else {
          alert('卡片不存在，請繼續新增');
        }
      } else {
        if (!tempCard) {
          this.editedCards.cards.push(this.editedCards.card);
          this.editedCards.date = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss');
          localStorage.setItem('editedCards', JSON.stringify(this.editedCards));
          this.editedCards.card = new Card();
          this.refreshCnEdited();
        } else {
          handleExistingCard();
        }
      }
    }
  }

  cancelAddNewCard() {
    this.editedCards.displayAddNewCard = !this.editedCards.displayAddNewCard;
    this.editedCards.card = new Card();
  }

  exportNewCards() {
    if (confirm('確定要匯出新增的卡片嗎？將會刪除暫存')) {
      const tempCards = this.cards.map(({ cn, en, sentences }) => ({ cn, en, sentences }));
      console.log(JSON.stringify(tempCards)); // 不能移除，方便重新增加 json
      localStorage.removeItem('editedCards');
      this.editedCards.date = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss');
      this.editedCards.cards = '';
      this.updateLog(true);
    }
  }
}

export enum DisplayMode {
  Answer = '答題',
  Questions = '看答案',
}

export class Familiarity {
  total: number = 0;
  notReviewed: number = 0;
  unfamiliar: number = 0;
  veryUnfamiliar: number = 0;
  familiar: number = 0;
  veryFamiliar: number = 0;
  twentyMinutes: number = 0;
  oneHour: number = 0;
  oneDay: number = 0;
  sevenDays: number = 0;
  oneMonth: number = 0;
}

export class Config {
  dayScore: number | undefined = 500;
  questionsScore: number = 10;
  drawMode: string = 'completelyRandom';
  autoDrawSeconds: number = 45;
  speakSelectVoice: string = 'Google UK English Male';
  autoUpdateLog: boolean = false;
  seeAnswerSpeak: boolean = false;
  speakRate: number = 1;
  debugDisplay: boolean = false;
  answerCountToday: number = 0;
}

export class Card {
  cn: Array<string> = [''];
  displayAnswer: boolean = false;
  en: string = '';
  score: number = 0;
  sentencesLength: number = 0;
  updateTime: ElapsedTime = new ElapsedTime();
  sentences: Array<any> = [{ en: '', cn: '' }];
}

export class ElapsedTime {
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
}

export class FirebaseAuth {
  email: string = '';
  password: string = '';
  isEnterRegistPage: boolean = false;
}