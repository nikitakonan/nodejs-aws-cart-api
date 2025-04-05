import { Injectable, Logger } from '@nestjs/common';
import { Order } from '../models';
import { CreateOrderPayload, OrderStatus } from '../type';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { CartEntity } from '../../cart/entities/cart.entity';

function mapOrderEntityToOrder(orderEntity: OrderEntity): Order {
  return {
    id: orderEntity.id,
    userId: orderEntity.userId,
    items: orderEntity.cart.items.map((item) => ({
      productId: item.productId,
      count: item.count,
    })),
    cartId: orderEntity.cart.id,
    address: orderEntity.delivery,
    statusHistory: [
      {
        status: orderEntity.status,
        comment: orderEntity.comments,
        timestamp: new Date().valueOf(),
      },
    ], // TODO add status history
  };
}

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async getAll() {
    this.logger.log('get all orders');
    const orders = await this.orderRepository.find({
      relations: ['cart', 'cart.items'],
    });
    return orders.map(mapOrderEntityToOrder);
  }

  async findById(orderId: string) {
    this.logger.log(`find order by id: ${orderId}`);
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['cart'],
    });
    return mapOrderEntityToOrder(order);
  }

  async create(data: CreateOrderPayload) {
    const { total, cartId, userId, address, items } = data;
    const orderEntity = new OrderEntity();
    const cart = new CartEntity();
    cart.id = cartId;
    orderEntity.cart = cart;
    orderEntity.userId = userId;
    orderEntity.delivery = address;
    orderEntity.total = total;
    orderEntity.status = OrderStatus.Open;
    orderEntity.comments = '';
    orderEntity.payment = {};

    const created = await this.orderRepository.save(orderEntity);

    return {
      id: created.id,
      userId: created.userId,
      items,
      cartId: cart.id,
      address: created.delivery,
      statusHistory: [
        {
          status: created.status,
          comment: created.comments,
          timestamp: new Date().valueOf(),
        },
      ], // TODO add status history
    };
  }

  // TODO add  type
  async update(orderId: string, data: Order) {
    const order = await this.findById(orderId);
    const { userId, cartId, items, address, statusHistory } = data;

    if (!order) {
      throw new Error('Order does not exist.');
    }

    // TODO update order in database
  }
}
