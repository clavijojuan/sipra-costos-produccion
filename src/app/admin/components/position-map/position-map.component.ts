import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';

import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-position-map',
  standalone: true,
  imports: [],
  templateUrl: './position-map.component.html',
  styleUrl: './position-map.component.scss',
})
export class PositionMapComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @Input() autoLocation: boolean = true;
  @Input() disabled: boolean = false;
  @Output() onLocate: EventEmitter<[number, number]> = new EventEmitter();
  private map!: maplibregl.Map;
  private marker = new maplibregl.Marker({ draggable: true });
  private locationControl!: maplibregl.GeolocateControl;

  ngOnDestroy() {
    this.map.remove();
  }

  ngOnChanges(changes: SimpleChanges) {
    const { disabled } = changes;
    this.marker.setDraggable(!disabled.currentValue);
  }

  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [-74.297333, 4.570868],
      zoom: 3.5,
    });

    this.locationControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
      showUserLocation: false,
    });

    this.locationControl.on('geolocate', (e) => {
      const { latitude, longitude } = e.coords;
      this.onLocate.emit([latitude, longitude]);
      this.locationControl._finish();

      if (this.disabled) {
        this.map.removeControl(this.locationControl);
      }
    });

    this.marker.on('dragend', (e) => {
      const { lat, lng } = this.marker.getLngLat();
      this.onLocate.emit([lat, lng]);
    });

    this.map.addControl(this.locationControl);

    if (this.autoLocation) {
      this.map.on('load', () => {
        this.locationControl.trigger();
      });
    }
  }

  setPosition(latlng: [number, number]) {
    const [lat, lng] = latlng;
    if (lat && lng && typeof lat === 'number' && typeof lng === 'number') {
      this.marker.setLngLat([lng, lat]);

      if (!this.marker._map) {
        this.marker.addTo(this.map);
      }

      this.map.flyTo({
        center: this.marker.getLngLat(),
        zoom: 15,
        essential: true,
      });
    } else {
      this.marker.remove();
    }
  }
}
