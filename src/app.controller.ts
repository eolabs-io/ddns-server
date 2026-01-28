import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/do/update')
  async updateDdns(
    @Query('hostname') hostname: string,
    @Query('myip') myip: string,
  ): Promise<boolean> {
    return await this.appService.updateDns('do', hostname, myip);
  }
}
