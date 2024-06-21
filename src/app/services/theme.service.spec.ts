import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { DOCUMENT } from '@angular/common';

fdescribe('ThemeService', () => {
  let service: ThemeService;
  let documentMock: Document;

  beforeEach(() => {
    documentMock = {
      body: {
        classList: {
          toggle: jasmine.createSpy('toggle'),
          add: jasmine.createSpy('add'),
          remove: jasmine.createSpy('remove'),
          contains: jasmine.createSpy('contains'),
        },
        querySelectorAll: jasmine
          .createSpy('querySelectorAll')
          .and.returnValue([]),
      },
    } as unknown as Document;

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: DOCUMENT, useValue: documentMock }],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle dark theme on darkMode signal change', () => {
    // Initially, the darkMode is false
    expect(service.darkMode()).toBe(false);
    expect(documentMock.body.classList.toggle).toHaveBeenCalledWith(
      'dark-theme',
      false
    );

    // Change the darkMode signal to true
    service.darkMode.set(true);

    // Verify the toggle method was called with the new value
    expect(documentMock.body.classList.toggle).toHaveBeenCalledWith(
      'dark-theme',
      true
    );
  });
});
