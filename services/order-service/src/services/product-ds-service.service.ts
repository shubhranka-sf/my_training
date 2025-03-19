import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {ProductDsDataSource} from '../datasources';

export interface ProductDsService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getTotalValueOfProducts(ids:number[]): Promise<number>;
}

export class ProductDsServiceProvider implements Provider<ProductDsService> {
  constructor(
    // ProductDs must match the name property in the datasource json file
    @inject('datasources.ProductDs')
    protected dataSource: ProductDsDataSource = new ProductDsDataSource(),
  ) {}

  value(): Promise<ProductDsService> {
    return getService(this.dataSource);
  }
}
