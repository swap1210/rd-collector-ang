import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeraCommissionComponent } from './mera-commission.component';

describe('MeraCommissionComponent', () => {
  let component: MeraCommissionComponent;
  let fixture: ComponentFixture<MeraCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeraCommissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeraCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
