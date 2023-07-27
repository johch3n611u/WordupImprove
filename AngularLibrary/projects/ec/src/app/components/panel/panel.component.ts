import { Component, Input } from '@angular/core';
import { TranslateService } from 'lib/public-api';
@Component({
  selector: 'ec-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  @Input() data: any = {};
  language = [
    {
      name: 'EN',
      active: true
    },
    {
      name: '繁體',
      active: false
    },
    {
      name: '简体',
      active: false
    },
    {
      name: '日本語',
      active: false
    },
    {
      name: 'แบบไทย',
      active: false
    }
  ];

  constructor(
    private translateService: TranslateService,
  ) {

  }

  ngOnInit(): void {
    // console.log(this.data.leftNav);
  }

  ChangeLang(selected?: string): void {
    this.language.forEach(lang => lang.active = false);
    let lang = this.language.find(lang => lang.name === selected);
    if (lang) {
      lang.active = true;
      this.translateService.use(lang.name);
    }
  }

  GetActive() {
    return this.language.find(lang => lang.active)?.name;
  }

  GetPassive() {
    return this.language.filter(lang => !lang.active).map(lang => lang.name);
  }
}
