import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoFormDialogComponent } from './plano-form-dialog.component';

describe('PlanoFormDialogComponent', () => {
  let component: PlanoFormDialogComponent;
  let fixture: ComponentFixture<PlanoFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
