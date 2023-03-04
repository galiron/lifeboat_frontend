import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingConfigPageComponent } from './loading-config-page.component';

describe('LoadingConfigPageComponent', () => {
  let component: LoadingConfigPageComponent;
  let fixture: ComponentFixture<LoadingConfigPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingConfigPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
