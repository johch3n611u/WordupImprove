import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlgorithmsService {

  constructor() { }

  /**
   * 使用編輯距離算法計算兩個字詞之間的相似度
   * @param word1 - 第一個字詞
   * @param word2 - 第二個字詞
   * @returns 兩個字詞之間的相似度（範圍在 0 到 1 之間，1 表示完全相同）
   */
  calculateSimilarity(word1: any, word2: any): number {
    // 獲取兩個字詞的長度
    const m = word1?.length;
    const n = word2?.length;
    // 創建一個二維數組來存儲編輯距離的計算結果
    const dp = [];

    // 初始化第一行和第一列
    for (let i = 0; i <= m; i++) {
      dp[i] = [i];
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    // 遍歷計算編輯距離
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        // 計算插入、刪除和替換操作的成本
        const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
        // 使用動態規劃計算最小編輯距離
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // 刪除操作
          dp[i][j - 1] + 1, // 插入操作
          dp[i - 1][j - 1] + cost // 替換操作
        );
      }
    }

    // 計算相似度
    const maxLen = Math.max(m, n);
    const similarity = 1 - dp[m][n] / maxLen;
    return similarity;
  }

  /**
   * 計算艾賓浩斯遺忘曲線下降率
   * @param t - 時間（以單位表示）
   * @returns 遺忘曲線下降率
   */
  ebinghausForgetRate(t: number): number {
    const a = 1.25; // 初始下降率
    const b = 0.1; // 下降速度
    // 使用指數函數計算遺忘曲線下降率
    return Math.exp(-a * Math.pow(t, b));
  }

  /**
   * 將輸入的值映射到另一個範圍內
   * @param inputValue - 輸入的值
   * @param maxInput - 輸入的最大值（預設為 120）
   * @param minOutput - 輸出的最小值（預設為 1）
   * @param maxOutput - 輸出的最大值（預設為 5）
   * @returns 映射後的值
   */
  mapScore(inputValue: number, maxInput: number = 120, minOutput: number = 1, maxOutput: number = 5): number {
    // 將 inputSeconds 限制在最小秒數和最大秒數之間
    const minSeconds = 1;
    const normalizedinputValue = Math.min(
      Math.max(inputValue, minSeconds),
      maxInput
    );

    // 計算輸入和輸出的範圍
    const inputRange = maxInput - minSeconds;
    const outputRange = maxOutput - minOutput;

    // 將輸入的值映射到輸出的範圍
    let mappedValue = Math.ceil(((normalizedinputValue / inputRange) * outputRange));

    // 如果輸入的值超過了最大輸入值，則將映射值設為最大輸出值
    if ((normalizedinputValue / inputRange) > 1) {
      mappedValue = maxOutput;
    }

    // 如果映射值小於最小輸出值，則將其設為最小輸出值
    if (mappedValue < minOutput) {
      mappedValue = minOutput;
    }

    return mappedValue;
  }

  /**
 * 生成指定範圍內的隨機整數
 * @param max - 最大值（包含）
 * @param min - 最小值（預設為 0）
 * @returns 指定範圍內的隨機整數
 */
  getRandomNum(max: number, min: number = 0): number {
    // 向上取整最小值
    min = Math.ceil(min);
    // 向下取整最大值
    max = Math.floor(max);
    // 使用 Math.random() 生成一個介於 0（包含）和 1（不包含）之間的隨機小數，乘以範圍的大小並向下取整，再加上最小值
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
