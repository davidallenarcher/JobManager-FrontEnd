import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/services/jobs.service';
import { Job } from 'src/app/shared/interfaces/job';
import { interval, Observable, Subscription, switchMap, takeUntil, timer, groupBy } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})

export class JobsComponent implements OnInit {
  private updateSubscription: Subscription = new Subscription();

  private jobsRaw: Job[] | undefined;

  hideIgnored = true;

  jobsSorted: Job[] | undefined;

  jobSources: string[] | undefined;
  
  errorMessage: String | undefined;

  constructor(private jobsService: JobsService) {}

  setHideIgnored(event: Event): any {
    let checkbox = event.target as HTMLInputElement;
    this.hideIgnored = checkbox.checked;
    this.sortJobs();
  }

  ngOnInit(): void {
    this.updateJobs();
    this.updateSubscription = interval(30 * 1000).subscribe(
      () => { this.updateJobs(); }
    );
  }

  sortTemp(a: Job, b: Job): number {
    if (a.jobStatus < b.jobStatus) 
      return -1;
    if (a.jobStatus > b.jobStatus)
      return 1;
    return (a.title < b.title)?-1:1;
  }

  sortJobs(): void {
    if (this.jobsRaw) {
      this.jobsSorted = this.jobsRaw
        //.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        //.sort((a, b) => (a.jobStatus < b.jobStatus)?-1:(a.title > b.title)?-1:1)
        //.sort((a, b) => ((a.jobStatus === b.jobStatus)?((a.title < b.title)?-1:1):((a.jobStatus < b.jobStatus)?-1:1)))
        .sort((a,b) => (a.title < b.title)?-1:1)
        .filter(job => (job.jobStatus !== "IGNORE" || !this.hideIgnored));
    }
  }

  updateJobs() {
    this.errorMessage = undefined;
    console.log("updating %s", new Date(Date.now()));
    this.jobsService.getJobs().subscribe({
      next: jobs => {
        this.jobsRaw = jobs;
        this.sortJobs();
      },
      error: () => {
        this.jobsRaw = undefined;
        this.jobsSorted = undefined;
        this.jobSources = undefined;
        this.errorMessage = 'Unable to load jobs from server :/'
      }
    })
  }
}
