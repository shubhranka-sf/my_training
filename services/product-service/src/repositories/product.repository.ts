import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Product, dataSource);
  }

  async getTotalValueOfProducts(ids:number[]): Promise<number> {
    // Implement the logic to calculate the total value of products based on the provided IDs
    // You can use the `find` method to retrieve the products and then calculate their total value
    // Example:
    // const products = await this.find({where: {id: ids}});
    // let totalValue = 0;
    // products.forEach(product => {
    //   totalValue += product.price;
    // });
    // return totalValue;

    let totalValue = 0;
    for (let id of ids) {
      const product = await this.findById(id);
      if (product) {
        totalValue += product.price
      }
    }

    return totalValue;
  }

}
