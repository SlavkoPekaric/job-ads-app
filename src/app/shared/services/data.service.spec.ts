import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { JobAd, JobAdStatus } from '../models/job-ad.model';
import { Invoice } from '../models/invoice.model';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all data (jobs and invoices)', () => {
    const mockData = {
      jobs: [
        { id: 1, title: 'Test Job', description: 'Test Description', skills: [], status: 'draft' as JobAdStatus }
      ],
      invoices: [
        { id: 1, jobAdId: 1, amount: 100, dueDate: new Date() }
      ]
    };

    service.getAllData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should retrieve job ads', () => {
    const mockJobs: JobAd[] = [
      { id: 1, title: 'Test Job 1', description: 'Test Description 1', skills: [], status: 'draft' as JobAdStatus },
      { id: 2, title: 'Test Job 2', description: 'Test Description 2', skills: [], status: 'published' as JobAdStatus }
    ];

    service.getJobs().subscribe(jobs => {
      expect(jobs).toEqual(mockJobs);
    });

    const req = httpMock.expectOne('/jobs');
    expect(req.request.method).toBe('GET');
    req.flush(mockJobs);
  });

  it('should create a job ad', () => {
    const newJob: JobAd = { id: 3, title: 'New Job', description: 'New Description', skills: [], status: 'draft' as JobAdStatus };

    service.createJob(newJob).subscribe(job => {
      expect(job).toEqual(newJob);
    });

    const req = httpMock.expectOne('/jobs');
    expect(req.request.method).toBe('POST');
    req.flush(newJob);
  });

  it('should update a job ad', () => {
    const updatedJob: JobAd = { id: 1, title: 'Updated Job', description: 'Updated Description', skills: [], status: 'draft' as JobAdStatus };

    service.updateJob(1, updatedJob).subscribe(job => {
      expect(job).toEqual(updatedJob);
    });

    const req = httpMock.expectOne('/jobs/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedJob);
  });

  it('should remove a job ad', () => {
    const jobToRemove: JobAd = { id: 1, title: 'Job to remove', description: 'Description', skills: [], status: 'draft' as JobAdStatus };

    service.removeJob(jobToRemove).subscribe(job => {
      expect(job).toEqual(jobToRemove);
    });

    const req = httpMock.expectOne('/jobs/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should retrieve invoices', () => {
    const mockInvoices: Invoice[] = [
      { id: 1, jobAdId: 1, amount: 100, dueDate: new Date() }, // Use ISO string for the date
      { id: 2, jobAdId: 2, amount: 200, dueDate: new Date() }
    ];

    service.getInvoices().subscribe(invoices => {
      expect(invoices).toEqual(mockInvoices);
    });

    const req = httpMock.expectOne('/invoices');
    expect(req.request.method).toBe('GET');
    req.flush(mockInvoices);
  });

  it('should create an invoice', () => {
    const newInvoice: Invoice = { id: 3, jobAdId: 3, amount: 300, dueDate: new Date() };

    service.createInvoice(newInvoice).subscribe(invoice => {
      expect(invoice).toEqual(newInvoice);
    });

    const req = httpMock.expectOne('/invoices');
    expect(req.request.method).toBe('POST');
    req.flush(newInvoice);
  });

  it('should update an invoice', () => {
    const updatedInvoice: Invoice = { id: 1, jobAdId: 1, amount: 150, dueDate: new Date() };

    service.updateInvoice(1, updatedInvoice).subscribe(invoice => {
      expect(invoice).toEqual(updatedInvoice);
    });

    const req = httpMock.expectOne('/invoices/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedInvoice);
  });

  it('should remove invoices associated with a job ad', () => {
    const jobAdId = 1;

    service.removeInvoices(jobAdId).subscribe(id => {
      expect(id).toEqual(jobAdId);
    });

    const req = httpMock.expectOne('/invoices/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle errors', () => {
    service.getJobs().subscribe(
      () => fail('expected an error, not jobs'),
      error => expect(error).toContain('Something bad happened; please try again later.')
    );

    const req = httpMock.expectOne('/jobs');
    expect(req.request.method).toBe('GET');

    req.flush('error', { status: 500, statusText: 'Server Error' });
  });
});
