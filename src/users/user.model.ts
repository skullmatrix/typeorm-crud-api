// src/users/user.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@Entity({ name: "users" }) // Table name
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, unique: true, nullable: false })
    email!: string;

    @Column({ type: "varchar", length: 50, unique: true, nullable: false })
    username!: string;

    @Column({ type: "varchar", length: 255, nullable: false, select: false }) // Exclude by default
    passwordHash!: string;

    @Column({ type: "varchar", length: 10, nullable: false, default: "" })
    title!: string;

    @Column({ type: "varchar", length: 50, nullable: false, default: "" })
    firstName!: string;

    @Column({ type: "varchar", length: 50, nullable: false, default: "" })
    lastName!: string;

    @Column({ type: "varchar", length: 20, nullable: false, default: "user" })
    role!: string;

    @CreateDateColumn({ type: "timestamp", precision: 6, default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", precision: 6, default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt!: Date;
}