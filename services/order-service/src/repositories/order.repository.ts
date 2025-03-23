import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Order, OrderRelations} from '../models';
import { Product } from '@training/product-service/src/models/product.model';
import { ProductRepository } from '@training/product-service/src/repositories';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {

  public readonly products: HasManyRepositoryFactory<Product, typeof Order.prototype.id>;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter(ProductRepository) protected productRepository: Getter<ProductRepository>
  ) {
    super(Order, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepository);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
