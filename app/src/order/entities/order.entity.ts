import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Column,
} from 'typeorm';
import { Address, OrderStatus } from '../type';
import { UserEntity } from '../../users/entities/user.entity';
import { CartEntity } from '../../cart/entities/cart.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  userId: string;

  @OneToOne(() => CartEntity)
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @Column('json')
  payment: unknown;

  @Column('json')
  delivery: Address;

  @Column('text')
  comments: string;

  @Column('enum', {
    enumName: 'order_status',
    enum: OrderStatus,
    default: OrderStatus.Open,
  })
  status: OrderStatus;

  @Column('money')
  total: number;
}
