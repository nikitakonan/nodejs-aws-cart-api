import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartStatuses } from '../models';
import { CartItemEntity } from './cart-item.entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' })
  created_at: number;

  @UpdateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' })
  updated_at: number;

  @Column('enum', {
    enumName: 'cart_status',
    enum: CartStatuses,
    default: CartStatuses.OPEN,
  })
  status: CartStatuses;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  items: CartItemEntity[];
}
