import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimengModule } from '../../../primeng/primeng.module';
import { ArcgisService } from '../../../common/services/arcgis.service';
import { Subscription, combineLatest, lastValueFrom } from 'rxjs';
import { CultivosService } from '../../../common/services/cultivos.service';
import { BooleanArrayPipe } from '../../../common/pipes/boolean-array.pipe';
import { CommonModule } from '@angular/common';
import { PositionMapComponent } from '../position-map/position-map.component';
import { CostosService } from '../../services/costos.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  campoValido,
  emailPattern,
  getErrorMsg,
} from '../../../common/helpers/errors';
import { ToastService } from '../../../common/services/toast.service';
import { LoadingService } from '../../../common/services/loading.service';

type Mode = 'query' | 'new' | 'edit';

@Component({
  selector: 'app-costos-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    BooleanArrayPipe,
    PositionMapComponent,
  ],
  templateUrl: './costos-form.component.html',
  styleUrl: './costos-form.component.scss',
})
export class CostosFormComponent implements OnDestroy, OnInit {
  @ViewChild('positionMap') positionMap!: PositionMapComponent;
  private arcgisSrv = inject(ArcgisService);
  private cultivosSrv = inject(CultivosService);
  private costosSrv = inject(CostosService);
  private formSubs = new Subscription();
  private departamentoSubs = new Subscription();
  private municipioSubs = new Subscription();
  private tipoPersonaSubs = new Subscription();
  private ubicacionSubs = new Subscription();
  private experienciaSubs = new Subscription();
  private seleccionadoSubs = new Subscription();

  departamentos = [];
  filteredMunicipios = [];
  municipios = [];
  filteredVeredas = [];
  veredas = [];
  cultivos = [];
  tipos_persona = ['Natural', 'Jurídica'];
  opciones_booleanas = [
    { label: 'Si', value: 1 },
    { label: 'No', value: 0 },
  ];

  mode = signal<Mode>('new');

