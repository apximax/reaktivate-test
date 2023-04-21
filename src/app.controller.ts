import { Controller, Get, Post, Body, Session } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { AppService } from './app.service';

class AuthDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Post('/login')
  login(@Body() body: AuthDto, @Session() session: Record<string, any>): void {
    session.username = body.username;
  }

  @Get()
  getHello(@Session() session: Record<string, any>): string {
    return this.appService.getHello();
  }
}
