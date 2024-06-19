import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPageComponent } from './no-page.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('NoPageComponent', () => {
  let component: NoPageComponent;
  let fixture: ComponentFixture<NoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoPageComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(NoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
