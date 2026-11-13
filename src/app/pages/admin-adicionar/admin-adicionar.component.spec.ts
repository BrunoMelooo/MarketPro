import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdicionarComponent } from './admin-adicionar.component';

describe('AdminAdicionarComponent', () => {
  let component: AdminAdicionarComponent;
  let fixture: ComponentFixture<AdminAdicionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAdicionarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
