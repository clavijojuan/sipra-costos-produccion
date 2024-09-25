import { Injectable, signal } from '@angular/core';
import moment from 'moment';
import { map, of, tap } from 'rxjs';
import { ArcgisService } from '../../common/services/arcgis.service';
import { ToastService } from '../../common/services/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../common/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class CostosService {
  costos = signal([]);

  constructor(
    private arcgisSrv: ArcgisService,
    private toastSrv: ToastService,
    private router: Router,
    private loadingSrv: LoadingService
  ) {}

  getById(id: number) {
    return this.arcgisSrv
      .query({
        path: 'costos_produccion/caracterizacion/FeatureServer/0',
        withToken: true,
        queryParams: {
          where: `objectid=${id}`,
          returnGeometry: true,
        },
      })
      .pipe(
        map((response) => {
          const { attributes, geometry } = response[0];

          if (geometry?.x && geometry?.y) {
            const { x, y } = geometry;
            let obj;
            if (!Number.isNaN(Number(x)) && !Number.isNaN(Number(y))) {
              obj = {
                x,
                y,
                ubicacion_finca: 'Si',
              };
            } else {
              obj = {
                x: undefined,
                y: undefined,
                ubicacion_finca: 'No',
              };
            }

            Object.assign(attributes, obj);
          }

          return attributes;
        })
      );
  }

  query() {
    if (this.costos().length) return of(this.costos());

    return this.arcgisSrv
      .query({
        path: 'costos_produccion/caracterizacion/FeatureServer/0',
        withToken: true,
        queryParams: {
          returnGeometry: true,
        },
      })
      .pipe(
        tap((response) => {
          const data = response.map((feature: any) => ({
            ...feature.attributes,
            ...feature.geometry,
          }));
          this.costos.set(data);
        })
      );
  }

  create(feature: any) {
    const keyInstance = this.loadingSrv.loadingInstance();

    return this.arcgisSrv
      .addFeatures({
        features: [feature],
        path: 'costos_produccion/caracterizacion/FeatureServer/0',
      })
      .then((result) => {
        this.toastSrv.success('Productor guardado correctamente');
        this.costos.set([]);
        this.router.navigate(['admin/productor-list']);
        this.loadingSrv.loadingInstance(keyInstance);
      })
      .catch((error) => {
        this.toastSrv.error('Error al guardar el productor');
        this.loadingSrv.loadingInstance(keyInstance);
      });
  }

  update(feature: any) {
    const keyInstance = this.loadingSrv.loadingInstance();

    return this.arcgisSrv
      .updateFeatures({
        features: [feature],
        path: 'costos_produccion/caracterizacion/FeatureServer/0',
      })
      .then((result) => {
        this.toastSrv.success('Productor actualizado correctamente');
        this.costos.set([]);
        this.router.navigate(['admin/productor-list']);
        this.loadingSrv.loadingInstance(keyInstance);
      })
      .catch((error) => {
        this.toastSrv.error('Error al actualizar el productor');
        this.loadingSrv.loadingInstance(keyInstance);
      });
  }

  delete(objectid: string) {
    const keyInstance = this.loadingSrv.loadingInstance();

    return this.arcgisSrv
      .deleteFeatures({
        objectIds: [objectid],
        path: 'costos_produccion/caracterizacion/FeatureServer/0',
      })
      .then((result) => {
        this.toastSrv.success('Productor borrado correctamente');
        this.costos.set([]);
        this.loadingSrv.loadingInstance(keyInstance);
      })
      .catch((error) => {
        this.toastSrv.error('Error al borrar el productor');
        this.loadingSrv.loadingInstance(keyInstance);
      });
  }

  filter(keyword: string = '') {
    if (!keyword) return this.costos();

    keyword = keyword.toLowerCase();

    return this.costos().filter((costo: any) => {
      const {
        departamento = '',
        municipio = '',
        primer_nombre_prod = '',
        primer_apellido_prod = '',
        nombre_unidad_obs = '',
        cultivoLabel = '',
        fecha_vinculacion = '',
        fecha = '',
        estado_seleccion = '',
      } = costo;

      if (
        departamento?.toLowerCase().includes(keyword) ||
        municipio?.toLowerCase().includes(keyword) ||
        nombre_unidad_obs?.toLowerCase().includes(keyword) ||
        cultivoLabel?.toLowerCase().includes(keyword) ||
        primer_nombre_prod?.toLowerCase().includes(keyword) ||
        primer_apellido_prod?.toLowerCase().includes(keyword) ||
        estado_seleccion?.toLowerCase().includes(keyword) ||
        moment(fecha).format('lll').toLowerCase().includes(keyword) ||
        moment(fecha_vinculacion).format('lll').toLowerCase().includes(keyword)
      ) {
        return true;
      } else return false;
    });
  }
}
