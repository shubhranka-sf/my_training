// user-service/src/observers/date-formatter.observer.ts

import {
  lifeCycleObserver,
  LifeCycleObserver,
  inject,
  CoreBindings
} from '@loopback/core';
import { juggler, AnyObject } from '@loopback/repository';
import { FormattedDateMetadataKey, FormattedDateMetadata } from '../decorators/foramt-date.decorator';

@lifeCycleObserver('model')
export class DateFormatterObserver implements LifeCycleObserver {

  constructor(
      @inject(CoreBindings.APPLICATION_INSTANCE) private app: any, // You need the application context
  ) { }

  async init(): Promise<void> {
      //console.log('DateFormatterObserver initialized');
  }
  async start(): Promise<void> {
      //console.log('DateFormatterObserver start');
  }
  async stop(): Promise<void> {
     // console.log('DateFormatterObserver stop');
  }


  formatDates(ctx: { data: AnyObject; }, next: () => Promise<void>) {
      //console.log("ctx>>>>>>", ctx)
      const modelClass = ctx.data.constructor;
      const metadata = FormattedDateMetadataKey;

      //console.log("metadata>>>", metadata);
      if (metadata) {
          for (const propertyName in ctx.data) {
              //console.log("propertyName>>", propertyName);
              if (metadata.hasOwnProperty(propertyName) && ctx.data[propertyName] instanceof Date) {
                  // Apply formatting logic here. For example, to ISO string:
                  ctx.data[propertyName] = ctx.data[propertyName].toISOString();
              }
          }
      }
      return next();
  }


  // Intercept create and update operations
  async beforeSave(ctx: { data: AnyObject }, next: () => Promise<void>) {

      if (ctx.data) {
          this.formatDates(ctx, next)
      }
  }
}