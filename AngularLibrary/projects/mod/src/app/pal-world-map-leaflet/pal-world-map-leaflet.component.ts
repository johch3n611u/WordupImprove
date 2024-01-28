// https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet
// https://dowyuu.github.io/program/2021/03/22/Leaflet-note/
// https://gamewith.net/palworld/43313
// https://jsfiddle.net/newluck77/rk9v0uyo/

import { AfterViewInit, Component, HostListener } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'mod-pal-world-map-leaflet',
  templateUrl: `./pal-world-map-leaflet.component.html`,
  styleUrls: ['./pal-world-map-leaflet.component.scss'],
})
export class PalWorldMapLeafletComponent implements AfterViewInit {
  private map: any;
  markers: L.Marker<L.LatLng>[] = [];

  // private initRealMap(): void {
  //   const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  //   this.map = L.map('map');
  //   L.tileLayer(baseMapURl).addTo(this.map);
  // }

  // @HostListener('mousemove') onMouseMove(e: any)
  // {
  //   console.log(e);
  //   let latLng = e.latlng;
  // }

  public generateIcon() {
    return L.icon({
      iconUrl: './assets/palworld/main_pins/10001.png',
      iconSize: [30, 30], // icon 寬, 長
      shadowSize: [50, 64], // 陰影 寬, 長
      iconAnchor: [5, 5], // icon 中心偏移
      shadowAnchor: [4, 62], // 陰影 中心偏移
      popupAnchor: [-3, -76], // 綁定popup 中心偏移
    });
  }

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    const bounds = L.latLngBounds(
      this.markers.map((marker) => marker.getLatLng())
    );

    // Fit the map view to the bounds
    this.map.fitBounds(bounds);
  }

  markersLayer = L.layerGroup();
  bossesMarkersLayer = L.layerGroup();
  baseLayers = {
    '開放街圖': this.markersLayer,
    '臺灣通用電子地圖': this.markersLayer
  };
  overlays = {
    '地標': this.bossesMarkersLayer
  };

  currentLat = 0;
  currentLng = 0;
  private onMouseClick() {
    this.map.on('click', (mapClick: L.LeafletMouseEvent) => {
      this.currentLat = mapClick.latlng.lat;
      this.currentLng = mapClick.latlng.lng;
      let marker = L.marker([mapClick.latlng.lat, mapClick.latlng.lng], {
        icon: this.generateIcon(),
      }).on('click', (markerClick) => {
        this.bossesMarkersLayer.removeLayer(marker);
      });
      this.bossesMarkersLayer.addLayer(marker).addTo(this.map);

      console.log(this.bossesMarkersLayer.getLayers());
    });
  }

  private initPalWorldMap(): void {
    this.map = L.map('map', {
      layers: [
        this.markersLayer
      ],
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

    L.control.layers(
      this.baseLayers,
      this.overlays
    ).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initPalWorldMap();
    this.onMouseClick();
  }
}
