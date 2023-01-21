import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/services/jobs.service';
import { Job } from 'src/app/shared/interfaces/job';
import { interval, Observable, Subscription, switchMap, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})

export class JobsComponent implements OnInit {
  jobs: Job[] | undefined;
  updateSubscription: Subscription = new Subscription();
  errorMessage: String | undefined;

  constructor(private jobsService: JobsService) {}

  ngOnInit(): void {
    this.updateJobs();
    //this.updateSubscription = interval(5 * 60 * 1000).subscribe(
    this.updateSubscription = interval(30 * 1000).subscribe(
      (val) => { this.updateJobs() }
    );
  }

  isActive(job: Job): boolean {
    return (Date.now() - new Date(job.lastUpdated).getTime()) < 10 * 60 * 1000;
  }

  updateJobs() {
    this.errorMessage = undefined;
    console.log("updating %s", new Date(Date.now()));
    this.jobsService.getJobs().subscribe({
      next: jobs => {
        this.jobs = jobs.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
      },
      error: error => {
        this.jobs = undefined;
        this.errorMessage = 'Unable to load jobs from server :/'
      }
    })
  }
}
