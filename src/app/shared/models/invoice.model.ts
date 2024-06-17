export interface Invoice {
  id?: number;
  jobAdId: number;
  amount: unknown; // up to you
  dueDate: Date;
}
