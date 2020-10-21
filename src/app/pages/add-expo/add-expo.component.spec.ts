import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpoComponent } from './add-expo.component';

describe('AddExpoComponent', () => {
  let component: AddExpoComponent;
  let fixture: ComponentFixture<AddExpoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExpoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
