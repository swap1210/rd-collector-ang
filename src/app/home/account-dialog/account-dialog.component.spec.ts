import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDialogComponent } from './account-dialog.component';

describe('AccountDialogComponent', () => {
  let component: AccountDialogComponent;
  let fixture: ComponentFixture<AccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
