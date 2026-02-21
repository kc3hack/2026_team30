import { Controller, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocsService } from './docs.service';
import type { Response } from 'express'; // ← 'import type' に変更

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Post('graph')
  @UseInterceptors(FileInterceptor('file'))
  async getGraph(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const pngBytes = await this.docsService.getEmotionGraph(file);

    res.setHeader('Content-Type', 'image/png');
    res.send(pngBytes);
  }
}