import { IsIn, IsInt, IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateAssetDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) location!: string;
  @IsInt() @Min(1) units!: number;
  @IsNumber() @Min(0) @Max(100) fundedPercent!: number;
  @IsNumber() @Min(0) @Max(100) occupancyPercent!: number;
  @IsIn(["Operating", "Launching", "Review"]) status!: string;
}
