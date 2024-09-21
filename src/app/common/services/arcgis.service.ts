import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ArcgisService {
  private baseUrl = environment.arcgisUrl + '/arcgis';
  arcgisToken: string = '';

  private baseParams = {
    where: '1=1',
    outFields: '*',
    returnGeometry: false,
    f: 'json',
    orderByFields: 'objectid ASC',
  };

  constructor(private http: HttpClient, private toastSrv: ToastService) {}

  login(data: { username: string; password: string }) {
    return this.http
      .get(`${this.baseUrl}/tokens/generateToken`, {
        params: data,
        responseType: 'text',
      })
      .pipe(
        tap((response: string) => {
          this.arcgisToken = response;
          localStorage.setItem('token', response);
        }),
        catchError((e: any) => {
          this.toastSrv.error('Error al cargar los productores');
          return of(null);
        })
      );
  }

  query({
    url,
    path,
    queryParams = {},
    withToken = false,
  }: {
    url?: string;
    path?: string;
    queryParams?: any;
    withToken?: boolean;
  }) {
    if (withToken) {
      Object.assign(queryParams, { token: this.arcgisToken });
    }

    const params = new HttpParams({
      fromObject: { ...this.baseParams, ...queryParams },
    });

    const urlToQuery = url
      ? url + '/query'
      : `${this.baseUrl}/rest/services/${path}/query`;

    return this.http.get(urlToQuery, { params }).pipe(
      map((response: any) =>
        response.features.map((feature: any) => {
          if (
            params.get('returnGeometry') &&
            JSON.parse(params.get('returnGeometry')!)
          ) {
            return feature;
          }

          return feature.attributes;
        })
      )
    );
  }

  addFeatures({
    url,
    path,
    features,
  }: {
    url?: string;
    path?: string;
    features: any;
  }) {
    const urlToAddFeatures = url
      ? url + '/addFeatures'
      : `${this.baseUrl}/rest/services/${path}/addFeatures`;

    const urlencoded = new URLSearchParams();
    urlencoded.append('features', JSON.stringify(features));
    urlencoded.append('gdbVersion', '');
    urlencoded.append('rollbackOnFailure', 'true');
    urlencoded.append('f', 'json');

    const requestOptions = {
      method: 'POST',
      body: urlencoded,
    };

    return fetch(
      `${urlToAddFeatures}?token=${this.arcgisToken}`,
      requestOptions
    ).then((response) => response.json());
  }

  updateFeatures({
    url,
    path,
    features,
  }: {
    url?: string;
    path?: string;
    features: any;
  }) {
    const urlToUpdateFeatures = url
      ? url + '/updateFeatures'
      : `${this.baseUrl}/rest/services/${path}/updateFeatures`;

    const urlencoded = new URLSearchParams();
    urlencoded.append('features', JSON.stringify(features));
    urlencoded.append('gdbVersion', '');
    urlencoded.append('rollbackOnFailure', 'true');
    urlencoded.append('f', 'json');

    const requestOptions = {
      method: 'POST',
      body: urlencoded,
    };

    return fetch(
      `${urlToUpdateFeatures}?token=${this.arcgisToken}`,
      requestOptions
    ).then((response) => response.json());
  }

  deleteFeatures({
    url,
    path,
    objectIds,
  }: {
    url?: string;
    path?: string;
    objectIds: string[];
  }) {
    const urlToUpdateFeatures = url
      ? url + '/deleteFeatures'
      : `${this.baseUrl}/rest/services/${path}/deleteFeatures`;

    const urlencoded = new URLSearchParams();
    urlencoded.append('objectIds', objectIds.join(','));
    urlencoded.append('gdbVersion', '');
    urlencoded.append('rollbackOnFailure', 'true');
    urlencoded.append('f', 'json');

    const requestOptions = {
      method: 'POST',
      body: urlencoded,
    };

    return fetch(
      `${urlToUpdateFeatures}?token=${this.arcgisToken}`,
      requestOptions
    ).then((response) => response.json());
  }
}
