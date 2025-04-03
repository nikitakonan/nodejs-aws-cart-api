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
    statusHistory: [], // TODO add status history
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
      relations: ['cart'],
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
    const { total, cartId, userId, address } = data;
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

    return mapOrderEntityToOrder(created);
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
