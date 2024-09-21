import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalToolPropertiesComponent } from './modal-tool-properties.component';

describe('ModalToolPropertiesComponent', () => {
  let component: ModalToolPropertiesComponent;
  let fixture: ComponentFixture<ModalToolPropertiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalToolPropertiesComponent]
    });
    fixture = TestBed.createComponent(ModalToolPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
