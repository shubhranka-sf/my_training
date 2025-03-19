import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'orderrestds',
  connector: 'rest',
  baseURL: 'http://localhost:3002',
  crud: false,
  operations: [ //Define operations here
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3002/orders/{id}',
      },
      functions: {
        getOrderById: ['id'], // Maps to function parameters
      },
    },
    {
      template: {
          method: 'GET',
          url: 'http://localhost:3002/orders',
      },
      functions: {
          getOrders: [], // Maps to function parameters
      },
    },
    // Add other operations (POST, PUT, DELETE) as needed
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class OrderrestdsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'orderrestds';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.orderrestds', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
