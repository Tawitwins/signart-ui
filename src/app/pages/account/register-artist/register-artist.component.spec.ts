import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterArtistComponent } from './register-artist.component';

describe('RegisterArtistComponent', () => {
  let component: RegisterArtistComponent;
  let fixture: ComponentFixture<RegisterArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterArtistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
