import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllartistComponent } from './allartist.component';

describe('AllartistComponent', () => {
  let component: AllartistComponent;
  let fixture: ComponentFixture<AllartistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllartistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllartistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
