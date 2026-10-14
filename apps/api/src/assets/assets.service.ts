import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateAssetDto } from "./assets.dto";
import { Asset, AssetDocument } from "./assets.schema";

@Injectable()
export class AssetsService implements OnModuleInit {
  constructor(@InjectModel(Asset.name) private readonly assetModel: Model<AssetDocument>) {}

  async onModuleInit() {
    if (await this.assetModel.estimatedDocumentCount() > 0) return;
    await this.assetModel.insertMany([
      { name: "The Linden", location: "Austin, TX", units: 24, fundedPercent: 92, occupancyPercent: 96, status: "Operating" },
      { name: "Juniper House", location: "Denver, CO", units: 18, fundedPercent: 100, occupancyPercent: 89, status: "Operating" },
      { name: "Parkline Flats", location: "Nashville, TN", units: 32, fundedPercent: 68, occupancyPercent: 0, status: "Launching" },
      { name: "The Marlowe", location: "Charlotte, NC", units: 16, fundedPercent: 100, occupancyPercent: 94, status: "Review" },
    ]);
  }

  findAll(status?: string) {
    return this.assetModel.find(status ? { status } : {}).sort({ createdAt: -1 }).lean().exec();
  }

  async findOne(id: string) {
    const asset = await this.assetModel.findById(id).lean().exec();
    if (!asset) throw new NotFoundException(`Asset ${id} was not found`);
    return asset;
  }

  create(input: CreateAssetDto) {
    return this.assetModel.create(input);
  }
}
