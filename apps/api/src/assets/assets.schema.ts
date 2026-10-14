import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AssetDocument = HydratedDocument<Asset>;

@Schema({ timestamps: true })
export class Asset {
  @Prop({ required: true, unique: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true }) location!: string;
  @Prop({ required: true, min: 1 }) units!: number;
  @Prop({ required: true, min: 0, max: 100 }) fundedPercent!: number;
  @Prop({ required: true, min: 0, max: 100 }) occupancyPercent!: number;
  @Prop({ enum: ["Operating", "Launching", "Review"], default: "Review" }) status!: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
