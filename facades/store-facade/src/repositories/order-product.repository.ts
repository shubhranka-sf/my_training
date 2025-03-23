import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {OrderProduct, OrderProductRelations} from '../models';

export class OrderProductRepository extends DefaultCrudRepository<
  OrderProduct,
  typeof OrderProduct.prototype.id,
  OrderProductRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(OrderProduct, dataSource);
  }
}
