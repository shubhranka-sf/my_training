import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {OrderrestdsDataSource} from '../datasources';
import {Order} from '@training/order-service/src/models/order.model';

export interface OrderService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getOrderById(id: number): Promise<Order>;
  getOrders(): Promise<Order[]>;
}

export class OrderServiceProvider implements Provider<OrderService> {
  constructor(
    // orderrestds must match the name property in the datasource json file
    @inject('datasources.orderrestds')
    protected dataSource: OrderrestdsDataSource = new OrderrestdsDataSource(),
  ) {}

  value(): Promise<OrderService> {
    return getService(this.dataSource);
  }
}
