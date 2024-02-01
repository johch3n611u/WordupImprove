// https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet
// https://dowyuu.github.io/program/2021/03/22/Leaflet-note/
// https://gamewith.net/palworld/43313
// https://jsfiddle.net/newluck77/rk9v0uyo/
// https://forum.gamer.com.tw/C.php?bsn=71458&snA=11
// https://paldb.cc/tw/ 雕像網站
// https://leafletjs.cn/
// 配種 https://palworld.fandom.com/wiki/Breeding
// https://palworld.gg/
// APP https://forum.gamer.com.tw/C.php?bsn=71458&snA=1410
// https://paldex.io/
// 配種 101 https://forum.gamer.com.tw/C.php?bsn=71458&snA=1437
// 配種 https://forum.gamer.com.tw/C.php?bsn=71458&snA=1385
// 雕像大大巴哈 po https://forum.gamer.com.tw/C.php?bsn=71458&snA=1079&tnum=12
// https://palwiki.io/

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, filter, map, take, tap } from 'rxjs';

@Component({
  selector: 'mod-pal-world-map-leaflet',
  templateUrl: `./pal-world-map-leaflet.component.html`,
  styleUrls: ['./pal-world-map-leaflet.component.scss'],
})
export class PalWorldMapLeafletComponent {
  palsInfoPath = './assets/palworld';
  palsInfo$ = new BehaviorSubject<any>([]);
  passiveSkills$ = new BehaviorSubject<any>([]);
  map: any;
  lowerLeftDisplay = 'passiveSkills';

