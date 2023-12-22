import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, ObjectId } from "mongoose";
import { Rent, RentDocument } from "./rent.model";
import { RentRepository } from "./rent.repository";

@Injectable()
export class RentService {
  constructor(
    private readonly rentRepository: RentRepository,
  ) {}

  async create(rentData: Rent) {
    await this.rentRepository.create(rentData);
  }

  async findOneById(id: number) {
    return await this.rentRepository.findOneByProjectId(id);
  }

  async findOne(filter: FilterQuery<Rent> = {}) {
    return await this.rentRepository.findOne(filter);
  }
}