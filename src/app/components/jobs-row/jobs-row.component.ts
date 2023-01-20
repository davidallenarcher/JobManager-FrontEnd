import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { JobsService } from 'src/app/services/jobs.service';
import { Job } from 'src/app/shared/interfaces/job';

@Component({
  selector: 'app-jobs-row',
  templateUrl: './jobs-row.component.html',
  styleUrls: ['./jobs-row.component.css']
})

export class JobsRowComponent {
  jobValue ! : Job;
  showDeleteButton = false;
  showStatusDropDown = false;

  constructor(private jobsService: JobsService) { }

  @Input()
  get job() {
    return this.jobValue;
  }
  set job(value) {
    this.jobValue = value;
    this.jobChange.emit(value);
  }
  @Output() jobChange: EventEmitter<Job> = new EventEmitter<Job>();
  @Output() jobDelete: EventEmitter<Job> = new EventEmitter();

  @ViewChild('jobStatus') jobStatus!: ElementRef;

  isActive(job: Job): boolean {
    return (Date.now() - new Date(job.lastUpdated).getTime()) < 10 * 60 * 1000;
  }

  delete() {
    console.log('deleting: ' + this.job.id);
    this.jobsService.deleteJob(this.job.id).subscribe(() => {
      this.jobDelete.emit();
    });
  }

  showRemove(visible: boolean) {
    this.showDeleteButton = visible;
  }

  updateJobStatus() {
    this.job.jobStatus = this.jobStatus.nativeElement.value;
    this.jobsService.updateJobStatus(this.job.id, this.job).subscribe(
      data => {
        this.jobDelete.emit();
      },
      error => {
        console.log(error);
      }
    );
  }
}

