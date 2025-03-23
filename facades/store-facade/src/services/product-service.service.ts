import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {ProductRestDs} from '../datasources';
import {Product} from '@training/product-service/src/models/product.model';


export interface ProductService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getProductById(id: number): Promise<Product>;
  getProducts(): Promise<Product[]>;
  createProduct(title: string, price: number): Promise<Product>;
}

export class ProductServiceProvider implements Provider<ProductService> {
  constructor(
    // restdb must match the name property in the datasource json file
    @inject('datasources.restdb')
    protected dataSource: ProductRestDs = new ProductRestDs(),
  ) {}

  value(): Promise<ProductService> {
    return getService(this.dataSource);
  }
}
