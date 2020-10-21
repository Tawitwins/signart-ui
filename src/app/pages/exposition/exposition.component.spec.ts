import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpositionComponent } from './exposition.component';

describe('ExpositionComponent', () => {
  let component: ExpositionComponent;
  let fixture: ComponentFixture<ExpositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
