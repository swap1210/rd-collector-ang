import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
