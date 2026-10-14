import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateAssetDto } from "./assets.dto";
import { AssetsService } from "./assets.service";

@Controller("assets")
export class AssetsController {
  constructor(private readonly assets: AssetsService) {}

  @Get() findAll(@Query("status") status?: string) {
    return this.assets.findAll(status);
  }

  @Get(":id") findOne(@Param("id") id: string) {
    return this.assets.findOne(id);
  }

  @Post() create(@Body() input: CreateAssetDto) {
    return this.assets.create(input);
  }
}
