import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesOeuvresComponent } from './mes-oeuvres.component';

describe('MesOeuvresComponent', () => {
  let component: MesOeuvresComponent;
  let fixture: ComponentFixture<MesOeuvresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesOeuvresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesOeuvresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
