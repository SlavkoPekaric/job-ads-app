import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';

import { jobAdReducer } from './job-ads/store';
import { invoiceReducer } from './invoices/store/reducers';

import { JobAdsEffects } from './job-ads/store/effects';
import { InvoiceEffects } from './invoices/store/effects';
import * as JobAdsActions from './job-ads/store/actions';
import * as InvoiceActions from './invoices/store/actions';

import { BaseUrlInterceptor } from './shared/interceptors/base-url.interceptor';
import { JobAdsInterceptor } from './shared/interceptors/job-ad-publication.interceptor';

export function initializeApp(store: Store) {
  return () => {
    store.dispatch(JobAdsActions.loadJobAds({}));
    store.dispatch(InvoiceActions.loadInvoices());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Store],
      multi: true
    },
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true
    },
    provideRouter(routes), provideAnimationsAsync(),
    provideStore({
      jobAds: jobAdReducer,
      invoices: invoiceReducer
    }),
    provideEffects([
      JobAdsEffects,
      InvoiceEffects,
      JobAdsInterceptor
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
