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
}
