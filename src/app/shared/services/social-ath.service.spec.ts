import { TestBed } from '@angular/core/testing';

import { SocialAthService } from './social-ath.service';

describe('SocialAthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocialAthService = TestBed.get(SocialAthService);
    expect(service).toBeTruthy();
  });
});
