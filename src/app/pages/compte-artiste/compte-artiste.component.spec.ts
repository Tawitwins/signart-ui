import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { CompteArtisteComponent } from './compte-artiste.component';

describe('CompteArtisteComponent', () => {
  let component: CompteArtisteComponent;
  let fixture: ComponentFixture<CompteArtisteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompteArtisteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompteArtisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
