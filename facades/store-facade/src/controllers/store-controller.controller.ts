// facades/store-facade/src/controllers/store.controller.ts
import { inject } from '@loopback/core';
import { get, getModelSchemaRef, param, post, requestBody, response } from '@loopback/rest';
import { ProductService } from '../services/product-service.service';  // Import your service proxies
import { OrderService } from '../services/order-service.service';
import { Product } from '@training/product-service/src/models/product.model';
import { authenticate, STRATEGY } from 'loopback4-authentication';
// import { Order } from '@training/order-service/dist/models';


export class StoreController {
  constructor(
    @inject('services.ProductService')
    protected productService: ProductService,
    @inject('services.OrderService')
    protected orderService: OrderService,
  ) { }

  @get('/products/{id}/details')
  @response(200, {
    description: 'Product details with associated orders',
  })
  async getProductDetails(@param.path.string('id') productId: number): Promise<any> {
    try {
      const product: Product = await this.productService.getProductById(productId);
      // const orders:Order[] = await this.orderService.getOrdersByProductId(productId);

      return {
        ...product,
        // orders,
      };
    } catch (error) {
      //handle error
    }
  }

  @get('/products')
  @authenticate(STRATEGY.BEARER)
  @response(200, {
    description: 'Product details with associated orders',
  })
  async getAllProductDetails(): Promise<any> {
    try {
      const products: Product[] = await this.productService.getProducts();
      // Create an array of promises for fetching orders for each product
      // const ordersPromises = products.map(product =>
      //     this.orderService.getOrdersByProductId(product.id!)
      // );
      // Wait for all the order fetching promises to resolve
      // const ordersArrays = await Promise.all(ordersPromises);

      //combine product with order.
      const productsWithOrders = products.map((product, index) => ({
        ...product,
        // orders: ordersArrays[index], // Assign the corresponding orders array
      }));


      return productsWithOrders;
    } catch (error) {
      //handle error
    }
  }


  @post('/products')
  @response(200, {
    description: 'Product details with associated orders',
  })
  async createProduct(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {
          title: 'NewProduct',
          exclude: ['id'],
        }),
      },
    },
  })
  product: Omit<Product, 'id'>,
): Promise<Product> {
  try{
    const newProduct = await this.productService.createProduct(product.title, product.price);
    return newProduct;
  } catch (error) {
    console.error("Error creating product", error);
    throw error;
  }
}
}