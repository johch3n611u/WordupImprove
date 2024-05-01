import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlgorithmsService {

  constructor() { }

  // 编辑距离算法（Levenshtein distance）来计算相似度的示例函数
  calculateSimilarity(word1: any, word2: any) {
    const m = word1?.length;
    const n = word2?.length;
    const dp = [];

    for (let i = 0; i <= m; i++) {
      dp[i] = [i];
    }

    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // 删除操作
          dp[i][j - 1] + 1, // 插入操作
          dp[i - 1][j - 1] + cost // 替换操作
        );
      }
    }

    const maxLen = Math.max(m, n);
    const similarity = 1 - dp[m][n] / maxLen;
    return similarity;
  }

  // 艾賓浩斯遺忘曲線
  ebinghausForgetRate(t: number) {
    const a = 1.25; // 初始下降率
    const b = 0.1; // 下降速度
    return Math.exp(-a * Math.pow(t, b));
  }

  // 在最大和最小值限制內抓比例對照值
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
}
