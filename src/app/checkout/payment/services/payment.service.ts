import { Injectable } from '@angular/core';

@Injectable()
export class PaymentService {

  setCODAsSelectedMode(modes) {
    let selectedMode;
    modes.forEach((mode) => {
      if (mode.code === 'MAGASIN') {
        selectedMode = mode;
      }
    });
    return selectedMode;
  }

}
