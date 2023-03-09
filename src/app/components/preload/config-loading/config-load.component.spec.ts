import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigLoadComponent} from './config-load.component';

describe('LoadingConfigPageComponent', () => {
  let component: ConfigLoadComponent;
  let fixture: ComponentFixture<ConfigLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigLoadComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfigLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
