import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOeuvreComponent } from './add-oeuvre.component';

describe('AddAnnonceComponent', () => {
  let component: AddOeuvreComponent;
  let fixture: ComponentFixture<AddOeuvreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOeuvreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOeuvreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
