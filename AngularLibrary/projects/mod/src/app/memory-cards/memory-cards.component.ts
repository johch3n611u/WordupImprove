import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'mod-memory-cards',
  templateUrl: './memory-cards.component.html',
  styleUrls: ['./memory-cards.component.scss']
})
export class MemoryCardsComponent {
  constructor(private httpClient: HttpClient) {
    httpClient.get('https://docs.google.com/spreadsheets/d/1KelsVdzmFwaW7zZtMzAgYX4YflhhBhC71O0nS995CDY/gviz/tq').subscribe(data => {
      console.log(data);
    })
  }
}
