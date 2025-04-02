import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from '../models';
import { CartEntity } from './cart.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryColumn('uuid', { name: 'product_id' })
  productId: string;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity;

  @Column('int')
  count: number;

  product: Product;
}
