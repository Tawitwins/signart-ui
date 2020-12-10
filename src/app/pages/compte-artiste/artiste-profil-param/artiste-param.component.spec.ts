import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisteParamComponent } from './artiste-param.component';

describe('ArtisteProfilComponent', () => {
  let component: ArtisteParamComponent;
  let fixture: ComponentFixture<ArtisteParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtisteParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtisteParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
