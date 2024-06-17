import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { JobAd } from '../models/job-ad.model';
import { Invoice } from '../models/invoice.model';

interface MockDataResponse {
  jobs: JobAd[]
  invoices: Invoice[]
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /**
   * @param {HttpClient} http - The HttpClient used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all data (jobs and invoices).
   * @returns {Observable<MockDataResponse>} An observable containing the jobs and invoices.
   */
  getAllData(): Observable<MockDataResponse> {
    return this.http.get<any>('/').pipe(
      map((response: MockDataResponse) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves job ads, optionally filtered by a keyword.
   * @param {string} [keyword] - The keyword to filter job ads by.
   * @returns {Observable<JobAd[]>} An observable containing the job ads.
   */
  getJobs(keyword?: string): Observable<JobAd[]> {
    const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';

    return this.http.get<any>(`/jobs${query}`).pipe(
      map((response: JobAd[]) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new job ad.
   * @param {JobAd} jobAd - The job ad to create.
   * @returns {Observable<JobAd>} An observable containing the created job ad.
   */
  createJob(jobAd: JobAd): Observable<JobAd> {
    return this.http.post<any>('/jobs', jobAd).pipe(
      map((response: JobAd) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing job ad.
   * @param {number} id - The ID of the job ad to update.
   * @param {Partial<JobAd>} changes - The changes to apply to the job ad.
   * @returns {Observable<JobAd>} An observable containing the updated job ad.
   */
  updateJob(id: number, changes: Partial<JobAd>): Observable<JobAd> {
    return this.http.put<any>(`/jobs/${id}`, changes).pipe(
      map((response: JobAd) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Removes a job ad.
   * @param {JobAd} jobAd - The job ad to remove.
   * @returns {Observable<JobAd>} An observable containing the removed job ad.
   */
  removeJob(jobAd: JobAd): Observable<JobAd> {
    return this.http.delete<any>(`/jobs/${jobAd.id}`).pipe(
      map(() => jobAd),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves invoices.
   * @returns {Observable<Invoice[]>} An observable containing the invoices.
   */
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<any>('/invoices').pipe(
      map((response: Invoice[]) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new invoice.
   * @param {Invoice} invoice - The invoice to create.
   * @returns {Observable<Invoice>} An observable containing the created invoice.
   */
  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<any>('/invoices', invoice).pipe(
      map((response: Invoice) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing invoice.
   * @param {number} id - The ID of the invoice to update.
   * @param {Partial<Invoice>} changes - The changes to apply to the invoice.
   * @returns {Observable<Invoice>} An observable containing the updated invoice.
   */
  updateInvoice(id: number, changes: Partial<Invoice>): Observable<Invoice> {
    return this.http.put<any>(`/invoices/${id}`, changes).pipe(
      map((response: Invoice) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Removes invoices associated with a specific job ad.
   * @param {number} jobAdId - The ID of the job ad whose invoices to remove.
   * @returns {Observable<number>} An observable containing the ID of the job ad whose invoices were removed.
   */
  removeInvoices(jobAdId: number): Observable<number> {
    return this.http.delete<any>(`/invoices/${jobAdId}`).pipe(
      map(() => jobAdId),
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors.
   * @param {HttpErrorResponse} error - The HTTP error response.
   * @returns {Observable<never>} An observable that throws an error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError('Something bad happened; please try again later.');
  }
}
