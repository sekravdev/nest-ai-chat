import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthcheck(): { status: number; message: string } {
    return {
      status: 200,
      message: 'ok',
    };
  }
}
