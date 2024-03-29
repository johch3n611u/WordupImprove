import { Injectable, isDevMode } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { take } from 'rxjs';
// import { concat, filter, first, interval, map, take } from 'rxjs';
// import { Platform } from '@angular/cdk/platform';

// <p>swUpdate：{{this.swUpdate.isEnabled}} / isOnline：{{ isOnline ? 'Online': 'Offline'}} / currentVersion：{{ currentVersion }} / latestVersion：{{ latestVersion }} / pwaPlatform：{{pwaPlatform}}</p>
// <button (click)="test()">test</button>

@Injectable({
    providedIn: 'root'
})
export class ServiceWorkerService {

    // 參考
    // https://angular.io/guide/service-worker-communications
    // https://stackoverflow.com/questions/69735012/pwa-swupdate-checkforupdate-does-nothing
    // https://github.com/angular/angular/issues/47455
    // 原生 sw 似乎也很多問題 https://www.denis.es/blog/pwa-service-worker-problems-secrets-tricks-debugging/
    // 瀏覽器會在關閉時更新 sw 所以如果要調適新版本需要關閉再開，並且因為 sw 可以監控前端的任何存取，所以被要求必須在 HTTPS 下運行 https://jonny-huang.github.io/angular/training/20_pwa2/
    // https://stackoverflow.com/questions/58414364/how-to-edit-your-service-worker-file-for-an-angular-cli-project
    // https://github.com/angular/angular/issues/51457
    // https://stackoverflow.com/questions/66031326/angular-application-in-custom-url-path-with-serviceworker
    // https://ithelp.ithome.com.tw/articles/10228556
    // https://blackie1019.github.io/2017/08/01/Using-Service-Worker-to-Optimize-Web-Site-Performance/
    // https://rodrigokamada.medium.com/adding-the-progressive-web-application-pwa-to-an-angular-application-7a060b111b63
    // https://github.com/rodrigokamada/angular-pwa/tree/main
    // https://stackoverflow.com/questions/58729197/the-prompt-method-must-be-called-with-a-user-gesture-error-in-angular-pwa
    // https://stackoverflow.com/questions/60379994/determining-pwa-installation-status
    // https://fullstackladder.dev/blog/2019/07/28/angular-pwa-service-worke-registration-options/

    constructor(
        public swUpdate: SwUpdate,
        // private platform: Platform,
        // appRef: ApplicationRef,
    ) {
        // 如果會觸發 beforeinstallprompt 代表還未安裝
        if (!isDevMode()) {
            window.addEventListener('beforeinstallprompt', async (event: any) => {
                event.preventDefault();
                // 強迫必須有點擊按鈕才能觸發 prompt
                const installBtn = document.querySelector(".answerScoreResetBtn");
                installBtn?.addEventListener("click", () => {
                    let askedInstallPWA = localStorage.getItem('askedInstallPWA');
                    console.log('answerScoreResetBtn click', askedInstallPWA);
                    if (!askedInstallPWA) {
                        // 新增應用程序安裝
                        event.prompt();
                        event.userChoice.then((choice: any) => {
                            // 確認使用者的選擇
                            if (choice.outcome !== 'accepted') {
                                alert('如後續要安裝應用程式，請透過右上角設定自行安裝');
                            }
                            localStorage.setItem('askedInstallPWA', 'true');
                        });
                    }

                    installBtn?.removeEventListener("click", () => console.log('remove installBtn listener'));
                });
            });
        }
    }

    judgmentUpdate() {
        if (!isDevMode()) {
            this.swUpdate.checkForUpdate().then((updateFound) => {
                if (updateFound) {
                    if (confirm('有新版本可用，要更新嗎？')) {
                        window.location.reload();
                    }
                }
            });

            this.swUpdate.versionUpdates.pipe(take(1)).subscribe(evt => {
                switch (evt.type) {
                    case 'VERSION_DETECTED':
                        console.info(`下載新的應用程式版本: ${evt.version.hash}`);
                        break;
                    case 'VERSION_READY':
                        console.info(`目前應用程式版本: ${evt.currentVersion.hash}`);
                        console.info(`新的應用程式版本可供使用: ${evt.latestVersion.hash}`);
                        break;
                    case 'VERSION_INSTALLATION_FAILED':
                        console.info(`應用程式版本安裝失敗: '${evt.version.hash}': ${evt.error}`);
                        break;
                }
            });
        }

    }

    // this.swUpdate.checkForUpdate().then((updateFound) => {
    //     console.log(updateFound ? '有新版本可用' : '已經是最新版本了');
    // });

    // this.isOnline = false;
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    // const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    // const everySixHours$ = interval(6 * 60 * 60 * 1000);
    // const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    // everySixHoursOnceAppIsStable$.subscribe(async () => {
    //   try {
    //     this.loadModalPwa();
    //     const updateFound = await swUpdate.checkForUpdate();
    //     console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
    //   } catch (err) {
    //     console.error('Failed to check for updates:', err);
    //   }
    // });

    // swUpdateEnabled!: any;
    // public ngOnInit(): void {
    //   this.onlineStatusInit();
    // }

    // // 檢查瀏覽器連線狀態
    // isOnline!: boolean;
    // private updateOnlineStatus(): void {
    //   this.isOnline = window.navigator.onLine;
    // }
    // onlineStatusInit() {
    //   this.updateOnlineStatus();
    //   window.addEventListener('online', this.updateOnlineStatus.bind(this));
    //   window.addEventListener('offline', this.updateOnlineStatus.bind(this));
    // }

    // currentVersion!: any;
    // latestVersion!: any;
    // // 更新應用程式
    // public updateVersion(): void {
    //   // Service Worker 在初始化期間和每次導航請求時檢查更新
    //   window.location.reload();
    // }

    // // 檢查作業系統和瀏覽器
    // pwaPlatform: string | undefined;
    // private async loadModalPwa(): Promise<void> {
    //   console.log('this.platform', this.platform);
    //   if (this.platform.ANDROID) {
    //     window.addEventListener('beforeinstallprompt', async (event: any) => {
    //       event.preventDefault();
    //       this.pwaPlatform = 'ANDROID';
    //       // 新增應用程序安裝
    //       event.prompt();

    //       // Act on the user's choice
    //       const { outcome } = await event.userChoice;
    //       if (outcome === 'accepted') {
    //         console.log('User accepted the install prompt.');
    //       } else if (outcome === 'dismissed') {
    //         console.log('User dismissed the install prompt');
    //       }
    //     });
    //   }

    //   if (this.platform.IOS && this.platform.SAFARI) {
    //     const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
    //     if (!isInStandaloneMode) {
    //       this.pwaPlatform = 'IOS';
    //     }
    //   }
    // }

    // async test() {
    //   const updateFound = await this.swUpdate.checkForUpdate();
    //   console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
    //   await this.swUpdate.versionUpdates.subscribe(evt => {
    //     switch (evt.type) {
    //       case 'VERSION_DETECTED':
    //         console.log(`Downloading new app version: ${evt.version.hash}`);
    //         break;
    //       case 'VERSION_READY':
    //         console.log(`Current app version: ${evt.currentVersion.hash}`);
    //         console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
    //         this.currentVersion = evt.currentVersion;
    //         this.latestVersion = evt.latestVersion;
    //         break;
    //       case 'VERSION_INSTALLATION_FAILED':
    //         console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
    //         break;
    //     }
    //   });
    //   this.loadModalPwa();
    // }
}