import { NgModule } from '@angular/core';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@NgModule({
  exports: [
    AutoCompleteModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    CheckboxModule,
    SelectButtonModule,
    InputMaskModule,
    InputTextareaModule,
    ButtonModule,
    ScrollPanelModule,
  ],
})
export class PrimengModule {}
