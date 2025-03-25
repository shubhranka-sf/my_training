import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'UserRestDS',
  connector: 'rest',
  baseURL: '',
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3000/users/{id}',
      },
      functions: {
        getUserById: ['id'], // Maps to function parameters
      },
    },
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3000/users',
      },
      functions: {
        getUsers: [], // Maps to function parameters
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3000/users',
      },
      functions: {
        createUser: [], // Maps to function parameters
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class UserRestDsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'UserRestDS';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.UserRestDS', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
