import { Component, OnDestroy } from '@angular/core';
import { TablasComponent } from '../../../common/tablas/tablas.component';
import { Router } from '@angular/router';
import { CostosService } from '../../services/costos.service';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../../primeng/primeng.module';
import * as XLSX from 'xlsx';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, lastValueFrom, Subscription, switchMap } from 'rxjs';
import { ArcgisService } from '../../../common/services/arcgis.service';
import { ToastService } from '../../../common/services/toast.service';
import { CultivosService } from '../../../common/services/cultivos.service';
import { LoadingService } from '../../../common/services/loading.service';
import moment from 'moment';

@Component({
  selector: 'app-costos-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TablasComponent, PrimengModule],
  templateUrl: './costos-list.component.html',
  styleUrl: './costos-list.component.scss',
})
export class CostosListComponent implements OnDestroy {
  filterSubscription: Subscription = new Subscription();
  filterControl = this.fb.control('');

  private departamentos: any = [];
  private municipios: any = [];
  private cultivos: any = [];

  titulos: any[] = [
    {
      clave: 'objectid',
      alias: 'Id',
      alinear: 'centrado',
    },
    {
      clave: 'departamento',
      alias: 'Departamento',
      alinear: 'centrado',
    },
    {
      clave: 'municipio',
      alias: 'Municipio',
      alinear: 'centrado',
    },
    {
      clave: 'nombre_productor',
      alias: 'Nombre productor',
      alinear: 'centrado',
    },
    {
      clave: 'nombre_unidad_obs',
      alias: 'Unidad de observación',
      alinear: 'centrado',
    },
    {
      clave: 'cultivoLabel',
      alias: 'Cultivo',
      alinear: 'centrado',
    },
    {
      clave: 'fecha_vinculacion',
      alias: 'Fecha vinculación',
      alinear: 'centrado',
      tipo: 'date',
    },

    {
      clave: 'fecha',
      alias: 'Fecha',
      alinear: 'centrado',
      tipo: 'date',
    },
    {
      clave: 'estado_seleccion',
      alias: 'Estado',
      alinear: 'centrado',
    },
  ];
  datos: any = [];

