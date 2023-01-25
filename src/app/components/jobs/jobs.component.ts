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

  jobsNew: Job[] | undefined;
  jobsApply: Job[] | undefined;
  jobsApplied: Job[] | undefined;
  jobsSeen: Job[] | undefined;
  jobsIgnored: Job[] | undefined;
  jobsExpired: Job[] | undefined;

  errorMessage: String | undefined;

  constructor(private jobsService: JobsService) {}

  ngOnInit(): void {
    this.updateJobs();
    this.updateSubscription = interval(30 * 1000).subscribe(
      () => { this.updateJobs(); }
    );
  }

  private isExpired(job: Job): boolean {
    return (Date.now() - new Date(job.lastSeen).getTime()) > 10 * 60 * 1000;
  }

  updateJobs() {
    this.errorMessage = undefined;
    console.log("updating %s", new Date(Date.now()));
    this.jobsService.getJobs().subscribe({
      next: jobs => {
        this.jobsRaw = jobs;
        this.jobsNew = this.jobsRaw
          .filter(job => job.jobStatus === "NEW" && !this.isExpired(job))
          .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        this.jobsIgnored = this.jobsRaw
          .filter(job => job.jobStatus === "IGNORE" && !this.isExpired(job))
          .sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
        this.jobsApplied = this.jobsRaw
          .filter(job => job.jobStatus === "APPLIED" && !this.isExpired(job))
          .sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
        this.jobsApply = this.jobsRaw
          .filter(job => job.jobStatus === "SHOULD_APPLY" && !this.isExpired(job))
          .sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
        this.jobsSeen = this.jobsRaw
          .filter(job => job.jobStatus === "SEEN" && !this.isExpired(job))
          .sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
        this.jobsExpired = this.jobsRaw
          .filter(job => this.isExpired(job))
          .sort((a, b) => new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime());
      },
      error: () => {
        this.jobsRaw = undefined;
        this.errorMessage = 'Unable to load jobs from server :/'
      }
    })
  }
}
