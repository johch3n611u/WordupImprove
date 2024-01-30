// https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet
// https://dowyuu.github.io/program/2021/03/22/Leaflet-note/
// https://gamewith.net/palworld/43313
// https://jsfiddle.net/newluck77/rk9v0uyo/
// https://forum.gamer.com.tw/C.php?bsn=71458&snA=11
// https://paldb.cc/tw/
// https://leafletjs.cn/
// 配種 https://palworld.fandom.com/wiki/Breeding
// https://palworld.gg/
// APP
// https://paldex.io/

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, filter, take, tap } from 'rxjs';

@Component({
  selector: 'mod-pal-world-map-leaflet',
  templateUrl: `./pal-world-map-leaflet.component.html`,
  styleUrls: ['./pal-world-map-leaflet.component.scss'],
})
export class PalWorldMapLeafletComponent {
  palsInfoPath = './assets/palworld/palword.json';
  palsInfo$ = new BehaviorSubject<any>([]);
  private map: any;

  constructor(private httpClient: HttpClient) {
    // get the json of pals info
    this.httpClient.get(this.palsInfoPath).subscribe((res: any) => {
      this.palsInfo$.next(res);
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

  public generateIcon(imgName: string) {
    return L.icon({
      iconUrl: `./assets/palworld/main_pins/${imgName}`,
      iconSize: [30, 30], // icon 寬, 長
      shadowSize: [50, 64], // 陰影 寬, 長
      iconAnchor: [5, 5], // icon 中心偏移
      shadowAnchor: [4, 62], // 陰影 中心偏移
      popupAnchor: [-3, -76], // 綁定popup 中心偏移
    });
  }

  templatlngs = [];
  markersLayer = L.layerGroup();
  bossesMarkersLayer = L.layerGroup();
  baseLayers = {
    defaul: this.markersLayer,
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

  private initPalWorldMap(): void {
    this.colors = this.generateRandomColors(1000);
    this.map = L.map('map', {
      layers: [this.markersLayer],
      crs: L.CRS.Simple,
    });

    let corner1 = L.latLng(0, 0);
    var corner2 = L.latLng(1000, 1000);
    let bounds = L.latLngBounds(corner1, corner2);
    let image = L.imageOverlay(
      './assets/palworld/palpagos_islands.webp',
      bounds
    ).addTo(this.map);
    this.map.fitBounds(bounds);

    L.control.layers(this.baseLayers, this.overlays).addTo(this.map);
    let colorCount = 150;
    let randomColors = this.generateRandomColors(colorCount);
    // 改為 init pals 資料時就賦予每一種 pal 一種獨立的顏色
  }

  search: any = {
    keyword: '',
    searched: [],
  };

  searchPals() {
    this.colors = this.generateRandomColors(1000);
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
    }
  }

  public generateRandomColors(count: any) {
    let colors = [];

    for (let i = 0; i < count; i++) {
      let color = this.getRandomColor();
      colors.push(color);
    }

    return colors;
  }

  public getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  colors: string[] = [];

  palSelectedLayerList:
    | [
        {
          pal: any;
          palLayer: L.Polygon<any>;
        }
      ]
    | any = [];

  // selected pal after search
  activePal(palFromSelect: any) {
    palFromSelect.selected = !palFromSelect.selected;
    if (palFromSelect.selected) {
      const color = this.colors.pop();
      // add pal layer in list
      palFromSelect.latlngs.forEach((latlng: any) => {
        const palLayer = L.polygon(latlng, {
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
        });
        // add each location layer, then add in temp to save the layer info
        this.bossesMarkersLayer.addLayer(palLayer).addTo(this.map);
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
        this.bossesMarkersLayer.removeLayer(value.palLayer);
      });
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
    let stringLatlngs = '[';
    this.latlngs.forEach((latlng: any, index: any) => {
      stringLatlngs += `[${latlng.lat},${latlng.lng}]`;
      if (index !== this.latlngs.length - 1) {
        stringLatlngs += ',';
      }
    });
    stringLatlngs += '],';

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
