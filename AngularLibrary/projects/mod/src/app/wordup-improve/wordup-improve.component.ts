import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild, isDevMode } from '@angular/core';
import {
  Subscriber,
  Subscription,
  catchError,
  combineLatest,
  debounce,
  delay,
  filter,
  map,
  of,
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

@Component({
  selector: 'mod-wordup-improve',
  templateUrl: './wordup-improve.component.html',
  styleUrls: ['./wordup-improve.component.scss'],
})
export class WordupImproveComponent {
  url = './assets/enHelper/scoreData.json';
  cards: any = [];
  sentence: any;
  sentenceAnswerDisplay: any = true;
  DisplayMode = DisplayMode;
  displayMode = DisplayMode.Questions;
  answerScore: any = [];
  chart: any;
  theme = Theme;
  config: Config = {} as Config;
  allWords: any;
  REGEXP_TYPE = REGEXP_TYPE;

  constructor(
    private httpClient: HttpClient,
    public themeService: ThemeService,
    private glgorithmsService: GlgorithmsService,
    private serviceWorkerService: ServiceWorkerService,
  ) {
    this.httpClient
      .get(this.url)
      .pipe(
        tap((res: any) => {
          // this.cards = res.sort(
          //   (a: any, b: any) => b?.sentences?.length - a?.sentences?.length
          // );
          this.cards = res;
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

    if (!isDevMode()) {
      this.autoUpdateLog();
    }
  }

  ngOnDestroy() {
    this.logsSub$.unsubscribe();
    this.debounceSub$.unsubscribe();
    if (this.automaticDrawCardTimer) {
      clearInterval(this.automaticDrawCardTimer);
      this.timerId = null;
    }
  }

  ngAfterViewInit() {
    this.serviceWorkerService.judgmentUpdate();
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

          card.score = findAnswer?.score ?? 1;
          card.updateTime = this.calculateTime(findAnswer?.updateTime ?? undefined);
          // let days = card?.updateTime?.days ?? 0;
          // let ebinghausForgetRateScore = this.ebinghausForgetRate(days);
          // let complexScore = card.score / ebinghausForgetRateScore;
          // card.complexScore = Number.isNaN(complexScore) ? 1 : complexScore;
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
      const thresholdScore = Math.floor(Math.random() * totalScore);
      this.debug.thresholdScore = thresholdScore;
      this.record.finalScoreRecord.push(thresholdScore);
      let drawCount = 0;
      let isLocked = true;

      while (isLocked) {

        let drawNumber = 0;
        let answerInfo;

        if (this.config.drawMode === 'errorFirst') {
          drawNumber = 0;
        } else {
          drawNumber = this.getRandomNum(this.cards?.length - 1);
          let preCumulativeScore = cumulativeScore;

          // 例句數量權重
          let exSentsScore, ansScore, timeDiffeScore, recordAvgScore, noAnsRandomScore;
          exSentsScore = Math.floor(this.cards[drawNumber]?.sentences?.length / 50);
          cumulativeScore += exSentsScore;
          // 答題權重
          answerInfo = this.answerScore.find((res: any) => res.en === this.cards[drawNumber].en);
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

    } catch (err) {
      alert(err);
    }
  }

  // 艾賓浩斯遺忘曲線
  ebinghausForgetRate(t: number) {
    const a = 1.25; // 初始下降率
    const b = 0.1; // 下降速度
    return Math.exp(-a * Math.pow(t, b));
  }

  seeAnswer() {
    this.displayMode = DisplayMode.Answer;
    this.sentenceAnswerDisplay = true;

    let word = this.answerScore.find((word: any) => word.en == this.card.en);
    this.notFamiliarScore = this.notFamiliarScoreCalculations(word);
    this.familiarScore = this.mapScore(this.seconds);

    if (this.config.seeAnswerSpeak) {
      this.debounceBeSub$?.next([this.speak, this.sentence?.en]);
    }

    // 避免不熟榜 lag
    this.displayUnfamiliar = false;
  }

  unfamiliarSorting(a: any, b: any) {

    // 20分鐘後，42%被遺忘掉，58%被記住。
    // 1小時後，56%被遺忘掉，44%被記住。
    // 1天後，74%被遺忘掉，26%被記住。
    // 1周後，77%被遺忘掉，23%被記住。
    // 1個月後，79%被遺忘掉，21%被記住。

    if (a?.score > 0) {
      return a?.score - b?.score;
    } else {
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
    }

    // if (a?.complexScore === b?.complexScore) {
    //   if (a?.score !== b?.score) {
    //     if (b?.updateTime?.day === a?.updateTime?.day) {
    //       if (b?.updateTime?.hours === a?.updateTime?.hours) {
    //         return b?.updateTime?.minutes - a?.updateTime?.minutes;
    //       } else {
    //         return b?.updateTime?.hours - a?.updateTime?.hours;
    //       }
    //     } else {
    //       return b?.updateTime?.day - a?.updateTime?.day;
    //     }
    //   } else {
    //     return a?.score - b?.score;
    //   }
    // } else {
    //   return a?.complexScore - b?.complexScore;
    // }

    // if (a?.score === b?.score) {
    //   if (b?.updateTime?.day === a?.updateTime?.day) {
    //     if (b?.updateTime?.hours === a?.updateTime?.hours) {
    //       return b?.updateTime?.minutes - a?.updateTime?.minutes;
    //     } else {
    //       return b?.updateTime?.hours - a?.updateTime?.hours;
    //     }
    //   } else {
    //     return b?.updateTime?.day - a?.updateTime?.day;
    //   }
    // } else {
    //   return a?.score - b?.score;
    // }
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

    // 避免不熟榜 lag
    this.displayUnfamiliar = false;

    this.debounceBeSub$?.next([this.speak, this.card.en]);

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
      let trueScore = 11 - this.mapScore(this.seconds, 200, 1, 10);
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
    if (!word) {
      falseScore = -50;
    } else if (familiarDays > 0 && familiarDays <= 7) {
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
      let notfind = this.cards.length - this.answerScore.length;
      this.familiarity.notReviewed = zero + notfind;
      // 超不熟悉 -5
      this.familiarity.veryUnfamiliar = this.answerScore.filter(
        (res: any) => res.score <= -50
      ).length;
      // 不熟悉 -
      this.familiarity.unfamiliar = this.answerScore.filter(
        (res: any) => res.score < 0 && res.score > -50
      ).length;
      // 熟悉 +
      this.familiarity.familiar = this.answerScore.filter(
        (res: any) => res.score > 0 && res.score < 25
      ).length;
      // 超熟悉 +5
      this.familiarity.veryFamiliar = this.answerScore.filter(
        (res: any) => res.score >= 50
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
        autoUpdateLog: false,
        seeAnswerSpeak: false,
        speakRate: 1,
      });

    if (!this.config.drawMode) {
      localStorage.removeItem('drawCardConfig');
      this.config = {
        dayScore: 500,
        questionsScore: 10,
        drawMode: 'completelyRandom',
        autoDrawSeconds: 45,
        speakSelectVoice: 'Google UK English Male',
        autoUpdateLog: false,
        seeAnswerSpeak: false,
        speakRate: 1,
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

  logsSub$!: Subscription;

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.user$ = authState(this.auth);
      this.refleshUser();
      // this.refleshLogs();
    } catch (err) {
      alert(err);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      if (this.logsSub$) {
        this.logsSub$.unsubscribe();
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
      // this.refleshLogs();
    } catch (err) {
      alert(err);
    }
  }

  enterRegistPage() {
    this.refleshUser();
    if (isDevMode()) {
      this.refleshLogs();
    }
    this.isEnterRegistPage = true;
  }

  refleshLogs() {
    this.logsCollection = collection(this.firestore, 'Logs');
    this.logs$ = collectionData(this.logsCollection);
    this.logsSub$ = this.logs$
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
        // this.refleshLogs();
        alert('更新成功');
        this.isEnterRegistPage = false;
      }
    }
  }

  downloadLog() {
    if (isDevMode()) {
      this.refleshLogs();
    }
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

  tempFamiliarity: any = {};
  autoUpdateLog() {
    this.user$.pipe(
      take(1),
      filter(user => !!user),
      switchMap(user => {
        let logs$ = collectionData(collection(this.firestore, 'Logs'));
        return logs$.pipe(
          take(1),
          filter(logs => logs.length > 0),
          tap(logs => {
            this.tempFamiliarity = {};
            const log: any = logs.find((log: any) => log.email === user?.email);
            const tempAnswerScore = JSON.parse(JSON.stringify(log.answerScore));
            // 未複習到 0 / undefined
            const zero = tempAnswerScore.filter((res: any) => res.score === 0).length;
            const notfind = this.cards.length - tempAnswerScore.length;
            this.tempFamiliarity.notReviewed = zero + notfind;
            // 超不熟悉 -5
            this.tempFamiliarity.veryUnfamiliar = tempAnswerScore.filter(
              (res: any) => res.score <= -50
            ).length;
            // 不熟悉 -
            this.tempFamiliarity.unfamiliar = tempAnswerScore.filter(
              (res: any) => res.score < 0 && res.score > -50
            ).length;
            // 熟悉 +
            this.tempFamiliarity.familiar = tempAnswerScore.filter(
              (res: any) => res.score > 0 && res.score < 25
            ).length;
            // 超熟悉 +5
            this.tempFamiliarity.veryFamiliar = tempAnswerScore.filter(
              (res: any) => res.score >= 50
            ).length;

            if (this.tempFamiliarity.notReviewed < this.familiarity.notReviewed) {
              this.answerScore = JSON.parse(JSON.stringify(log.answerScore));
              localStorage.setItem('answerScore', JSON.stringify(this.answerScore));
              this.calculateFamiliarity();
              this.unfamiliarReflash();
              alert('自動同步遠端狀態(下載)');
            } else if (this.tempFamiliarity.notReviewed > this.familiarity.notReviewed) {
              if (this.config?.autoUpdateLog) {
                this.logsCollection = collection(this.firestore, 'Logs');
                setDoc(doc(this.logsCollection, user?.uid), {
                  email: user?.email,
                  answerScore: this.answerScore,
                }).then(() => alert('自動同步遠端狀態(上傳)'));
              }
            }
          }),
          take(1),
        );
      }),
      take(1),
    ).subscribe();
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
      this.timerId = null;
      this.seconds = 0;
    }
    const self = this; // 儲存組件的參考
    this.timerId = setInterval(function () {
      self.seconds++;
      // 每 5 秒檢查得分數
      if (self.seconds % 5 === 0) {
        self.familiarScore = self.mapScore(self.seconds, 200, 1, 10);
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

export class Config {
  dayScore: number = 500;
  questionsScore: number = 10;
  drawMode: string = 'completelyRandom';
  autoDrawSeconds: number = 45;
  speakSelectVoice: string = 'Google UK English Male';
  autoUpdateLog: boolean = false;
  seeAnswerSpeak: boolean = false;
  speakRate: number = 1;
}