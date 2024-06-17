import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor() {}

  /**
   * Calculates the timestamp for the end of the following month (compared to input date)
   * @param {Date} [inputDate] - Input date object
   * @returns {Date} A new Date object pointing to the end of the following month
   */
  calculateInvoiceDueDate(inputDate?: Date): Date {
    let date = inputDate || new Date();
    date.setMonth(date.getMonth() + 3);
    date.setDate(1);
    date.setDate(0);

    return date;
  }
}
