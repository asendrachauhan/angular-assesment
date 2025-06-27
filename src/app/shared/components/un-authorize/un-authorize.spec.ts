import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAuthorize } from './un-authorize';

describe('UnAuthorize', () => {
  let component: UnAuthorize;
  let fixture: ComponentFixture<UnAuthorize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnAuthorize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnAuthorize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
