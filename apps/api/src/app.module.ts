import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AssetsModule } from "./assets/assets.module";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? "mongodb://localhost:27017/lotline"),
    AssetsModule,
  ],
})
export class AppModule {}
