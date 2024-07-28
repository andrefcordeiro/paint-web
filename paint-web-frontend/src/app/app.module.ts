import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ModalToolPropertiesComponent } from '../app/components/canvas/modal-tool-properties/modal-tool-properties.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CaretakerService } from './services/state-management/caretaker.service';
import { ToolbarComponent } from './components/canvas/toolbar/toolbar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultiToolButtonComponent } from './components/canvas/toolbar/multi-tool-button/multi-tool-button.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { OptionsComponent } from './components/options/options.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ModalToolPropertiesComponent,
    ToolbarComponent,
    MultiToolButtonComponent,
    OptionsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    DragDropModule,
    OverlayModule,
  ],
  providers: [CaretakerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
