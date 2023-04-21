import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

import { RedisService } from './redis.service';

const PREFIX = 'activity';

interface IActivity {
  activityStartTime: number;
  lastInteractionTime: number;
}

@Injectable()
export class BlockUserMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}
  
  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    if (!request.session.username) {
      response.status(401).send('Unauthorized');
      return;
    }
    
    const sessionDurationTime = this.configService.get('sessionDurationTime');
    const sessionBreakTime = this.configService.get('sessionBreakTime');
    
    const redisKey = `${PREFIX}:${request.session.username}`;
    
    // Here we will have user activity data no matter what device he/she uses.
    // The idea is while having separate sessions for each user's device
    // also have user's activity data for all his/her devices in one place
    // to be able to block all the user's sessions
    const userActivity = await this.redisService.getData(redisKey) as IActivity;

    const now = Date.now();
    
    if (!userActivity || (now - userActivity.lastInteractionTime >= sessionBreakTime)) {
      await this.redisService.setData(redisKey, {
        activityStartTime: now,
        lastInteractionTime: now,
      });
      
      next();
      return;
    }
    
    if (userActivity.lastInteractionTime - userActivity.activityStartTime >= sessionDurationTime) {
      response.status(403).send('You have been blocked for 5 minutes.');
      return;
    }

    await this.redisService.setData(redisKey, {
      ...userActivity,
      lastInteractionTime: now,
    });
    
    next();
  }
}
