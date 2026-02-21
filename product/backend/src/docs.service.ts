import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import type { Express } from 'express';

@Injectable()
export class DocsService {
  async getEmotionGraph(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(
      'http://emotion-api:8000/docsAnalyze/',
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    // ここで文字起こしも同時に受け取るなら、別APIを呼ぶか
    // emotion-api 側で PNG + JSON を返す必要あり
    // 仮にテキストを返す場合は JSON としてまとめる
    const transcriptText = response.data.text || '文字起こしテキストが取得できませんでした';

    return {
      imageBase64: response.data.imageBase64, // emotion-api 側で base64 エンコードして返す想定
      text: transcriptText,
    };
  }
}