  constructor(private httpClient: HttpClient) {
    // get the json of pals info
    this.httpClient
      .get(`${this.palsInfoPath}/palword.json`)
      .pipe(
        take(1),
        tap((pals: any) =>
          pals.forEach((pal: any) => {
            pal.color = this.getUniqueColor();
            if (pal.boss) {
              pal.boss.latlngs.forEach((latlng: any) => {
                let bossMarker = L.marker(latlng, {
                  icon: this.generateIcon(pal.boss.image, `bosses`, 50),
                  title: pal.boss.level,
                });
                this.bossesMarkersLayer.addLayer(bossMarker);
              });
            }
          })
        )
      )
      .subscribe((res: any) => {
        this.palsInfo$.next(res);
        this.search.palSearched = JSON?.parse(JSON?.stringify(res));
      });
    // get passiveSkills.json
    this.httpClient
      .get(`${this.palsInfoPath}/passiveSkills.json`)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.passiveSkills$.next(res);
        this.search.skillSearched = JSON?.parse(JSON?.stringify(res));
      });
  }

  ngAfterViewInit(): void {
    this.initPalWorldMap();
    this.onMouseClick();
  }

  ngOnInit(): void {}

  // private initRealMap(): void {
  //   const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  //   this.map = L.map('map');
  //   L.tileLayer(baseMapURl).addTo(this.map);
  // }

  // @HostListener('mousemove') onMouseMove(e: any)
  // {
  //   let latLng = e.latlng;
  // }

  // private centerMap() {
  //   let markers: L.Marker<L.LatLng>[] = [];
  //   // Create a LatLngBounds object to encompass all the marker locations
  //   const bounds = L.latLngBounds(
  //     markers.map((marker) => marker.getLatLng())
  //   );

  //   // Fit the map view to the bounds
  //   this.map.fitBounds(bounds);
  // }

  public generateIcon(
    imgName: string,
    fileDir: string = 'main_pins',
    size: number = 30
  ) {
    return L.icon({
      iconUrl: `./assets/palworld/${fileDir}/${imgName}`,
      iconSize: [size, size], // icon 寬, 長
      shadowSize: [50, 64], // 陰影 寬, 長
      iconAnchor: [5, 5], // icon 中心偏移
      shadowAnchor: [4, 62], // 陰影 中心偏移
      popupAnchor: [-3, -76], // 綁定popup 中心偏移
    });
  }

  templatlngs = [];
  corner1 = L.latLng(0, 0);
  corner2 = L.latLng(1000, 1000);
  bounds = L.latLngBounds(this.corner1, this.corner2);
  defaultMap = L.imageOverlay(
    './assets/palworld/palpagos_islands.webp',
    this.bounds
  );
  levelsMap = L.imageOverlay(
    './assets/palworld/palpagos_islands_levels.webp',
    this.bounds
  );
  tempMarkersLayer = L.layerGroup();
  habitatLayer = L.layerGroup();
  bossesMarkersLayer = L.layerGroup();
  vendorsMarkersLayer = L.layerGroup();
  minesMarkersLayer = L.layerGroup();
  syndicateTowerMarkersLayer = L.layerGroup();
  skillFruitsMarkersLayer = L.layerGroup();
  fastTravelMarkersLayer = L.layerGroup();

  baseLayers = {
    defaul: this.defaultMap,
    levels: this.levelsMap,
  };
  overlays = {
    bosses: this.bossesMarkersLayer,
    vendors: this.vendorsMarkersLayer,
    mines: this.minesMarkersLayer,
    syndicateTower: this.syndicateTowerMarkersLayer,
    skillFruits: this.skillFruitsMarkersLayer,
    fastTravel: this.fastTravelMarkersLayer,
  };
  latlngs: any = [];

  private onMouseClick() {
    this.map.on('click', (mapClick: L.LeafletMouseEvent) => {
      this.latlngs.push({
        lat: mapClick.latlng.lat,
        lng: mapClick.latlng.lng,
      });

      // add marker and listen the marker, when it be click then remove it
      let marker = L.marker([mapClick.latlng.lat, mapClick.latlng.lng], {
        icon: this.generateIcon('10001.png'),
      }).on('click', (markerClick) => {
        // remove from layergroup
        this.tempMarkersLayer.removeLayer(marker);
      });
      this.tempMarkersLayer.addLayer(marker).addTo(this.map);
      console.log(marker.getLatLng());
      console.log(this.tempMarkersLayer.getLayers());
    });
  }

  public initPalWorldMap(): void {
    this.map = L.map('map', {
      layers: [this.levelsMap],
      crs: L.CRS.Simple,
    });

    this.moveToMapCenter();

    L.control
      .layers(this.baseLayers, this.overlays, { collapsed: false })
      .addTo(this.map);
  }

  moveToMapCenter() {
    let corner1 = L.latLng(0, 0);
    let corner2 = L.latLng(1800, 1000);
    let bounds = L.latLngBounds(corner1, corner2);
    this.map.fitBounds(bounds);
  }

  search: any = {
    palKeyword: '',
    palSearched: [],
    skillSearched: [],
  };

  searchPals() {
    this.map.removeLayer(this.habitatLayer);
    this.habitatLayer = L.layerGroup();
    this.palsInfo$?.getValue().forEach((pal: any) => {
      pal.selected = false;
    });
    if (
      this.search.palKeyword !== undefined &&
      this.search.palKeyword !== null &&
      this.search.palKeyword.replace(/\s*/g, '') !== ''
    ) {
      this.palsInfo$.pipe(take(1)).subscribe((pals) => {
        this.search?.palKeyword?.toLowerCase();
        this.search.palSearched = [];
        pals?.forEach((pal: any) => {
          delete pal.palFromSelectLayer;
          let result = JSON?.stringify(pal)?.toLowerCase();

          let blank = this.search.palKeyword?.split(' ');
          let comma = this.search.palKeyword?.split(',');
          let connectComma = this.search.palKeyword?.split('，');
          let pauseComma = this.search.palKeyword?.split('、');

          let searchWords: any = [];

          if (comma.length > 1) {
            searchWords = comma;
          } else if (connectComma.length > 1) {
            searchWords = connectComma;
          } else if (pauseComma.length > 1) {
            searchWords = pauseComma;
          } else {
            searchWords = blank;
          }

          searchWords = [
            ...new Set(
              searchWords
                ?.map((str: any) => str.replace(/\s/g, ''))
                ?.filter((str: any) => str !== '')
            ),
          ];

          let searchedCount = 0;
          searchWords.forEach((word: any) => {
            if (result.indexOf(word?.toLowerCase()) !== -1) {
              searchedCount++;
            } else if (word === '坐騎' && pal.mount) {
              searchedCount++;
            }
          });

          if (searchedCount === searchWords.length) {
            this.search?.palSearched?.push(pal);
          }
        });
      });
    } else {
      this.search.palSearched = this.palsInfo$?.getValue();
      this.search.palKeyword = '';
    }
  }

  colors: string[] = [];
  public getUniqueColor(alpha: number = 0.3) {
    let color = '';
    while (!this.colors?.includes(color)) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      if (!this.colors?.includes(color)) {
        this.colors.push(color);
      }
    }
    return color;
  }

  activePal(palFromSelect: any) {
    palFromSelect.selected = !palFromSelect.selected;
    if (palFromSelect.selected) {
      let palFromSelectLayer = L.layerGroup();

      if (palFromSelect.boss) {
        palFromSelect.boss.latlngs.forEach((latlng: any) => {
          let bossMarker = L.marker(latlng, {
            icon: this.generateIcon(palFromSelect.boss.image, `bosses`, 50),
            title: palFromSelect.boss.level,
          });
          palFromSelectLayer.addLayer(bossMarker);
        });
      }

      palFromSelect.latlngs.forEach((latlng: any) => {
        const palLayer = L.polygon(latlng, {
          color: palFromSelect.color,
          fillColor: palFromSelect.color,
          fillOpacity: 1,
        });
        palFromSelectLayer.addLayer(palLayer);
      });

      palFromSelect.palFromSelectLayer = palFromSelectLayer;
      this.habitatLayer.addLayer(palFromSelectLayer).addTo(this.map);
    } else {
      if (palFromSelect.palFromSelectLayer) {
        this.habitatLayer.removeLayer(palFromSelect.palFromSelectLayer);
      }
    }
  }

  copyLatlngs() {
    let stringLatlngs = '';
    this.latlngs.forEach((latlng: any, index: any) => {
      stringLatlngs += `[${latlng.lat},${latlng.lng}]`;
      if (index !== this.latlngs.length - 1) {
        stringLatlngs += ',';
      }
    });
    stringLatlngs += '';

    // 建立一個新的<input>元素
    var input = document.createElement('input');
    input.value = stringLatlngs;
    // 將<input>元素添加到當前的頁面上
    document.body.appendChild(input);
    // 選取<input>元素中的內容
    input.select();
    // 複製選取的內容到剪貼板
    document.execCommand('copy');
    // 移除<input>元素
    document.body.removeChild(input);
  }

  filterElements: any = [
    { name: '無', color: 'rgb(205,102,84)' },
    { name: '水', color: 'rgb(205,102,84)' },
    { name: '火', color: 'rgb(205,102,84)' },
    { name: '草', color: 'rgb(205,102,84)' },
    { name: '地', color: 'rgb(205,102,84)' },
    { name: '雷', color: 'rgb(205,102,84)' },
    { name: '龍', color: 'rgb(205,102,84)' },
    { name: '冰', color: 'rgb(205,102,84)' },
    { name: '暗', color: 'rgb(205,102,84)' },
    { name: '坐騎', color: 'rgb(205,102,84)' },
    { name: '烹調', color: 'rgb(205,102,84)' },
    { name: '澆水', color: 'rgb(205,102,84)' },
    { name: '播種', color: 'rgb(205,102,84)' },
    { name: '發電', color: 'rgb(205,102,84)' },
    { name: '生產', color: 'rgb(205,102,84)' },
    { name: '收成', color: 'rgb(205,102,84)' },
    { name: '採伐', color: 'rgb(205,102,84)' },
    { name: '挖掘', color: 'rgb(205,102,84)' },
    { name: '製藥', color: 'rgb(205,102,84)' },
    { name: '冷卻', color: 'rgb(205,102,84)' },
    { name: '搬運', color: 'rgb(205,102,84)' },
    { name: 'Boss', color: 'rgb(205,102,84)' },
  ];
  filterSearchPals(ele: any) {
    ele.selected = !ele.selected;
    if (ele.selected) {
      this.search.palKeyword += ` ${ele.name}`;
    } else {
      this.search.palKeyword = this.search.palKeyword.replace(ele.name, '');
    }
    this.searchPals();
  }

  filterSkillElements: any = [
    { name: '攻擊', color: 'rgb(205,102,84)' },
    { name: '傷害', color: 'rgb(205,102,84)' },
    { name: '防禦', color: 'rgb(205,102,84)' },
    { name: '砍伐', color: 'rgb(205,102,84)' },
    { name: '工作', color: 'rgb(205,102,84)' },
    { name: '速度', color: 'rgb(205,102,84)' },
    { name: '移動', color: 'rgb(205,102,84)' },
    { name: '地', color: 'rgb(205,102,84)' },
    { name: '草', color: 'rgb(205,102,84)' },
    { name: '雷', color: 'rgb(205,102,84)' },
    { name: '火', color: 'rgb(205,102,84)' },
    { name: '水', color: 'rgb(205,102,84)' },
    { name: '龍', color: 'rgb(205,102,84)' },
    { name: '冰', color: 'rgb(205,102,84)' },
    { name: '無', color: 'rgb(205,102,84)' },
    { name: '暗', color: 'rgb(205,102,84)' },
    { name: 'SAN值', color: 'rgb(205,102,84)' },
  ];

  filterSkill(ele: any) {
    ele.selected = !ele.selected;
    let selected = this.filterSkillElements.filter((ele: any) => ele.selected);
    if (selected) {
      this.passiveSkills$.pipe(take(1)).subscribe((res: any) => {
        let result = JSON?.stringify(res)?.toLowerCase();

          let blank = this.search.palKeyword?.split(' ');
          console.log(selected);
      });
    } else {
      this.search.skillSearched = this.passiveSkills$.getValue();
    }
  }
}
