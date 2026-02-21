import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from './database/database.service';
import FormData from 'form-data';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async login(name: string, password: string) {
    // ここでユーザー認証のロジックを実装します。
    // 例えば、データベースからユーザー情報を取得し、パスワードを検証するなど。
    const query = `SELECT * FROM users WHERE userid = $1 AND password = $2`;
    const values = [name, password];
    const result = await this.db.query(query, values);

    if (result.rows.length === 0) {
        return { success: false, message: 'Invalid credentials' };
    } else {
        return { success: true, message: 'Login successful', userId: result.rows[0].userid };
    }
  }
}