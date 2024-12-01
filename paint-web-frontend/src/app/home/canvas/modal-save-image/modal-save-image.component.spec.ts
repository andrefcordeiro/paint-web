import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSaveImageComponent } from './modal-save-image.component';

describe('ModalSaveImageComponent', () => {
  let component: ModalSaveImageComponent;
  let fixture: ComponentFixture<ModalSaveImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSaveImageComponent]
    });
    fixture = TestBed.createComponent(ModalSaveImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
