import { Pipe, PipeTransform } from '@angular/core';
import { GlgorithmsService } from 'lib/feature';

//  https://dev.to/this-is-angular/search-and-highlight-text-feature-using-angular-l98
//  <div [innerHtml]="coupon.name | highlight:searchKeyword:'full'">{{ name }}</div>

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {

  constructor(
    private glgorithmsService: GlgorithmsService,
  ) { }

  transform(sentence: any, keyword: any, type: REGEXP_TYPE = REGEXP_TYPE.Full): string {
    if (!keyword) {
      return sentence;
    };

    let tempSentence = JSON.parse(JSON.stringify(sentence));
    switch (type) {
      case REGEXP_TYPE.First:
        // $1 代表正則表達式中第一個捕獲群組（capturing group）所匹配到的文字。
        sentence = sentence.replace(
          new RegExp("\\b(" + keyword + "\\b)", 'igm'),
          '<span class="keyword">$1</span>'
        );
        break;
      default:
        // $& 代表整個正則表達式所匹配到的文字。
        sentence = sentence.replace(
          new RegExp(keyword, 'igm'),
          '<span class="keyword">$&</span>'
        );
        break;
    }

    if (tempSentence === sentence) {
      let words = tempSentence.split(" ");
      let glossary: any[] = [];
      words.forEach((word: any) => {
        let score = this.glgorithmsService.calculateSimilarity(word, keyword);
        glossary.push({ word: word, score: score });
      });
      glossary.sort((a, b) => b.score - a.score);
      sentence = sentence.replace(
        new RegExp(glossary[0].word, 'igm'),
        '<span class="keyword">$&</span>'
      );
    }

    return sentence;
  }
}

export enum REGEXP_TYPE {
  Full = 'Full',
  First = 'First'
}
