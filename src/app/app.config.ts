import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
import { taskReducer } from './store/tasks/task.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideStore({
        auth: authReducer,
        tasks: taskReducer
    }),
      provideEffects([]),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};
