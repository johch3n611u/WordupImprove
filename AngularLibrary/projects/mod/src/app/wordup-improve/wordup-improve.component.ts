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

  config: Config = new Config();
  /**
  * 初始化設定檔
  */
  configInit(): void {
    let drawCardConfig: any = localStorage.getItem('drawCardConfig');
    if (drawCardConfig) {
      this.config = JSON.parse(drawCardConfig)
      if (!this.config.keyboardControl) {
        this.config.keyboardControl = {};
        this.config.keyboardControl.seeAnswer = 'a';
        this.config.keyboardControl.answerScoreResetTrue = 's';
        this.config.keyboardControl.answerScoreResetFalse = 'd';
        this.config.keyboardControl.drawSentence = 'f';
        this.config.keyboardControl.showExanpleAnswers = 'g';
        this.config.keyboardControl.speakMsgWord = 'q';
        this.config.keyboardControl.speakMsgSentence = 'w';
        this.importConfig(true);
      }
    }

    this.lastUpdateLogTime = localStorage.getItem('lastUpdateLogTime') ?? '';
    this.lastdownloadLogTime = localStorage.getItem('lastdownloadLogTime') ?? '';
  }

  /**
  * 更改設定檔
  */
  importConfig(direct: boolean = false): void {
    if (direct || confirm('確定要更改設定檔嗎？')) {
      localStorage.setItem('drawCardConfig', JSON.stringify(this.config));
      direct ?? this.drawCard();
      this.debugDisplay = false;
    }
  }

  /**
  * 計算當日累積答題數
  * @param wordEn 單字
  */
  calculateAnswerCountToday(wordEn: string): void {
    !this.config.answerCountAll ?? (this.config.answerCountAll = 0);
    const todayTimstamp = this.config?.answerCountToday?.timestamp;
    const today = this.calculateTime(todayTimstamp, true);
    if (today.days > 1 || !todayTimstamp) {
      this.config.answerCountToday = { timestamp: Date.now(), count: 1, words: [wordEn] };
    } else {
      if (!this.config.answerCountToday.words?.includes(wordEn)) {
        this.config.answerCountToday.count++;
        this.config.answerCountToday.words ?? (this.config.answerCountToday.words = []);
        this.config.answerCountToday.words.push(wordEn);
        this.config.answerCountAll++;
      }
    }

    this.importConfig(true);
  }

  automaticDrawCardTimer: any;
  /**
  * 控制自動抽卡功能的開始和結束
  */
  automaticDrawCard(): void {
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

  record: any = {
    drawCountRecord: [],
    drawCountRecordDisplay: undefined, // 繪製計數的平均數
    finalScoreRecord: [],
    finalScoreRecordDisplay: undefined, // 最終分數的平均數
    avgAnswerSpeed: [],
    avgAnswerSpeedDisplay: undefined, // 平均回答速度的平均數
  };
  /**
  * 計算並更新記錄的平均值
  */
  recordCalculate(): void {
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

  url = './assets/enHelper/scoreData.json';
  cards: Array<Card> = [];
  answerScore: any = [];
  /**
  * 初始化卡片資料
  */
  initCards(): void {
    this.httpClient
      .get(this.url)
      .pipe(
        tap((res: any) => {
          this.cards = res;
          this.answerScore = JSON.parse(
            localStorage.getItem('answerScore') ?? '[]'
          );
          this.calculateAverageNegativeScore();
          this.cardslinkScore();
          this.configInit();
          this.editedCardsInit();
        })
      )
      .subscribe((res: any) => {
        this.drawCard();
      });
  }

  answerScoreAverage = 0;
  maxNegativeScore = 0;
  /**
  * 計算平均負分
  */
  calculateAverageNegativeScore(): void {
    // const negativeScores = this.answerScore?.filter((item: any) => item.score < 0);
    // this.maxNegativeScore = Math.min(...negativeScores.map((item: any) => item.score));
    // const sum = negativeScores?.reduce((total: number, item: any) => total + item.score, 0);
    // this.answerScoreAverage = Math.floor(sum / negativeScores?.length);

    const negativeScores = this.answerScore?.filter((item: any) => item.score < 0);
    if (negativeScores.length > 0) {
      const sum = negativeScores.reduce((total: number, item: any) => total + item.score, 0);
      this.answerScoreAverage = Math.floor(sum / negativeScores.length);
      this.maxNegativeScore = Math.min(...negativeScores.map((item: any) => item.score));
    }
  }

  /**
  * 將卡片資料與分數資料關聯，cards 資料太大包，是固定 json 檔案，搭配 firebase 上記錄分數的檔案
  */
  cardslinkScore(): void {
    this.cards.forEach((card: Card) => {
      let findAnswer = this.answerScore?.find(
        (word: any) => word?.en.toLowerCase() === card?.en.toLowerCase()
      );
      card.score = findAnswer?.score ?? 0;
      card.updateTime = this.calculateTime(findAnswer?.updateTime);
    });
  }

  debug: any;
  card: Card = new Card();
  /** 
  * 根據邏輯抽取卡片資料
  */
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
      let answerInfo = this.answerScore.find((res: any) => res.en.toLowerCase() === this.cards[drawNumber].en.toLowerCase());

      if (this.config.drawMode !== 'errorFirst') {
        drawNumber = this.glgorithmsService.getRandomNum(this.cards?.length - 1);
        answerInfo = this.answerScore.find((res: any) => res.en.toLowerCase() === this.cards[drawNumber].en.toLowerCase());
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
          en: this.cards[drawNumber]?.en.toLowerCase(),
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
        (thresholdScore <= cumulativeScore && this.cards[drawNumber]?.en.toLowerCase() !== this.card?.en.toLowerCase()) || this.config.drawMode === 'errorFirst'
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
    let speakWords = this.config.seeAnswerSpeak ? this.sentence.en : this.card.en;
    this.debounceBeSub$?.next([this.speak, speakWords]);

    this.findSameWords();
  }

  /**
  * 依邏輯排列卡片
  * @param a 單字 A
  * @param b 單字 B
  * @returns 排序方式
  */
  unfamiliarSorting(a: any, b: any): number {
    if (a?.score > 0 || b?.score > 0) {
      return a?.score - b?.score;
    } else {

      let tempSortA = a?.score - a.sentences?.length - a?.updateTime?.days - a?.updateTime?.hours - a?.updateTime?.minutes;
      let tempSortB = b?.score - b.sentences?.length - b?.updateTime?.days - b?.updateTime?.hours - b?.updateTime?.minutes;
      return tempSortA - tempSortB;

      let aH = a?.updateTime?.days == 0 && a?.updateTime?.hours >= (this.config?.unfamiliarSortingHours ?? 1);
      let aM = a?.updateTime?.minutes >= (this.config?.unfamiliarSortingMinutes ?? 0);
      let bH = b?.updateTime?.days == 0 && b?.updateTime?.hours >= (this.config?.unfamiliarSortingHours ?? 1);
      let bM = b?.updateTime?.minutes >= (this.config?.unfamiliarSortingMinutes ?? 0);

      if (aH) {
        if (aM) {
          return -1;
        } else {
          return 1;
        }
      } else if (bH) {
        if (bM) {
          return 1;
        } else {
          return -1;
        }
      } else {
        return tempSortA - tempSortB;
      }
    }
  }

  sentence: any;
  sentenceAnswerDisplay: any = true;
  /**
  * 顯示卡片答案
  */
  seeAnswer(): void {
    this.displayMode = DisplayMode.Answer;
    this.sentenceAnswerDisplay = true;

    let word = this.answerScore.find((word: any) => word.en.toLowerCase() == this.card.en.toLowerCase());
    this.notFamiliarScore = this.notFamiliarScoreCalculations(word);
    this.familiarScore = 70 - this.glgorithmsService.mapScore(this.seconds, 120, 1, 50);

    let speakWords = '';
    this.config.seeAnswerSpeak ? speakWords = this.sentence?.en.toLowerCase() : speakWords = this.card.en.toLowerCase();
    this.debounceBeSub$?.next([this.speak, speakWords]);

    // 避免不熟榜 lag
    this.displayUnfamiliar = false;
  }

  /**
  * 顯示卡片例句
  */
  showExanpleAnswers(): void {
    this.sentenceAnswerDisplay = true;
    if (this.config.seeAnswerSpeak) {
      this.debounceBeSub$?.next([this.speak, this.sentence?.en.toLowerCase()]);
    }
  }

  tempSentencesIndex: any = [];
  /**
  * 抽取卡片例句
  */
  drawSentence(): void {
    this.sentenceAnswerDisplay = false;
    this.sentence = undefined;
    let randomNumber;
    if (this.tempSentencesIndex?.length == this.card?.sentences?.length) {
      this.tempSentencesIndex = [];
    }
    while (!this.sentence) {
      randomNumber = this.glgorithmsService.getRandomNum(this.card?.sentences?.length - 1);
      if (this.tempSentencesIndex.indexOf(randomNumber) == -1) {
        if (this.sentence?.en.toLowerCase() != this.card?.sentences[randomNumber]?.en.toLowerCase()) {
          this.sentence = this.card?.sentences[randomNumber];
          this.tempSentencesIndex.push(randomNumber);
        }
      }
    }

    this.searchWord = {};
  }

  /** 
  * 回答並更新卡片熟悉度
  * @param answer 熟悉 / 不熟悉
  */
  answerScoreReset(answer: boolean): void {
    // 避免不熟榜 lag
    this.displayUnfamiliar = false;

    this.debounceBeSub$?.next([this.speak, this.card.en.toLowerCase()]);

    this.record.avgAnswerSpeed.push(this.seconds);

    let word = this.answerScore.find((w: any) => w.en.toLowerCase() == this.card.en.toLowerCase());

    // 回答的越快增加越多分，越慢扣越多
    if (word) {
      // 30 內天類依比例扣分 7-15 天扣最低，7 天內與 15 至其餘天數 & 一天以內直接扣最大分
      // 看答案時計算 notFamiliarScore 顯示後再拿來此處使用

      if (answer) {
        word.score += this.familiarScore;
      } else {
        word.score += this.notFamiliarScore;
        if (word.score < this.maxNegativeScore || this.card.updateTime.days > 50) {
          word.score = this.maxNegativeScore;
        }
      }

      word.updateTime = Date.now();
    } else {
      // 第一次錯直接扣最大分
      let newWord = answer ? this.familiarScore : (this.maxNegativeScore ?? -50);
      this.answerScore.push({
        en: this.card.en.toLowerCase(),
        score: newWord,
        updateTime: Date.now(),
      });
    }

    localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
    this.calculateAnswerCountToday(word?.en);
    this.calculateAverageNegativeScore();
    this.drawCard();
  }

  familiarScore = 1;
  notFamiliarScore = 0;
  /** 
  * 不熟悉扣分邏輯
  * @param word 單字
  * @returns 扣分分數
  */
  notFamiliarScoreCalculations(word: any): number {
    // 30 內天類依比例扣分 7-15 天扣最低，7 天內與 15 至其餘天數 & 一天以內直接扣最大分
    const falseScoreTime = this.calculateTime(word?.updateTime);
    let falseScore;

    if (!word) {
      falseScore = this.maxNegativeScore ?? -50;
    } else {
      const day = Math.min(falseScoreTime?.days ?? 0, 50);
      falseScore = (this.glgorithmsService.mapScore(day, 50, 20, this.maxNegativeScore * -1)) * -1;
    }

    return falseScore;
  }

  familiarity: Familiarity = new Familiarity();
  /**
  * 計算卡片的熟悉度和記憶曲線
  */
  calculateFamiliarity(): void {
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
  /**
  * 依照熟悉度繪製圖表
  */
  // drawChat() {
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
  // }

  /**
  * 瀏覽器大小改變時重新繪製圖表 @HostListener('window:resize', ['$event'])
  * @param event 瀏覽器大小改變時觸發事件
  */
  onResize(event: Event): void {
    // this.drawChat();
  }

  keyboardControl = false;
  /**
  * 監聽鍵盤按下
  * @param event 鍵盤按下事件
  */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.keyboardControl) {
      let eveKey = event.key.toLowerCase();
      if (eveKey === this.config?.keyboardControl?.seeAnswer?.toLowerCase()) {
        this.seeAnswer();
      }
      if (eveKey === this.config?.keyboardControl?.answerScoreResetTrue?.toLowerCase()) {
        this.answerScoreReset(true);
      }
      if (eveKey === this.config?.keyboardControl?.answerScoreResetFalse?.toLowerCase()) {
        this.answerScoreReset(false);
      }
      if (eveKey === this.config?.keyboardControl?.drawSentence?.toLowerCase()) {
        this.drawSentence();
      }
      if (eveKey === this.config?.keyboardControl?.showExanpleAnswers?.toLowerCase()) {
        this.showExanpleAnswers();
      }
      if (eveKey === this.config?.keyboardControl?.speakMsgWord?.toLowerCase()) {
        this.speakMsg(this.card.en);
      }
      if (eveKey === this.config?.keyboardControl?.speakMsgSentence?.toLowerCase()) {
        this.speakMsg(this.sentence?.en);
      }
    }
  }


  /**
  * 刪除本地分數紀錄
  */
  resetAnswerScore(): void {
    if (confirm('確定要刪除分數紀錄嗎？')) {
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
    notFamiliarScore: 0,
  };
  /**
  * 搜尋相似單字並扣除熟悉度分數
  * @ViewChild('searchWordInput') searchWordInput!: ElementRef;
  * https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
  */
  searchWordMark(): void {
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
          el?.en.toLowerCase(),
          this.searchWord.word
        );
        temp.push({
          en: el?.en.toLowerCase(),
          cn: el?.cn,
          searchWord: this.searchWord.word,
          cal: cal,
        });
      });

      let sortTemp = temp.sort((a: any, b: any) => b.cal - a.cal);
      this.searchWord.similarWords = `相似單字：${sortTemp
        .slice(0, 10)
        .map((obj: any) => `[${obj.en.toLowerCase()}]${obj.cn}`)
        .join('，')}`;

      const pattern = new RegExp(`\\b${this.searchWord.word}\\b`, 'gi');
      const searched = this.cards.find((card: any) => card.en.toLowerCase().match(pattern));
      if (searched) {
        let word = this.answerScore.find((word: any) =>
          word.en.toLowerCase().match(pattern)
        );
        if (word) {
          this.searchWord.score = word?.score;
          this.searchWord.notFamiliarScore = this.notFamiliarScoreCalculations(word);
          const time = this.calculateTime(word?.updateTime);
          word.score += this.searchWord.notFamiliarScore > 0 ? this.searchWord.notFamiliarScore * -1 : this.searchWord.notFamiliarScore;
          if (word.score < this.maxNegativeScore - 50) {
            word.score = this.maxNegativeScore;
          }
          this.searchWord.updateTime = time;
          word.updateTime = Date.now();
        } else {
          this.answerScore.push({
            en: this.searchWord.word,
            score: (this.maxNegativeScore ?? -50),
            updateTime: Date.now(),
          });
          this.searchWord.score = (this.maxNegativeScore ?? -50);
          this.searchWord.updateTime = this.calculateTime(undefined);
        }

        localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
        this.searchWord.explain = searched.cn;
        // alert('已扣 5 分'); todo 彈出自動消失匡
        this.calculateFamiliarity();
        this.calculateAverageNegativeScore();
        this.searchWord.display = this.searchWord.word;
        this.searchWord.word = '';
      } else {
        // alert(
        //   `字庫搜尋不到此單字，\n以下為[距離算法]選出字庫前五個相似度高的單字。`
        // ); todo 彈出自動消失匡
        this.searchWord.word = sortTemp[0].en.toLowerCase();
      }

      this.debounceBeSub$?.next([this.speak, this.searchWord.display ?? this.searchWord.word]);
      this.unfamiliarReflash();
    }
    // this.commonService.goToAnchor(this.searchWordInput);
  }

  theme = Theme;
  nowTheme = this.themeService.getTheme();
  /**
  * 設定主題
  */
  setTheme(): void {
    this.nowTheme === this.theme.dark
      ? (this.nowTheme = this.theme.light)
      : (this.nowTheme = this.theme.dark);
    this.themeService.setTheme(this.nowTheme);
  }

  isExportAnswerScore = false;
  answerScoreDisplay: any = [];
  /**
  * 開啟匯入匯出熟悉度輸入框
  */
  clickImExport(): void {
    this.isExportAnswerScore = !this.isExportAnswerScore;
    this.answerScoreDisplay = JSON.stringify([...this.answerScore.sort((a: any, b: any) => a.score - b.score)]);
  }

  /**
  * 更新本地熟悉度分數
  */
  importAnswerScore(): void {
    if (confirm('確定要匯入(紀錄更改後無法返回)？')) {
      this.answerScore = [...JSON.parse(this.answerScoreDisplay)];
      localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
      this.isExportAnswerScore = false;
      this.calculateFamiliarity();
    }
  }

  debugDisplay = false;
  /**
  * 開啟偵錯介面
  */
  clickDebug(): void {
    this.debugDisplay = !this.debugDisplay;
  }

  /**
   * 計算經過時間
   * @param timestamp 時間差戳
   * @returns 時間差
   */
  calculateTime(timestamp: number | undefined, oClock: boolean = false): ElapsedTime {
    if (!timestamp) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const date = new Date();
    const startOfToday = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
    const currentTime = oClock ? startOfToday : Date.now();
    const timeDifference = Math.abs(currentTime - timestamp); // 計算時間差（取絕對值）

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
  /**
   * 不熟悉榜單依照天數負分兼容排列
   */
  unfamiliarReflash(): void {
    this.unfamiliarList = [];
    this.answerScore.forEach((el: any) => {
      let card = this.cards.find((res: any) => res.en.toLowerCase() === el.en.toLowerCase());
      if (card?.en.toLowerCase()) {
        this.unfamiliarList.push({
          en: card?.en.toLowerCase(),
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

  /**
   * 不熟悉榜單依照負分最多排列
   */
  sortByMostNegative(): void {
    this.unfamiliarList.sort((a: any, b: any) => a.score - b.score);
  }

  timerId: any;
  seconds = 0;
  /**
  * 計算回答過程經過時間
  */
  updateTimer(): void {
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
        self.familiarScore = 70 - self.glgorithmsService.mapScore(self.seconds, 120, 1, 50);
      }
    }, 1000);
  }

  /**
  * 不熟悉榜查看答案
  * @param word 單字
  */
  setUnfamiliarDisplayAnswer(word: any): void {
    word.displayAnswer = !word.displayAnswer;
    setTimeout(() => {
      word.displayAnswer = !word.displayAnswer;
    }, 5000);

    this.debounceBeSub$?.next([this.speak, word?.en.toLowerCase()]);
  }

  /**
  * 不熟悉榜答題
  * @param answer 不熟悉 / 熟悉
  * @param word 單字
  */
  answerUnfamiliarScoreReset(answer: boolean, word: string): void {
    let keyWord = this.answerScore.find((w: any) => w.en.toLowerCase() == word.toLowerCase());
    answer ? (keyWord.score += 30) : (keyWord.score -= 30);
    keyWord.updateTime = Date.now();
    localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
    this.calculateFamiliarity();
    this.unfamiliarReflash();
  }

  // https://gist.github.com/Eotones/d67be7262856a79a77abeeccef455ebf
  // https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
  synth = window.speechSynthesis;
  voices: any = [];
  /**
  * 監聽滑鼠並選取單字
  * @param event 滑鼠按下事件
  */
  @HostListener('window:mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  mouseUp(event: MouseEvent): void {
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
  /**
  * 延遲處理訂閱流，防抖 Debounce 節流 Throttle
  */
  debounceHandler(): void {
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
  /**
  * 語音朗讀
  * @param msg 訊息
  */
  speak(msg: string): void {
    if (this.synth && !this.commonService.containsChinese(msg)) {
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
      speechSynthesisUtterance.volume = (this.config?.speakVolume ?? 10) / 10;

      // 念一次降速後念一次增速
      if (this.tempSpeakMsg === msg) {
        speechSynthesisUtterance.rate = 0.5;
      } else {
        speechSynthesisUtterance.rate = this.config?.speakRate ?? 1;
      }

      for (let i = 1; i <= this.config.speakTimes; i++) {
        this.synth?.speak(speechSynthesisUtterance);
        this.tempSpeakMsg = msg;
      }
    }
  }

  /**
  * 開啟朗讀模式
  */
  setSpeakSelection(): void {
    let isReadingMode = this.debounceSub$ && !this.debounceSub$.closed;
    alert(!isReadingMode ? '開啟點擊朗讀模式' : '關閉點擊朗讀模式');
    if (!isReadingMode) {
      this.debounceHandler();
    } else {
      this.debounceSub$.unsubscribe();
    }
  }

  /**
  * 朗讀訊息
  * @param msg 訊息 
  */
  speakMsg(msg: string): void {
    if (!(this.debounceSub$ && !this.debounceSub$.closed)) {
      this.debounceHandler();
    }

    this.debounceBeSub$.next([this.speak, msg]);
  }

  searchChineseObj = { word: '', similarWords: '' };
  /**
  * 搜尋相似中文
  */
  searchChinese(): void {
    if (
      this.searchChineseObj.word !== undefined &&
      this.searchChineseObj.word !== null &&
      this.searchChineseObj.word.replace(/\s*/g, '') !== ''
    ) {
      let temp: any = [];
      this.searchChineseObj.similarWords = '找無';
      this.cards.forEach((el: any) => {
        let cn = el.cn.join(',');
        if (this.searchChineseObj.word.match(new RegExp(el.cn, 'i')) || cn.match(new RegExp(this.searchChineseObj.word, 'i'))) {
          temp.push(`[${el.en.toLowerCase()}]${el.cn}`);
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
  /**
  * 修改單字資料初始化
  */
  editedCardsInit(): void {
    let temp = localStorage.getItem('editedCards');
    if (temp) {
      this.editedCards = JSON.parse(temp);
    }

    this.editedCards.displayAddNewCard = false;
    this.editedCards.card = new Card();
    this.editedCards.notEditMode = true;
    this.refreshCnEdited();
  }

  /**
  * 編輯單字中文
  * @param card 單字
  */
  updateCnEdite(card: any): void {
    this.editedCards.displayUpdateCnEdite = false;
    this.editedCards.notEditMode = true;

    this.editedCards.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
    let tempCard = this.editedCards.cards.find((c: any) => c.en.toLowerCase() === card.en.trim().toLowerCase());
    let tempCard2 = this.cards.find((c: any) => c.en.toLowerCase() === card.en.trim().toLowerCase());

    if (tempCard) {
      tempCard.cn = [card.cn];
    } else {
      let newCard: any = new Card();
      newCard.en = tempCard2?.en.toLowerCase();
      newCard.cn = [card.cn];
      this.editedCards.cards.push(newCard);
    }

    let editedCards = JSON.stringify(this.editedCards);
    localStorage.setItem('editedCards', editedCards);
    this.editedCards.card = new Card();
    this.editedCards.displayUpdateCnEdite = false;
    this.refreshCnEdited();
  }

  /**
  * 修改單字資料同步卡片資料
  */
  refreshCnEdited(): void {
    this.editedCards?.cards?.forEach((editedCard: any) => {
      let tempCard = this.cards.find((card: any) => card.en.toLowerCase() === editedCard.en.toLowerCase());
      if (tempCard) {
        tempCard.cn = editedCard.cn;
      } else {
        this.cards.push(editedCard);
      }
      this.editedCards.displayAddNewCard = false;
    });
  }

  /**
  * 新增單字
  */
  addNewCard(): void {
    const { en, cn, sentences } = this.editedCards.card;
    const trimmedEn = en.trim().toLowerCase();

    if (trimmedEn.replace(/\s*/g, '') !== '' && confirm('確認新增卡片?')) {
      const tempCard = this.cards.find((card: any) => card.en.toLowerCase() === trimmedEn);

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

        if (!sentences[0]?.en || !sentences[0]?.cn) {
          alert('請確定更新或新增欄位')
        } else if (!tempCard) {
          this.editedCards.cards.push(this.editedCards.card);
          this.editedCards.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
          localStorage.setItem('editedCards', JSON.stringify(this.editedCards));
          this.editedCards.card = new Card();
          this.refreshCnEdited();
        } else {
          handleExistingCard();
        }
      }
    }
  }

  /**
  * 關閉新增單字介面
  */
  cancelAddNewCard(): void {
    this.editedCards.displayUpdateCnEdite = false;
    this.editedCards.displayAddNewCard = false;
    this.editedCards.card = new Card();
  }

  /**
  * 匯出修改過的卡片並更新紀錄
  */
  exportNewCards(): void {
    if (confirm('確定要匯出新增的卡片嗎？將會刪除暫存')) {
      const seenWords = new Set();
      let securityKey = true;
      let repeatCards: any = [];
      const tempCards = this.cards.map(({ cn, en, sentences }) => {
        if (!seenWords.has(en)) {
          seenWords.add(en);

          let newCn = Array.from(new Set(cn.join(",")
            .replace(/，|；|;/g, ",")
            .replace(/v:|n:|adj:|adv:|a:|aux:|ad:|prep:|conj:/g, "")
            .trim()
            .split(",")));

          return { cn: newCn, en: en.toLowerCase(), sentences };
        } else {
          console.log('重複卡片', { cn, en, sentences: sentences });
          repeatCards.push({ cn, en, sentences: sentences });
          securityKey = false;
          return null;
        }
      }).filter(Boolean);

      if (securityKey || confirm('有重複未加入卡片是否重置上傳？')) {
        localStorage.removeItem('editedCards');
        this.editedCards.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
        this.editedCards.cards = '';
        this.updateLog(true);
      } else {
        repeatCards.forEach((repeatCard: any) => {
          console.log('重複未加入的卡片', this.cards.find(c => c.en === repeatCard.en));
        });
      }

      console.log(JSON.stringify(tempCards)); // 不能移除，方便重新增加 json
    }
  }

  findSameWordsObj: any = {
    cn: [],
    en: []
  };
  findSameWords(): any {

    this.findSameWordsObj.cn = [];
    this.findSameWordsObj.en = [];

    this.cards.forEach((el: any) => {
      // CN
      let cn = this.card.cn.join(',');
      let cn2 = el.cn.join(',');
      let calCn = this.glgorithmsService.calculateSimilarity(
        cn,
        cn2
      );
      this.findSameWordsObj.cn.push({
        en: el?.en.toLowerCase(),
        cn: el?.cn,
        cal: calCn,
      });
      // EN
      let calEn = this.glgorithmsService.calculateSimilarity(
        el?.en.toLowerCase(),
        this.card.en
      );
      this.findSameWordsObj.en.push({
        en: el?.en.toLowerCase(),
        cn: el?.cn,
        cal: calEn,
      });
    });

    this.findSameWordsObj.cn = this.findSameWordsObj.cn
      .sort((a: any, b: any) => b.cal - a.cal)
      .filter((c: any) => c.en.toLowerCase() !== this.card.en.toLowerCase())
      .slice(0, 10);
    this.findSameWordsObj.en = this.findSameWordsObj.en
      .sort((a: any, b: any) => b.cal - a.cal)
      .filter((c: any) => c.en.toLowerCase() !== this.card.en.toLowerCase())
      .slice(0, 10);
  }

  openBlankUrl(url: string) {
    if (
      this.searchWord.word !== undefined &&
      this.searchWord.word !== null &&
      this.searchWord.word.replace(/\s*/g, '') !== ''
    ) {
      window.open(`${url}${this.searchWord.word}`, '_blank')
    }
  }

  /**
  * Firebase Auth & CRUD
  * https://console.firebase.google.com/u/0/project/angular-vector-249608/firestore/data/~2FLogs~2FBIjfl9Y432Rtt3lwZJx0klt0j8M2
  * https://github.com/angular/angularfire/blob/master/docs/firestore.md#cloud-firestore
  * https://www.positronx.io/full-angular-firebase-authentication-system/
  */
  firebaseAuth: FirebaseAuth = new FirebaseAuth();
  combineUserAndLogs$!: Subscription;
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  logsCollection!: CollectionReference<DocumentData, DocumentData>;
  lastUpdateLogTime: string = '';
  lastdownloadLogTime: string = '';

  async login(): Promise<void> {
    await signInWithEmailAndPassword(this.auth, this.firebaseAuth.email, this.firebaseAuth.password);
    this.user$ = authState(this.auth);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    if (this.combineUserAndLogs$) {
      this.combineUserAndLogs$.unsubscribe();
    }
    alert('登出成功');
  }

  async signUp(): Promise<void> {
    await createUserWithEmailAndPassword(
      this.auth,
      this.firebaseAuth.email,
      this.firebaseAuth.password
    );
  }

  enterRegistPage(): void {
    // if (isDevMode()) {
    //   this.autoUpdateLog();
    // }
    this.firebaseAuth.isEnterRegistPage = true;
  }

  async updateLog(direct: boolean = false): Promise<void> {
    if (direct || confirm('確定要更新雲端紀錄嗎？(此動作不可逆)')) {
      user(this.auth).pipe(
        take(1),
        tap(async (user) => {
          if (user) {
            localStorage.setItem('lastUpdateLogTime', this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss') ?? '');

            this.logsCollection = collection(this.firestore, 'Logs');
            const editedCardsString = JSON.stringify(this.editedCards?.cards);
            await setDoc(doc(this.logsCollection, user.uid), {
              email: user.email,
              answerScore: this.answerScore,
              editedCards: editedCardsString,
              editedCardsDate: this.editedCards?.date,
            });
            alert('更新成功');
            this.refreshCnEdited();
            this.firebaseAuth.isEnterRegistPage = false;
          }
        }),
        take(1),
      ).subscribe();
    }
  }

  downloadLog(direct: boolean = false): void {
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
            this.editedCards.cards = tempEditedCards || [];
            this.editedCards.card = new Card();
            this.editedCards.date = log.editedCardsDate;
            localStorage.setItem('editedCards', JSON.stringify(this.editedCards));
            localStorage.setItem('lastdownloadLogTime', this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss') ?? '');

            this.calculateFamiliarity();
            this.unfamiliarReflash();
            alert('更新成功');
            this.refreshCnEdited();
            this.firebaseAuth.isEnterRegistPage = false;
            this.cardslinkScore();
            this.drawCard();
          } else {
            alert('未找到紀錄');
          }
        }),
        take(1),
      ).subscribe();
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
  speakVolume: number = 10;
  speakTimes: number = 3;
  autoUpdateLog: boolean = false;
  seeAnswerSpeak: boolean = false;
  speakRate: number = 1;
  debugDisplay: boolean = false;
  answerCountToday: any = { timestamp: Date.now(), count: 0, words: [] };
  answerCountAll: number = 0;
  unfamiliarSortingHours = 1;
  unfamiliarSortingMinutes = 0;
  keyboardControl: any = {
    seeAnswer: 'a',
    answerScoreResetTrue: 's',
    answerScoreResetFalse: 'd',
    drawSentence: 'f',
    showExanpleAnswers: 'g',
    speakMsgWord: 'q',
    speakMsgSentence: 'w',
  }
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
  days: number = 0; hours: number = 0; minutes: number = 0;
}

export class FirebaseAuth {
  email: string = ''; password: string = ''; isEnterRegistPage: boolean = false;
}