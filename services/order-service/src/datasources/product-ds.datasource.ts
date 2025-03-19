import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { operation } from '@loopback/rest';

const config = {
  name: 'ProductDs',
  connector: 'rest',
  baseURL: 'http://localhost:3001',
  crud: false,
  operations: [
    { 
      template: {
        method: 'GET',
        url: "http://localhost:3001/products/value?ids={ids}",
      },
      functions: {
        getTotalValueOfProducts:['ids']
      }
    }
  ]
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ProductDsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'ProductDs';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.ProductDs', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