  form: FormGroup = this.fb.group({
    cod_depto: [{ value: undefined, disabled: true }, [Validators.required]],
    cod_mpio: [{ value: undefined, disabled: true }, [Validators.required]],
    cod_vereda: [{ value: undefined, disabled: true }, []],
    nombre_unidad_obs: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    numero_unidad_obs: [
      { value: undefined, disabled: true },
      [Validators.required, Validators.min(0)],
    ],
    cultivo_objetivo: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    variedad_cultivo: [{ value: undefined, disabled: true }, []],
    area_sembrada: [
      { value: undefined, disabled: true },
      [, Validators.min(0)],
    ],
    fecha_siembra: [{ value: undefined, disabled: true }, []],
    tipo_persona: [{ value: undefined, disabled: true }, [Validators.required]],
    primer_nombre_prod: [{ value: undefined, disabled: true }, []],
    segundo_nombre_prod: [{ value: undefined, disabled: true }, []],
    primer_apellido_prod: [{ value: undefined, disabled: true }, []],
    segundo_apellido_prod: [{ value: undefined, disabled: true }, []],
    razon_social: [{ value: undefined, disabled: true }, []],
    ubicacion_finca: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    y: [{ value: undefined, disabled: true }, []],
    x: [{ value: undefined, disabled: true }, []],
    dentro_de_frontera: [{ value: undefined, disabled: true }, []],
    seleccionado_calculado: [{ value: undefined, disabled: true }, []],
    estado_seleccion: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    justificacion_seleccion: [{ value: undefined, disabled: true }, []],
    cumple_homogeneidad: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    cumple_experiencia: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    experiencia_productor: [{ value: undefined, disabled: true }, []],
    hay_registros: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    hay_disponibilidad: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    vive_en_finca: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    numero_celular: [
      { value: undefined, disabled: true },
      [Validators.required],
    ],
    email: [
      { value: undefined, disabled: true },
      [Validators.required, Validators.pattern(emailPattern)],
    ],
    fecha_vinculacion: [{ value: undefined, disabled: true }, []],
    observaciones_usuario: [{ value: undefined, disabled: true }, []],
    fecha: [{ value: new Date(), disabled: true }, []],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastSrv: ToastService,
    private loadingSrv: LoadingService
  ) {
    this.getData();

    const departamentoControl = this.getControl('cod_depto');
    const municipioControl = this.getControl('cod_mpio');
    const veredaControl = this.getControl('cod_vereda');

    const tipoPersonaControl = this.getControl('tipo_persona');
    const primerNombreControl = this.getControl('primer_nombre_prod');
    const segundoNombreControl = this.getControl('segundo_nombre_prod');
    const primerApellidoControl = this.getControl('primer_apellido_prod');
    const segundoApellidoControl = this.getControl('segundo_apellido_prod');
    const razonSocialControl = this.getControl('razon_social');

    const ubicacionFincaControl = this.getControl('ubicacion_finca');
    const latControl = this.getControl('y');
    const lngControl = this.getControl('x');
    const fronteraControl = this.getControl('dentro_de_frontera');

    const experiencia3Control = this.getControl('cumple_experiencia');
    const tiempoExperienciaControl = this.getControl('experiencia_productor');
    const seleccionadoControl = this.getControl('estado_seleccion');
    const seleccionadoCalculadoControl = this.getControl(
      'seleccionado_calculado'
    );
    const justificacionControl = this.getControl('justificacion_seleccion');

    this.seleccionadoSubs = seleccionadoControl.valueChanges.subscribe(
      (data) => {
        justificacionControl.reset(undefined);
        justificacionControl.clearValidators();

        if (!seleccionadoCalculadoControl.getRawValue()) {
          if (this.mode() !== 'query')
            if (['Seleccionado', 'Preseleccionado'].includes(data)) {
              justificacionControl.addValidators([Validators.required]);
              if (this.mode() !== 'query') {
                justificacionControl.enable();
              }
            }
        }

        justificacionControl.updateValueAndValidity({ emitEvent: false });
        seleccionadoControl.updateValueAndValidity({ emitEvent: false });
      }
    );

    this.experienciaSubs = experiencia3Control.valueChanges.subscribe(
      (data) => {
        tiempoExperienciaControl.reset(undefined);
        tiempoExperienciaControl.clearValidators();
        tiempoExperienciaControl.disable();

        if (data === 'Si') {
          tiempoExperienciaControl.addValidators([
            Validators.required,
            Validators.min(3),
          ]);
          if (this.mode() !== 'query') tiempoExperienciaControl.enable();
        }

        tiempoExperienciaControl.updateValueAndValidity({ emitEvent: false });
      }
    );

    this.ubicacionSubs = ubicacionFincaControl.valueChanges.subscribe(
      (value) => {
        latControl.reset(undefined);
        lngControl.reset(undefined);
        fronteraControl.reset(undefined);

        latControl.clearValidators();
        lngControl.clearValidators();
        fronteraControl.clearValidators();
        if (value === 'Si') {
          latControl.addValidators([Validators.required]);
          lngControl.addValidators([Validators.required]);
          fronteraControl.addValidators([Validators.required]);
        } else if (value === 'No') {
          this.form.patchValue({
            estado_seleccion: 'No seleccionado',
            seleccionado_calculado: false,
          });
        }

        latControl.updateValueAndValidity({ emitEvent: false });
        lngControl.updateValueAndValidity({ emitEvent: false });
        fronteraControl.updateValueAndValidity({ emitEvent: false });
      }
    );

    this.tipoPersonaSubs = tipoPersonaControl.valueChanges.subscribe((data) => {
      primerNombreControl.reset(undefined);
      segundoNombreControl.reset(undefined);
      primerApellidoControl.reset(undefined);
      segundoApellidoControl.reset(undefined);
      razonSocialControl.reset(undefined);

      razonSocialControl.clearValidators();
      primerNombreControl.clearValidators();
      primerApellidoControl.clearValidators();

      if (data === 'Natural') {
        primerNombreControl.addValidators([Validators.required]);
        primerApellidoControl.addValidators([Validators.required]);
      } else if (data === 'Jurídica') {
        razonSocialControl.addValidators([Validators.required]);
      }

      primerNombreControl.updateValueAndValidity({ emitEvent: true });
      segundoNombreControl.updateValueAndValidity({ emitEvent: true });
      primerApellidoControl.updateValueAndValidity({ emitEvent: true });
      segundoApellidoControl.updateValueAndValidity({ emitEvent: true });
      razonSocialControl.updateValueAndValidity({ emitEvent: true });
    });

    this.departamentoSubs = departamentoControl.valueChanges.subscribe(() => {
      municipioControl.reset(undefined);
    });

    this.municipioSubs = municipioControl.valueChanges.subscribe(() => {
      veredaControl.reset(undefined);
    });

    this.formSubs = this.form.valueChanges.subscribe(async (data) => {
      const { cod_depto, cod_mpio, y, x } = data;

      if (cod_depto) {
        if (this.mode() !== 'query')
          municipioControl.enable({ emitEvent: false });

        const municipiosResponse = await lastValueFrom(
          this.arcgisSrv.query({
            url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/referencia_geografica/municipios_generalizada/MapServer/0',
            queryParams: {
              where: `cod_depart = '${cod_depto}'`,
            },
          })
        );
        this.filteredMunicipios = municipiosResponse.sort((a: any, b: any) => {
          return a.municipio.trim().localeCompare(b.municipio.trim());
        });

        // this.filteredMunicipios = this.municipios.filter(
        //   (municipio: any) => municipio.cod_depart == cod_depto
        // );
      } else {
        municipioControl.disable({ emitEvent: false });
        this.filteredMunicipios = [];
      }

      if (cod_depto && cod_mpio) {
        if (this.mode() !== 'query') veredaControl.enable({ emitEvent: false });

        const veredasResponse = await lastValueFrom(
          this.arcgisSrv.query({
            url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/referencia_geografica/veredas_provincias/MapServer/0',
            queryParams: {
              where: `dptompio = '${cod_mpio}'`,
            },
          })
        );
        this.filteredVeredas = veredasResponse.sort((a: any, b: any) => {
          return a.nombre_ver.trim().localeCompare(b.nombre_ver.trim());
        });
      } else {
        veredaControl.disable({ emitEvent: false });
        this.filteredVeredas = [];
      }

      if (y && x) {
        const latlng = [y, x] as [number, number];

        if (this.positionMap) this.positionMap.setPosition(latlng);

        if (fronteraControl.getRawValue() === null) {
          this.getFronteraAgricola();
        }
      }

      municipioControl.updateValueAndValidity({ emitEvent: false });
      veredaControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {
    const { params } = this.activatedRoute.snapshot;
    const { id } = params;

    if (id) {
      this.mode.set('query');

      this.costosSrv.getById(id).subscribe({
        next: (costo) => {
          this.setFormValues(costo);
        },
        error: (error) => {
          console.log(error);
          this.toastSrv.error('No se pudo consultar el productor');
          this.router.navigate(['./admin']);
        },
      });

      if (this.activatedRoute.routeConfig?.path?.includes('edit')) {
        this.mode.set('edit');
        this.enableFormFields();
      }
    } else {
      this.enableFormFields();
    }
  }

  ngOnDestroy(): void {
    this.formSubs.unsubscribe();
    this.departamentoSubs.unsubscribe();
    this.municipioSubs.unsubscribe();
    this.tipoPersonaSubs.unsubscribe();
    this.ubicacionSubs.unsubscribe();
    this.experienciaSubs.unsubscribe();
    this.seleccionadoSubs.unsubscribe();
  }

  getFronteraAgricola() {
    const { y, x } = this.form.getRawValue();

    const subscription = this.arcgisSrv
      .query({
        url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/ordenamiento_productivo/frontera_agricola/MapServer/0',
        queryParams: {
          geometryType: 'esriGeometryPoint',
          spatialRel: 'esriSpatialRelIntersects',
          inSR: 4326,
          geometry: [x, y].join(','),
        },
      })
      .subscribe({
        next: (features) => {
          if (features.length) {
            this.form.patchValue(
              {
                dentro_de_frontera: 'Si',
                estado_seleccion: 'Seleccionado',
                seleccionado_calculado: true,
              },
              { emitEvent: true }
            );
          } else {
            this.form.patchValue(
              {
                dentro_de_frontera: 'No',
                estado_seleccion: 'No seleccionado',
                seleccionado_calculado: false,
              },
              { emitEvent: true }
            );
          }
          subscription.unsubscribe();
        },
        error: () => {
          console.error('Error al consultar frontera agrícola');
          this.form.patchValue(
            {
              dentro_de_frontera: undefined,
              estado_seleccion: 'No seleccionado',
              seleccionado_calculado: false,
            },
            { emitEvent: false }
          );
          subscription.unsubscribe();
        },
      });
  }

  enableFormFields() {
    const fields = [
      'cod_depto',
      'nombre_unidad_obs',
      'numero_unidad_obs',
      'cultivo_objetivo',
      'variedad_cultivo',
      'area_sembrada',
      'fecha_siembra',
      'tipo_persona',
      'primer_nombre_prod',
      'segundo_nombre_prod',
      'primer_apellido_prod',
      'segundo_apellido_prod',
      'razon_social',
      'ubicacion_finca',
      'y',
      'x',
      'cumple_homogeneidad',
      'cumple_experiencia',
      'hay_registros',
      'hay_disponibilidad',
      'vive_en_finca',
      'numero_celular',
      'email',
      'fecha_vinculacion',
      'observaciones_usuario',
      'fecha',
      'estado_seleccion',
    ];
    fields.forEach((field) => {
      this.form.get(field)!.enable();
    });
  }

  setFormValues(costo: any) {
    const {
      x,
      y,
      cultivo_objetivo,
      fecha,
      fecha_siembra,
      fecha_vinculacion,
      estado_seleccion,
      experiencia_productor,
      justificacion_seleccion,
      ...rest
    } = costo;

    this.form.patchValue(
      {
        ...rest,
        cultivo_objetivo: JSON.parse(cultivo_objetivo),
        fecha: fecha ? new Date(fecha) : undefined,
        fecha_siembra: fecha_siembra ? new Date(fecha_siembra) : undefined,
        fecha_vinculacion: fecha_vinculacion
          ? new Date(fecha_vinculacion)
          : undefined,
      },
      { emitEvent: true }
    );
    setTimeout(() => {
      if (this.positionMap) this.positionMap.setPosition([y, x]);
      this.form.patchValue(
        {
          x,
          y,
          experiencia_productor,
          estado_seleccion,
          justificacion_seleccion,
        },
        { emitEvent: false }
      );
    }, 500);
  }

  getControl(control: string) {
    return this.form.get(control)!;
  }

  getData() {
    const keyInstance = this.loadingSrv.loadingInstance();
    const subscription = combineLatest([
      this.arcgisSrv.query({
        url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/referencia_geografica/departamentos_generalizada/MapServer/0',
      }),
      this.arcgisSrv.query({
        url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/referencia_geografica/municipios_generalizada/MapServer/0',
      }),
      this.arcgisSrv.query({
        url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/referencia_geografica/veredas_provincias/MapServer/0',
      }),
      this.cultivosSrv.getCultivos(),
    ]).subscribe({
      next: ([departamentos, municipios, veredas, cultivos]: any) => {
        this.departamentos = departamentos.sort((a: any, b: any) => {
          return a.nombre.trim().localeCompare(b.nombre.trim());
        });
        this.municipios = municipios.sort((a: any, b: any) => {
          return a.municipio.trim().localeCompare(b.municipio.trim());
        });
        this.veredas = veredas.sort((a: any, b: any) => {
          return a.nombre_ver.trim().localeCompare(b.nombre_ver.trim());
        });
        this.cultivos = cultivos;

        this.loadingSrv.loadingInstance(keyInstance);
        subscription.unsubscribe();
      },
      error: (e) => {
        this.toastSrv.error(
          'Error al cargar información de listados desplegables'
        );
        this.loadingSrv.loadingInstance(keyInstance);
        subscription.unsubscribe();
      },
    });
  }

  formValues(objectid: number | undefined = undefined) {
    const {
      x,
      y,
      numero_celular,
      seleccionado_calculado,
      fecha,
      ubicacion_finca,
      fecha_siembra,
      fecha_vinculacion,
      ...attributes
    } = this.form.getRawValue();
    const feature = {
      attributes: {
        ...attributes,
        numero_celular: numero_celular.replaceAll(' ', ''),
        fecha: fecha ? new Date(fecha).getTime() : null,
        fecha_siembra: fecha_siembra ? new Date(fecha_siembra).getTime() : null,
        fecha_vinculacion: fecha_vinculacion
          ? new Date(fecha_vinculacion).getTime()
          : null,
      },
      geometry: { x: x || null, y: y || null },
    };

    if (objectid) {
      feature.attributes.ObjectId = objectid;
    }

    return feature;
  }

  save() {
    const feature = this.formValues();
    this.costosSrv.create(feature);
  }

  edit() {
    const { params } = this.activatedRoute.snapshot;
    const { id } = params;

    const feature = this.formValues(JSON.parse(id));
    this.costosSrv.update(feature);
  }

  reset() {
    this.form.reset();
  }

  back() {
    this.router.navigate(['admin/productor-list']);
  }

  setLatLng(latlng: [number, number]) {
    const [lat, lng] = latlng;
    if (lat && lng) {
      this.form.patchValue({ y: lat, x: lng });

      if (!this.getControl('justificacion_seleccion').getRawValue())
        this.getFronteraAgricola();
    } else {
      this.form.patchValue({ y: undefined, x: undefined });
    }
  }

  getCampoValido(field: string) {
    return campoValido(this.form, field);
  }

  getErrMsg(field: string) {
    return getErrorMsg(this.form, field);
  }
}
