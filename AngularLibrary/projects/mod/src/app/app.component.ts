import { Component } from '@angular/core';
import { ServiceWorkerService } from 'lib/feature';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    serviceWorkerService: ServiceWorkerService,
  ) {
    // 問題太多了，而且似乎沒有完美解方，目前先將就著用
    window.addEventListener('beforeinstallprompt', async (event: any) => {
      event.preventDefault();
      console.log('beforeinstallprompt Event', event);
      serviceWorkerService.promptEvent$.next(event);
    });
  }
}
