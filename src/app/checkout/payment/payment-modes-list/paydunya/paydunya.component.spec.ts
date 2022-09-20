import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydunyaComponent } from './paydunya.component';

describe('PaydunyaComponent', () => {
  let component: PaydunyaComponent;
  let fixture: ComponentFixture<PaydunyaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaydunyaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaydunyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
