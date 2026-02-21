import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class DocsService {
  async getEmotionGraph(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    console.log(file);

    const response = await axios.post(
      'http://emotion-api:8000/docsAnalyze/',
      formData,
      {
        headers: formData.getHeaders(),
        responseType: 'arraybuffer', // 画像なら必要
      },
    );

    return Buffer.from(response.data);
  }
}