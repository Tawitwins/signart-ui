import { TestBed } from '@angular/core/testing';

import { EvenementSignartService} from './evenement-signart.service';

describe('EvenementSignartServiceService', () => {
  let service: EvenementSignartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvenementSignartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
