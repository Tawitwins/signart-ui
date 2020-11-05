import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisteProfilComponent } from './artiste-profil.component';

describe('ArtisteProfilComponent', () => {
  let component: ArtisteProfilComponent;
  let fixture: ComponentFixture<ArtisteProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtisteProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtisteProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
