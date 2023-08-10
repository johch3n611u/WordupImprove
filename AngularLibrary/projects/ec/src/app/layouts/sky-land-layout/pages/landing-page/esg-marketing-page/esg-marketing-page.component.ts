import { Component } from '@angular/core';

@Component({
  selector: 'ec-home-page',
  templateUrl: './esg-marketing-page.component.html',
  styleUrls: ['./esg-marketing-page.component.scss']
})
export class EsgMarketingPageComponent {

  cards = [
    { title: '兩斤勘吉', text: '1% of profits are donated to Rainforest Rescue to preserve and protect endangered rainforests.' },
    { title: '秋本麗子', text: '4% of profits to charities and social enterprises to support positive change in the community.' },
    { title: '野比大雄', text: 'Bringing customers, industry, government and the public together to champion composting.' }
  ];
}
