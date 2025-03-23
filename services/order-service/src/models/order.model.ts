import {Entity, hasMany, model, property} from '@loopback/repository';
import {Product} from "@training/product-service/src/models/product.model";
import {OrderProduct} from "@training/store-facade/src/models/order-product.model";

@model()
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @hasMany(() => Product, {through: {model: () => OrderProduct}})
  products: Product[]

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
  products?: Product[];
}

export type OrderWithRelations = Order & OrderRelations;
