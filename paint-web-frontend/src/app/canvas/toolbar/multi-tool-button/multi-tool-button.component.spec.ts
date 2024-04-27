import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiToolButtonComponent } from './multi-tool-button.component';

describe('MultiToolButtonComponent', () => {
  let component: MultiToolButtonComponent;
  let fixture: ComponentFixture<MultiToolButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiToolButtonComponent]
    });
    fixture = TestBed.createComponent(MultiToolButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
