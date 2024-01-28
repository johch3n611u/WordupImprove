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

  public generateIcon() {
    return L.icon({
      iconUrl: './assets/palworld/main_pins/10001.png',
      iconSize:     [30, 30], // icon 寬, 長
      shadowSize:   [50, 64], // 陰影 寬, 長
      iconAnchor:   [5, 5], // icon 中心偏移
      shadowAnchor: [4, 62],  // 陰影 中心偏移
      popupAnchor:  [-3, -76] // 綁定popup 中心偏移
  });
  }

  public addMarkers() {
    // Add your markers to the map
    this.markers.forEach((marker, index) => marker.addTo(this.map).on('click', (e) => { e.target.remove(); this.markers.splice(index,1)}));
  }
  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    const bounds = L.latLngBounds(
      this.markers.map((marker) => marker.getLatLng())
    );

    // Fit the map view to the bounds
    this.map.fitBounds(bounds);
  }

  //
  // private initRealMap(): void {
  //   const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  //   this.map = L.map('map');
  //   L.tileLayer(baseMapURl).addTo(this.map);
  // }

  markerAry = <any>[];
  currentLat = 0;
  currentLng = 0;
  private onMousemove() {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      console.log(e.latlng);
      this.currentLat = e.latlng.lat;
      this.currentLng = e.latlng.lng;
      const marker = L.marker([e.latlng.lat, e.latlng.lng],{icon: this.generateIcon()})
      this.markers.push(marker);
    });
  }

  // @HostListener('mousemove') onMouseMove(e: any)
  // {
  //   console.log(e);
  //   let latLng = e.latlng;
  // }
  private initPalWorldMap(): void {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
    });

    let corner1 = L.latLng(0, 0);
    var corner2 = L.latLng(1000, 1000);
    let bounds = L.latLngBounds(corner1, corner2);
    let image = L.imageOverlay('./assets/palworld/palpagos_islands.webp', bounds).addTo(
      this.map
    );
    this.map.fitBounds(bounds);
  }

  ngAfterViewInit(): void {
    this.initPalWorldMap();
    console.log(this.map);
    this.onMousemove();
  }

  // https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet
}
