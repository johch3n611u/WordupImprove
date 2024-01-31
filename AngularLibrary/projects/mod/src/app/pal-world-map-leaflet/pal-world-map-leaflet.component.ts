// https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet
// https://dowyuu.github.io/program/2021/03/22/Leaflet-note/
// https://gamewith.net/palworld/43313
// https://jsfiddle.net/newluck77/rk9v0uyo/
// https://forum.gamer.com.tw/C.php?bsn=71458&snA=11
// https://paldb.cc/tw/
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
  palsInfoPath = './assets/palworld/palword.json';
  palsInfo$ = new BehaviorSubject<any>([]);
  map: any;

  constructor(private httpClient: HttpClient) {
    // get the json of pals info
    this.httpClient
      .get(this.palsInfoPath)
      .pipe(
        tap((pals: any) =>
          pals.forEach((pal: any) => (pal.color = this.getUniqueColor()))
        )
      )
      .subscribe((res: any) => {
        this.palsInfo$.next(res);
        this.search.searched = JSON?.parse(JSON?.stringify(res));
      });
  }

  ngAfterViewInit(): void {
    this.initPalWorldMap();
    this.onMouseClick();
    this.initBossesLayer();
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
  habitatLayer = L.layerGroup();
  bossesMarkersLayer = L.layerGroup();

  baseLayers = {
    defaul: this.defaultMap,
    levels: this.levelsMap,
  };
  overlays = {
    bosses: this.bossesMarkersLayer,
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
        this.bossesMarkersLayer.removeLayer(marker);
      });
      this.bossesMarkersLayer.addLayer(marker).addTo(this.map);
      console.log(marker.getLatLng());
      console.log(this.bossesMarkersLayer.getLayers());
    });
  }

  public initBossesLayer(): void {
    this.palsInfo$.forEach((pal) => {
      if (pal.boss) {
        let bossMarker = L.marker(pal.boss.latlng, {
          icon: this.generateIcon(pal.boss.image, `bosses`, 50),
          title: pal.boss.level,
        });
        this.bossesMarkersLayer.addLayer(bossMarker).addTo(this.map);
      }
    });
  }
  private initPalWorldMap(): void {
    this.map = L.map('map', {
      layers: [this.levelsMap],
      crs: L.CRS.Simple,
    });

    this.map.fitBounds(this.bounds);

    L.control.layers(this.baseLayers, this.overlays).addTo(this.map);
  }

  search: any = {
    keyword: '',
    searched: [],
  };

  searchPals() {
    this.map.removeLayer(this.habitatLayer);
    this.habitatLayer = L.layerGroup();
    this.palsInfo$?.getValue().forEach((pal: any) => {
      pal.selected = false;
    })
    if (
      this.search.keyword !== undefined &&
      this.search.keyword !== null &&
      this.search.keyword.replace(/\s*/g, '') !== ''
    ) {
      this.palsInfo$.pipe().subscribe((pals) => {
        this.search?.keyword?.toLowerCase();
        this.search.searched = [];
        pals?.forEach((pal: any) => {
          delete pal.palFromSelectLayer;
          let result = JSON?.stringify(pal)
            ?.toLowerCase()
            ?.indexOf(this.search?.keyword?.toLowerCase());
          if (result !== -1) {
            this.search?.searched?.push(pal);
          }
        });
      });
    } else {
      this.search.searched = this.palsInfo$?.getValue();
    }
  }

  colors: string[] = [];
  public getUniqueColor() {
    let color = '';
    while (!this.colors?.includes(color)) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      color = `rgb(${r}, ${g}, ${b})`;
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
          fillOpacity: 0.4,
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
}
