import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from '../models';
import { CartEntity } from './cart.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryColumn('uuid', { name: 'product_id' })
  productId: string;

  @ManyToOne(() => CartEntity, (cart) => cart.items, {
    nullable: false,
  })
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @Column('int')
  count: number;

  product: Product;
}
