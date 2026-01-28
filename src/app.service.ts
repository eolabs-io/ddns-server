import { Injectable } from '@nestjs/common';
import { DigitalOcean } from './provider/digital-ocean';
import { Provider } from './provider/provider';

@Injectable()
export class AppService {
  async updateDns(providerName: string, hostname: string, myip: string) {
    const provider = this.getProvider(providerName, hostname);

    const record = await provider.updateOrCreateRecord(myip);

    return record ? true : false;
  }

  private getProvider(providerName: string, hostname: string): Provider {
    if (providerName == 'do') return new DigitalOcean({ name: hostname });
  }
}
