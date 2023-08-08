import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Job } from '../shared/interfaces/job';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient) { }

  urlAddress = 'http://localhost:8080/jobs';

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.urlAddress);
  }

  deleteJob(id: Number) {
    return this.http.delete('http://localhost:8080/job/' + id);
  } 

/*
  updateJob(id: Number, job: Job) {
    return this.http.put<any>('http://localhost:8080/api/job/' + id, job);
  }
//*/

  updateJobStatus(id: Number, job: Job) {
    return this.http.patch<any>('http://localhost:8080/job/' + id + '/status', job);
  }

  updateJobNotes(id: Number, job: Job) {
    return this.http.patch<any>('http://localhost:8080/job/' + id + '/notes', job);
  }
}
