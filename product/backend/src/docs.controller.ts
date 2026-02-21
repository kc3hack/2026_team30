import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Post('graph')
  @UseInterceptors(FileInterceptor('file'))
  async getGraph(@UploadedFile() file: Express.Multer.File) {
    const result = await this.docsService.getEmotionGraph(file);

    // JSONで返す
    return {
      imageBase64: result.imageBase64,
      text: result.text,
    };
  }
}