  constructor(
    private router: Router,
    private costosSrv: CostosService,
    private fb: FormBuilder,
    private arcgisSrv: ArcgisService,
    private toastSrv: ToastService,
    private loadingSrv: LoadingService,
    private cultivosSrv: CultivosService
  ) {
    this.getDomains();

    this.filterSubscription = this.filterControl.valueChanges.subscribe(
      (value: any) => {
        this.datos = this.costosSrv.filter(value);
      }
    );
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  organizeData() {
    this.datos = this.costosSrv.costos().map((costo: any) => {
      const {
        primer_nombre_prod,
        primer_apellido_prod,
        cultivo_objetivo,
        cod_depto,
        cod_mpio,
      } = costo;
      const nombre_productor = [primer_nombre_prod, primer_apellido_prod].join(
        ' '
      );

      const { nombre: departamento = '' } =
        this.departamentos.find(
          (departamento: any) => departamento.cod_depart == cod_depto
        ) || {};
      const { municipio = '' } =
        this.municipios.find(
          (municipio: any) => municipio.cod_dane_mpio == cod_mpio
        ) || {};
      const { cultivo: cultivoLabel = '' } =
        this.cultivos.find(
          (cultivo: any) => cultivo.codigo == cultivo_objetivo
        ) || {};

      Object.assign(costo, {
        nombre_productor,
        cultivoLabel,
        departamento,
        municipio,
      });

      return costo;
    });
  }

  goToForm() {
    this.router.navigate(['admin/productor']);
  }

  async downloadAsXlsx() {
    const keyInstance = this.loadingSrv.loadingInstance();

    const header = [
      [
        'Código',
        'Código departamento',
        'Departamento',
        'Código municipio',
        'Municipio',
        'Código vereda',
        'Vereda',
        'Nombre unidad de observación',
        'Número  de unidades de observación',
        'Cultivo objetivo',
        'Variedad del cultivo',
        'Área sembrada',
        'Tipo de persona',
        'Primer nombre productor',
        'Segundo nombre productor',
        'Primer apellido productor',
        'Segundo apellido productor',
        'Razón social',
        'Tiene ubicación de la finca',
        'Latitud',
        'Longitud',
        'Se encuentra en frontera agricola',
        'Seleccionado',
        'Justificación selección',
        'Homogeneidad Variables Agroecológicas',
        'Experiencia productor ≥ 3 Años',
        'Tiempo de experiencia',
        'Manejo de registros',
        'Disponibilidad de tiempo y conectividad',
        'Vive en la finca',
        'Teléfono contacto',
        'Email',
        'Observaciones',
        'Fecha',
        'Fecha finalización de cosecha',
        'Fecha inicialización de cosecha',
        'Fecha de siembra',
        'Fecha de vinculación',
      ],
    ];

    const datos = [];

    for (const dato of this.datos) {
      const {
        objectid,
        fecha,
        fecha_final_cosecha,
        fecha_inicial_cosecha,
        fecha_siembra,
        fecha_vinculacion,
        // created_date,
        // last_edited_date,
        cod_depto,
        cod_mpio,
        cod_vereda,
        nombre,
        nombre_unidad_obs,
        numero_unidad_obs,
        cultivo_objetivo,
        variedad_cultivo,
        area_sembrada,
        tipo_persona,
        primer_nombre_prod,
        segundo_nombre_prod,
        primer_apellido_prod,
        segundo_apellido_prod,
        razon_social,
        ubicacion_finca,
        y,
        x,
        dentro_de_frontera,
        // seleccionado_calculado,
        estado_seleccion,
        justificacion_seleccion,
        cumple_homogeneidad,
        cumple_experiencia,
        experiencia_productor,
        hay_registros,
        hay_disponibilidad,
        vive_en_finca,
        numero_celular,
        email,
        observaciones_usuario,
        // ...rest
      } = dato;

      const vereda = await lastValueFrom(
        this.arcgisSrv.query({
          url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/referencia_geografica/veredas_provincias/MapServer/0',
          queryParams: {
            where: `codigo_ver='${cod_vereda}'`,
            outFields: 'nombre_ver',
          },
        })
      );

      const row = {
        objectid,
        cod_depto,
        departamento: this.departamentos.find(
          (departamento: any) => departamento.cod_depart === cod_depto
        )?.nombre,
        cod_mpio,
        municipio: this.municipios.find(
          (municipio: any) => municipio.cod_dane_mpio === cod_mpio
        )?.municipio,
        cod_vereda,
        vereda: vereda[0]?.nombre_ver,
        nombre_unidad_obs,
        numero_unidad_obs,
        cultivo_objetivo: this.cultivos.find(
          (cultivo: any) => cultivo.codigo == cultivo_objetivo
        )?.cultivo,
        variedad_cultivo,
        area_sembrada,
        tipo_persona,
        primer_nombre_prod,
        segundo_nombre_prod,
        primer_apellido_prod,
        segundo_apellido_prod,
        razon_social,
        ubicacion_finca,
        y,
        x,
        dentro_de_frontera,
        // seleccionado_calculado,
        estado_seleccion,
        justificacion_seleccion,
        cumple_homogeneidad,
        cumple_experiencia,
        experiencia_productor,
        hay_registros,
        hay_disponibilidad,
        vive_en_finca,
        numero_celular,
        email,
        observaciones_usuario,
        fecha: fecha ? moment(fecha).format('DD/MM/YYYY') : undefined,
        fecha_final_cosecha: fecha_final_cosecha
          ? moment(fecha_final_cosecha).format('DD/MM/YYYY')
          : undefined,
        fecha_inicial_cosecha: fecha_inicial_cosecha
          ? moment(fecha_inicial_cosecha).format('DD/MM/YYYY')
          : undefined,
        fecha_siembra: fecha_siembra
          ? moment(fecha_siembra).format('DD/MM/YYYY')
          : undefined,
        fecha_vinculacion: fecha_vinculacion
          ? moment(fecha_vinculacion).format('DD/MM/YYYY')
          : undefined,
      };
      datos.push(row);
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'productores');
    XLSX.utils.sheet_add_aoa(worksheet, header, { origin: 'A1' });
    XLSX.writeFileXLSX(workbook, `productores.xlsx`);

    this.loadingSrv.loadingInstance(keyInstance);
  }

  getDomains() {
    const keyInstance = this.loadingSrv.loadingInstance();
    const subscription = combineLatest([
      this.arcgisSrv.query({
        url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/referencia_geografica/departamentos_generalizada/MapServer/0',
      }),
      this.arcgisSrv.query({
        url: 'https://geoservicios.upra.gov.co/arcgis/rest/services/referencia_geografica/municipios_generalizada/MapServer/0',
      }),
      this.cultivosSrv.getCultivos(),
    ]).subscribe({
      next: ([departamentos, municipios, cultivos]: any) => {
        this.departamentos = departamentos;
        this.municipios = municipios;
        this.cultivos = cultivos;

        this.loadingSrv.loadingInstance(keyInstance);
        subscription.unsubscribe();

        this.getData();
      },
      error: (e) => {
        this.toastSrv.error('Error al cargar dominios');
        this.loadingSrv.loadingInstance(keyInstance);
        subscription.unsubscribe();
      },
    });
  }

  getData() {
    const subscription = this.arcgisSrv
      .login({ username: 'ejbayonad', password: 'ejbayonad$2024#.#' })
      .pipe(switchMap((response) => this.costosSrv.query()))
      .subscribe({
        next: (data) => {
          this.organizeData();
          subscription.unsubscribe();
        },
        error: () => {
          this.toastSrv.error('Error al cargar los productores');
          subscription.unsubscribe();
        },
      });
  }

  editar(id: string): void {
    this.router.navigate([`admin/productor/${id}/edit`]);
  }

  consultar(id: string) {
    this.router.navigate([`admin/productor/${id}`]);
  }

  eliminar(id: string) {
    this.costosSrv.delete(id).then(() => this.getData());
  }
}
