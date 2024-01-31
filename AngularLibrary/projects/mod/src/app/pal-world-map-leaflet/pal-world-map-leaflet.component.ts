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
        this.search.searched = res;
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
    if (
      this.search.keyword !== undefined &&
      this.search.keyword !== null &&
      this.search.keyword.replace(/\s*/g, '') !== ''
    ) {
      this.palsInfo$
        .pipe(
          tap((pals) => {
            this.search.searched = [];
            pals?.forEach((pal: any) => {
              let search = Object?.values(pal)?.some((value: any) => {
                if (!value) return false;
                return (
                  (typeof value === 'string' &&
                    value?.includes(this.search?.keyword)) ||
                  (typeof value === 'object' &&
                    Object?.values(value)?.some((value2: any) => {
                      if (!value2) return false;
                      return value2?.includes(this.search?.keyword);
                    }))
                );
              });
              if (search) {
                this.search?.searched?.push(pal);
              }
            });
          })
        )
        .subscribe();
    } else {
      this.search.searched = this.palsInfo$.getValue();
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

  palSelectedLayerList:
    | [
        {
          pal: any;
          palLayer: L.Polygon<any>;
        }
      ]
    | any = [];

  activeBossesPalList: any = [];
  // selected pal after search
  activePal(palFromSelect: any) {
    palFromSelect.selected = !palFromSelect.selected;
    if (palFromSelect.selected) {
      let bossMarker: L.Marker<any> | any = {};
      if (palFromSelect.boss) {
        bossMarker = L.marker(palFromSelect.boss.latlng, {
          icon: this.generateIcon(palFromSelect.boss.image, `bosses`, 50),
          title: palFromSelect.boss.level,
        });
        this.habitatLayer.addLayer(bossMarker).addTo(this.map);
        const bossMarkerGroup = { palFromSelect, bossMarker };
        this.activeBossesPalList.push(bossMarkerGroup);
      } else {
        bossMarker = null;
      }
      // add pal layer in list
      palFromSelect.latlngs.forEach((latlng: any) => {
        const palLayer = L.polygon(latlng, {
          color: palFromSelect.color,
          fillColor: palFromSelect.color,
          fillOpacity: 0.4,
        });
        // add each location layer, then add in temp to save the layer info
        this.habitatLayer.addLayer(palLayer).addTo(this.map);
        // key: pal info,value: palLayer
        const palLayerGroup = { palFromSelect, palLayer };
        this.palSelectedLayerList.push(palLayerGroup);
      });
    } else {
      // find out which isn't selected
      const palLayerGroupList = this.palSelectedLayerList.filter(
        (value: any) => palFromSelect.name == value.palFromSelect.name
      );
      // then remove layer form the temp
      palLayerGroupList.forEach((value: any) => {
        this.habitatLayer.removeLayer(value.palLayer);
      });
      const palBossMarkerInfo = this.activeBossesPalList.filter(
        (value: any) => palFromSelect.name == value.palFromSelect.name
      );
      this.habitatLayer.removeLayer(palBossMarkerInfo[0].bossMarker);
    }

    // this.bossesMarkersLayer.removeLayer(marker);
    // this.search.searched.forEach((palLocation:any)=>{
    //   const color = this.colors.pop();
    //   palLocation.latlngs.forEach((latlng:any)=>{
    //   var polygon = L.polygon(
    //     latlng,
    //     { color: color, fillColor: color, fillOpacity: 0.3 }
    //   ).addTo(this.map);
    // })
    // });
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
