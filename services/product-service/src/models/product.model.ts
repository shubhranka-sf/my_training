import {Entity, hasMany, model, property} from '@loopback/repository';
import {Order} from "@training/order-service/src/models/order.model";
@model()
export class Product extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  // @property({
  //   type: 'array',
  //   required: false,
  //   itemType: 'number',
  // })
  // orderIds?: number[];

  @hasMany(() => Order)
  orderIds?: Order[]


  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
