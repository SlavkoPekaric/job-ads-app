import { Routes } from '@angular/router';

export const routes : Routes = [
  { 
    path: 'job-ads',
    loadComponent: () => import('./job-ads/components/job-ads-list/job-ads-list.component').then(m => m.JobAdsListComponent)
  },
  { 
    path: 'job-ads/create',
    loadComponent: () => import('./job-ads/components/job-ad-form/job-ad-form.component').then(m => m.JobAdFormComponent)
  },
  { 
    path: 'job-ads/edit/:id',
    loadComponent: () => import('./job-ads/components/job-ad-form/job-ad-form.component').then(m => m.JobAdFormComponent)
  },
  {
    path: 'invoices',
    loadComponent : () => import('./invoices/components/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent)
  },
  {
    path: '',
    redirectTo : '/job-ads',
    pathMatch : 'full'
  },
  {
    path          : '**',
    loadComponent : () => import('./shared/components/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent)
  }
];

