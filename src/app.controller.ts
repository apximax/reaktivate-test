import { Controller, Get, Post, Body, Session } from '@nestjs/common';
import { AppService } from './app.service';

class AuthDto {
  username: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Post('/login')
  login(@Body() body: AuthDto, @Session() session: Record<string, any>): void {
    session.usernmae = body.username;
  }

  @Get()
  getHello(@Session() session: Record<string, any>): string {
    return this.appService.getHello();
  }
}
