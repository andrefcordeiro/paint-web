import { NgModule } from "@angular/core";
import { CanvasComponent } from "./canvas/canvas.component";
import { ModalToolPropertiesComponent } from "./canvas/modal-tool-properties/modal-tool-properties.component";
import { ToolbarComponent } from "./canvas/toolbar/toolbar.component";
import { MultiToolButtonComponent } from "./canvas/toolbar/multi-tool-button/multi-tool-button.component";
import { SharedModule } from "../shared/shared.module";
import { OverlayModule } from "@angular/cdk/overlay";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatSliderModule } from '@angular/material/slider';
import { OptionsComponent } from "./options/options.component";
import { CaretakerService } from "./services/canvas-state-management/caretaker.service";
import { ModalSaveImageComponent } from './canvas/modal-save-image/modal-save-image.component';
import { ImagesModule } from "../images/images.module";


@NgModule({
  imports: [
    SharedModule,
    MatSliderModule,
    OverlayModule,
    DragDropModule,
    MatDialogModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ImagesModule
  ],
  declarations: [
    CanvasComponent,
    ModalToolPropertiesComponent,
    ToolbarComponent,
    MultiToolButtonComponent,
    OptionsComponent,
    ModalSaveImageComponent,
  ],
  providers: [
    CaretakerService
  ]
})
export class HomeModule { }
