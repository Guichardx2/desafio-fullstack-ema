import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Events {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', name: 'title', length: 100, nullable: false })
    title: string;

    @Column({ type: 'text', name: 'description', nullable: false})
    description: string;

    @Column({ type: 'datetime', name: 'start_date', nullable: false })
    startDate: Date;

    @Column({ type: 'datetime', name: 'end_date', nullable: false })
    endDate: Date;

    @Column({ type: 'varchar', name: 'location', length: 100, nullable: false })
    location: string;
}
export default Events;