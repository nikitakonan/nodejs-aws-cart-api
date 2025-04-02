import { Injectable } from '@nestjs/common';
import { type Cart } from '../models';
import { type PutCartPayload } from 'src/order/type';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { type Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

function mapCartEntityToCart(cartEntity: CartEntity): Cart {
  return {
    id: cartEntity.id,
    user_id: cartEntity.user_id,
    created_at: cartEntity.created_at,
    updated_at: cartEntity.updated_at,
    status: cartEntity.status,
    items: cartEntity.items.map((item) => ({
      product: {
        id: 'TODO',
        title: 'TODO',
        description: 'TODO',
        price: 0,
      },
      count: item.count,
    })),
  };
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemsRepository: Repository<CartItemEntity>,
  ) {}

  async findByUserId(userId: string): Promise<Cart | undefined> {
    const cartEntity = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });
    if (!cartEntity) {
      return;
    }

    return mapCartEntityToCart(cartEntity);
  }

  async createByUserId(user_id: string): Promise<Cart> {
    const cartEntity = new CartEntity();
    cartEntity.user_id = user_id;
    cartEntity.items = [];
    const saved = await this.cartRepository.save(cartEntity);

    return mapCartEntityToCart(saved);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, payload: PutCartPayload): Promise<Cart> {
    const userCart = await this.findOrCreateByUserId(userId);

    const cartEntity = await this.cartRepository.findOneBy({ id: userCart.id });

    const cartItem = new CartItemEntity();
    cartItem.cart = cartEntity;
    cartItem.productId = payload.product.id;
    cartItem.count = payload.count;

    await this.cartItemsRepository.save(cartItem);

    const updatedCart = await this.cartRepository.findOne({
      where: {
        id: userCart.id,
      },
      relations: ['items'],
    });

    return mapCartEntityToCart(updatedCart);
  }

  async removeByUserId(userId: string) {
    await this.cartRepository.delete({ user_id: userId });
  }
}
