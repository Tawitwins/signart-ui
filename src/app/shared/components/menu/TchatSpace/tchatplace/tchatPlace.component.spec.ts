import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TchatPlaceComponent } from './tchatPlace.component';



describe('tchatPlace', () => {
  let component: TchatPlaceComponent;
  let fixture: ComponentFixture<TchatPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TchatPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TchatPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
