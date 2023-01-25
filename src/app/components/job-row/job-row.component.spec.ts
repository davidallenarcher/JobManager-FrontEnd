import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsRowComponent } from './job-row.component';

describe('JobRowComponent', () => {
  let component: JobsRowComponent;
  let fixture: ComponentFixture<JobsRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
