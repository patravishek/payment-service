// payment-service/src/entities/Payment.ts
import 'reflect-metadata';

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  @Entity('payments')
  export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ nullable: false })
    orderId!: string;
  
    @Column({ nullable: false })
    customerId!: string;
  
    @Column({ nullable: true })
    encryptedCardInfo!: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    amount!: number;
  
    @Column({ nullable: true })
    paymentStatus!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }