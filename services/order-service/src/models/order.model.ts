import {Entity, hasMany, model, property} from '@loopback/repository';
import {Product} from "@training/product-service/src/models/product.model";

@model()
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    id: false,
  })
  totalAmount: number;

  @hasMany(() => Product)
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
