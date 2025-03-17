# WordupImprove

<img align="left" src="https://github.com/johch3n611u/WordupImprove/blob/master/assets/257544.jpg?raw=true" width="50%">

Frustrated by the need for efficient vocabulary learning, I found an existing app riddled with issues and painfully slow in both bug fixes and feature development—seemingly more focused on selling courses than improving functionality. As an engineer, I decided to take matters into my own hands by purchasing vocabulary datasets, scraping the data, and customizing it to fit my needs.

The architecture follows the AG Multi-Project approach, a familiar structure for me, with implementation details available in the [UrWebApp/ComponentLibrary](https://github.com/UrWebApp/ComponentLibrary) repository.

Since the primary goal is vocabulary retention, I extracted only the necessary library for shared code while prioritizing development speed for other components, ensuring the most efficient coding workflow. ([Codes](https://github.com/UrWebApp/ComponentLibrary/blob/master/AngularLibrary/projects/mod/src/app/wordup-improve/wordup-improve.component.ts))

<br><br><br>

## Video

[![Video](https://github.com/johch3n611u/WordupImprove/blob/master/assets/6.png?raw=true)](https://www.youtube.com/watch?v=Uf0c-erquEg&ab_channel=yochenLiu)

## Feature

|Feature||
|-|-|
|1. 註冊登入（同步）	Account Registration & Sync|Uses Firebase for account management, tracks vocabulary learning progress, syncs across PC & Mobile, supports PWA offline mode, and allows manual upload/download to save data usage.|
|2. 可控制的抽卡邏輯	Customizable Flashcard Logic|Offers multiple study modes: Mistake Priority (familiarity-based & forgetting curve), Random Selection, and New Words First to match learning needs.|
|3. 卡片熟悉度機制	Adaptive Learning System|Adjusts familiarity level based on response speed: Fast response → Fewer reinforcement cycles, Slow or incorrect response → Increased repetition.|
|4. 例句背誦單字	Contextual Sentence-Based Learning|Displays vocabulary with example sentences to enhance understanding and application.|
|5. 自動朗誦選取單字	Automated Word Pronunciation|Reads aloud selected words/sentences with adjustable accent, speed, and volume, using debounce & throttle to optimize pronunciation repetition.|
|6. 專心鍵盤快捷模式	Keyboard Shortcut Mode|Enables quick navigation using keyboard shortcuts for flipping cards, answering, and playback, minimizing mouse usage.|
|7. 額外單字扣分	Penalty for Unfamiliar Words|Deduct points for unrecognized words within sentences to reinforce learning.|
|8. 不熟悉榜單	Difficult Words List|Automatically tracks frequently missed words, generating a high-priority study list for targeted learning.|
|9. 激勵與檢討數據分析顯示	Performance Analytics & Progress Tracking|Displays: Daily quiz attempts, Average score & response time, Mistake rate, Last review date for each word.|
|10. 本地設定檔案	Local Settings Configuration|Allows customization of learning mode, UI themes, volume, and speech settings.|
|11. 黑白護眼主題	Eye-Friendly Themes|Provides Dark Mode and Low Blue Light Mode to reduce eye strain during long study sessions.|
|12. 自動抽卡刷題	Automated Flashcard Practice|Dynamically selects words from the database based on progress & familiarity weight.|
|13. 客製化新增單字與句子	Custom Word & Sentence Addition|Allows users to add personalized words and example sentences for a more tailored study experience.|
|14. 同義詞與反義詞學習	Synonyms & Antonyms Learning|Displays common synonyms & antonyms on vocabulary cards to expand word knowledge.|
|🔹 15. 劍橋字典直連	Cambridge Dictionary Integration|One-click access to detailed definitions, pronunciations, and usage examples.|
|🔹 16. OpenAI 軟串接 prompt	OpenAI Prompt Integration|Uses AI to generate example sentences, part-of-speech analysis, and contextual usage.|
|🔹 17. Google 圖片幫助記憶	Google Images for Memory Aid|Uses Google Image Search API to provide visual representations of words for visual learners.|

<!-- 1. 註冊登入（同步） - 使用 Firebase 進行帳號管理，記錄單字學習進度，可在不同裝置 PC / Mobile 間同步，並支援 PWA 離線學習，透過手動上傳/下載減少流量消耗。
2. 可控制的抽卡邏輯 - 提供 錯誤優先（透過回答熟悉度、遺忘曲線記憶計算）、完全隨機、完全陌生 等抽卡模式，確保學習符合個人需求。
3. 卡片熟悉度機制 - 根據回答速度決定熟悉度變化，回答快則減少記憶強化次數，回答慢或錯誤則增加重複次數，自動調整學習頻率。
4. 例句背誦單字 - 使用「語境記憶」，單字搭配例句展示，加強理解並提高單字運用能力。
5. 自動朗誦選取單字 - 啟用朗誦模式後，自動播放選取的單字或例句，可調整 口音、語速、音量，透過防抖（Debounce）與節流（Throttle）處理，判斷唸出的句子如果重複則降低語速幫助記憶。
6. 專心鍵盤快捷模式 - 讓高效學習者透過「鍵盤快捷鍵」快速翻卡、回答、朗讀，減少滑鼠操作，提高答題效率。
7. 額外單字扣分 - 對例句內不會的單字進行扣分，增加背誦效率。
8. 不熟悉榜單 - 自動統計使用者「最常答錯的單字」，形成一個「高優先學習清單」，幫助針對性強化記憶。
9. 激勵與檢討數據分析顯示 - 提供當日答題數、平均得分、平均回答速度、錯誤率、單字上次回答時間等數據，幫助使用者評估學習進度。
10. 本地設定檔案 - 讓使用者可以自訂學習模式、UI 風格、音量與語音設置、朗誦模式等，確保最佳學習體驗。
11. 黑白護眼主題 - 提供「黑暗模式」與「低藍光模式」，減少長時間學習對眼睛的負擔。
12. 自動抽卡刷題 - 自動從單字庫中隨機選取題目，根據學習進度與設定的熟悉度權重，智能安排學習順序。
13. 客製化新增單字與句子 - 允許使用者自行新增單字與例句，建立個人專屬的單字庫，提高學習靈活度。
14. 同義詞與反義詞學習 - 在單字卡片或學習模式中，顯示該單字的常見 同義詞（Synonyms） 與 反義詞（Antonyms），幫助使用者擴展詞彙量。

🔹 15. 劍橋字典直連 - 提供單字的「一鍵查詢」功能，直接連接劍橋字典，獲取詳細解釋、發音與用法範例。 <br>
🔹 16. OpenAI 軟串接 prompt - 透過 AI 生成例句、詞性分析，幫助理解單字的更多應用方式。 <br>
🔹 17. Google 圖片幫助記憶 - 使用 Google 圖片 API 自動搜尋單字相關圖片，幫助視覺型學習者加強記憶。<br>

-->

<br><br><br>

![](https://github.com/johch3n611u/WordupImprove/blob/master/assets/1.png?raw=true)

![](https://github.com/johch3n611u/WordupImprove/blob/master/assets/2.png?raw=true)

![](https://github.com/johch3n611u/WordupImprove/blob/master/assets/3.png?raw=true)

![](https://github.com/johch3n611u/WordupImprove/blob/master/assets/4.png?raw=true)

![](https://github.com/johch3n611u/WordupImprove/blob/master/assets/5.png?raw=true)
