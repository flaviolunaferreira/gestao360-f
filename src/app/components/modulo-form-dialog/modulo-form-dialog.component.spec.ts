import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloFormDialogComponent } from './modulo-form-dialog.component';

describe('ModuloFormDialogComponent', () => {
  let component: ModuloFormDialogComponent;
  let fixture: ComponentFixture<ModuloFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
