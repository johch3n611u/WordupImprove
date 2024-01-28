// https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet
// https://dowyuu.github.io/program/2021/03/22/Leaflet-note/
// https://gamewith.net/palworld/43313

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

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    const bounds = L.latLngBounds(
      this.markers.map((marker) => marker.getLatLng())
    );

    // Fit the map view to the bounds
    this.map.fitBounds(bounds);
  }

  bossesMarkersLayer = L.layerGroup();

  currentLat = 0;
  currentLng = 0;
  private onMouseClick() {
    this.map.on('click', (mapClick: L.LeafletMouseEvent) => {
      this.currentLat = mapClick.latlng.lat;
      this.currentLng = mapClick.latlng.lng;
      let marker = L.marker([
        mapClick.latlng.lat, 
        mapClick.latlng.lng
      ]).on('click', (markerClick) => {
        markerClick.target.remove();
      });

      this.bossesMarkersLayer.addLayer(marker).addTo(this.map);

      console.log(this.map)
    });
  }

  private initPalWorldMap(): void {
    this.map = L.map('map', {
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
  }

  ngAfterViewInit(): void {
    this.initPalWorldMap();
    this.onMouseClick();
  }
}
