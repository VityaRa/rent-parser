import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Project } from '../config/project.enum';

export type RentDocument = HydratedDocument<Rent>;

@Schema()
export class Rent {
  @Prop()
  title: string;

  @Prop()
  address: string;

  @Prop()
  pricePerMonth: number;

  @Prop()
  commission: number;

  @Prop()
  floor: number;

  @Prop()
  totalFloor: number;

  @Prop()
  square: number;

  @Prop()
  description: string;

  @Prop()
  parsedAt: number;

  @Prop({ type: String, enum: Project })
  project: Project;

  @Prop()
  platformId: number;

  @Prop()
  roomCount: number;

  @Prop()
  link: string;
}

export const RentSchema = SchemaFactory.createForClass(Rent).index({ platformId: 1, project: 1 });