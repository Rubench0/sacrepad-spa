import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorEmailComponent } from './validator-email.component';

describe('ValidatorEmailComponent', () => {
  let component: ValidatorEmailComponent;
  let fixture: ComponentFixture<ValidatorEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
