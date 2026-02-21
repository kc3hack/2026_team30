import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Post('graph')
  @UseInterceptors(FileInterceptor('file'))
  @Header('Content-Type', 'image/png') // 画像返すなら
  async getGraph(@UploadedFile() file: Express.Multer.File) {
    return await this.docsService.getEmotionGraph(file);
  }
}