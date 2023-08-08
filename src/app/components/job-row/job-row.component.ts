import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { JobsService } from 'src/app/services/jobs.service';
import { Job } from 'src/app/shared/interfaces/job';

@Component({
  selector: 'app-jobs-row',
  templateUrl: './job-row.component.html',
  styleUrls: ['./job-row.component.css']
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
  @ViewChild('notes') notes! : ElementRef;

  isActive(): boolean {
    return (Date.now() - new Date(this.job.lastSeen).getTime()) < 10 * 60 * 1000;
  }

  getBackgroundColor(): string {
    switch(this.job.jobStatus) {
      case "NEW":
        return '#99DD99';
      case "SEEN":
        return '#DDDD99';
      case "IGNORE":
        return '#DDDDDD';
      case "PRIORITY_APPLY":
        return '#DDDDFF';
      default:
        return '#FFFFFF';
    }
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

