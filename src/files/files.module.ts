import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './files.service';
import { FilesController } from './file.controller';
@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule],
})
export class FilesModule {}
