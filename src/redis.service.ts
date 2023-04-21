import { Injectable, Logger } from '@nestjs/common';
import * as redis from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly client: redis.RedisClientType;

  constructor(private configService: ConfigService) {
    this.client = redis.createClient({
      socket: {
        host: configService.get('redis').host,
        port: configService.get('redis').port,
      },
    });

    this.client.on('error', err => Logger.error('Redis Server Error', err));
  }

  async getClient(): Promise<redis.RedisClientType> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    return this.client;
  }
  
  async getData(key: string): Promise<Record<string, any>> {
    const client = await this.getClient();
    const data = await client.get(key);
    return JSON.parse(data);
  }
  
  async setData(key: string, data: Record<string, any>): Promise<void> {
    const client = await this.getClient();
    await client.set(key, JSON.stringify(data));
  }
}
