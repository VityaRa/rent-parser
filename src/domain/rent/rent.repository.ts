import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId } from 'mongoose';
import { Rent, RentDocument } from './rent.model';

@Injectable()
export class RentRepository {
  constructor(@InjectModel(Rent.name) private rentModel: Model<RentDocument>) {}

  async findAll(): Promise<Rent[]> {
    return this.rentModel.find();
  }

  async create(rentData: Rent): Promise<Rent> {
    return this.rentModel.create(rentData);
  }

  async deleteById(id: ObjectId) {
    await this.rentModel.findByIdAndDelete(id);
  }

  async findOneByProjectId(projectId: number) {
    await this.rentModel.findOne({ projectId });
  }

  async findOne(filter: FilterQuery<Rent> = {}) {
    return this.rentModel.findOne(filter);
  }
}
