import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from "@angular/core";
import { GeocodingService } from "./location.service";
import {
  latLng,
  tileLayer,
  marker,
  Map as LeafletMap,
  map as leafletMap,
  Marker,
  TileLayer,
} from "leaflet";

@Component({
  selector: "app-location-card",
  imports: [],
  template: `<div class="location-map" #mapContainer></div>`,
  styles: [
    `
      :host,
      .location-map {
        height: 400px;
      }
    `,
  ],
})
export class LocationCardComponent {
  private readonly mapContainer = viewChild("mapContainer", {
    read: ElementRef,
  });
  private readonly defaultCenter = latLng(32.3040272, 34.8620134);
  private readonly defaultZoom = 8;

  readonly coordinates = input<{ lat: number; lng: number }[]>([]);
  readonly center = input(this.defaultCenter);
  readonly zoom = input(this.defaultZoom);

  private map: LeafletMap | null = null;

  // coordinates: { lat: number; lng: number }[] = [
  //   { lat: 32.0853, lng: 34.7818 }, // Tel Aviv
  //   { lat: 31.7683, lng: 35.2137 }, // Jerusalem
  //   { lat: 32.794, lng: 34.9896 }, // Haifa
  //   { lat: 31.252, lng: 34.7915 }, // Be’er Sheva
  //   { lat: 32.3215, lng: 34.8532 }, // Netanya
  //   { lat: 31.8948, lng: 34.8113 }, // Ashdod
  //   { lat: 32.0171, lng: 34.7454 }, // Holon
  //   { lat: 31.0461, lng: 34.8516 }, // Dimona
  //   { lat: 29.5581, lng: 34.9482 }, // Eilat
  //   { lat: 32.1872, lng: 34.8706 }, // Herzliya
  // ];
  constructor() {
    effect(() => {
      const el = this.mapContainer();
      if (!el || this.map) return;

      this.map = leafletMap(el.nativeElement).setView(
        this.center(),
        this.zoom()
      );

      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);

      const points: Marker[] = this.coordinates().map(({ lat, lng }) =>
        marker([lat, lng])
      );

      points.forEach((point) => point.addTo(this.map!));
    });
  }
}
