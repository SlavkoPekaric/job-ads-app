import { TestBed } from '@angular/core/testing';
import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateInvoiceDueDate', () => {
    it('should return the end of the month two months in the future for a given date', () => {
      const inputDate = new Date('2023-06-15');
      const result = service.calculateInvoiceDueDate(inputDate);
      const expectedDate = new Date('2023-08-31');
      expect(result.getFullYear()).toEqual(expectedDate.getFullYear());
      expect(result.getMonth()).toEqual(expectedDate.getMonth());
      expect(result.getDate()).toEqual(expectedDate.getDate());
    });

    it('should return the end of the month two months in the future for the current date if no input date is provided', () => {
      const currentDate = new Date();
      const twoMonthsLater = new Date(currentDate);
      twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 3);
      twoMonthsLater.setDate(1);
      twoMonthsLater.setDate(0);
      const result = service.calculateInvoiceDueDate();
      expect(result.getFullYear()).toEqual(twoMonthsLater.getFullYear());
      expect(result.getMonth()).toEqual(twoMonthsLater.getMonth());
      expect(result.getDate()).toEqual(twoMonthsLater.getDate());
    });

    it('should handle year transitions correctly', () => {
      const inputDate = new Date('2023-12-15');
      const result = service.calculateInvoiceDueDate(inputDate);
      const expectedDate = new Date('2024-02-29'); // February 2024 is a leap year
      expect(result.getFullYear()).toEqual(expectedDate.getFullYear());
      expect(result.getMonth()).toEqual(expectedDate.getMonth());
      expect(result.getDate()).toEqual(expectedDate.getDate());
    });
  });
});
