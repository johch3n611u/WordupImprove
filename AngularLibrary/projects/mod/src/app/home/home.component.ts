import { Component } from '@angular/core';

@Component({
  selector: 'mod-home',
  template: `
            <div class="angularApp">
              <!-- <a [routerLink]="['/sample']">EC Demo</a> -->
              <h3>Mods</h3>
              <a [routerLink]="['/en-word-hero']">En Word Hero</a>
              <a [routerLink]="['/pal-tool']">Pal Tool</a>
              <a [routerLink]="['/memory-cards']">Memory Card</a>
            </div>`,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent { }