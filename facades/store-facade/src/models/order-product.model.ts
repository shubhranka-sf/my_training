import {Entity, model, property} from '@loopback/repository';

@model()
export class OrderProduct extends Entity {
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
  order: number;

  @property({
    type: 'number',
    required: true,
  })
  product: number;


  constructor(data?: Partial<OrderProduct>) {
    super(data);
  }
}

export interface OrderProductRelations {
  // describe navigational properties here
}

export type OrderProductWithRelations = OrderProduct & OrderProductRelations;
