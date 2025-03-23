import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { getModelSchemaRef } from '@loopback/rest';
import { Product } from '@training/product-service/src/models/product.model';

const config = {
  name: 'restdb',
  connector: 'rest',
  baseURL: 'http://localhost:3001',
  crud: false,
  operations: [ //Define operations here
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3001/products/{id}',
      },
      functions: {
        getProductById: ['id'], // Maps to function parameters
      },
    },
    {
      template: {
          method: 'GET',
          url: 'http://localhost:3001/products',
      },
      functions: {
          getProducts: [], // Maps to function parameters
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3001/products',
        body: {
          "title": "{title:string}",
          "price": "{price:number}"
        },
      },
      functions: {
        createProduct: ['title', 'price'], // Maps to function parameters
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ProductRestDs extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'restdb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.restdb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
