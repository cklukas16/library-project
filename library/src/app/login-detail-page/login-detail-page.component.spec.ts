import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDetailPageComponent } from './login-detail-page.component';

describe('LoginDetailPageComponent', () => {
  let component: LoginDetailPageComponent;
  let fixture: ComponentFixture<LoginDetailPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginDetailPageComponent]
    });
    fixture = TestBed.createComponent(LoginDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
