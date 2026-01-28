import { DigitalOcean } from './digital-ocean';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { DomainRecordPayload } from './provider';

describe('DigitalOcean', () => {
  let digitalOcean: DigitalOcean;
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  beforeEach(async () => {
    digitalOcean = new DigitalOcean({ name: 'vpn.eolabs.io' });
  });

  describe('DigitalOcean Domain Records', () => {
    it('should get Domain Record', async () => {
      mock.onGet('/v2/domains/eolabs.io/records').reply(200, mockRecords);

      const record = await digitalOcean.getDomainRecord();
      expect(record).toMatchObject(mockRecords.domain_records[0]);
    });

    it('should create a New Domain Record', async () => {
      mock
        .onPost('/v2/domains/eolabs.io/records')
        .reply(200, mockCreatedRecord);

      const { type, name, data, ttl } = mockCreatedRecord.domain_record;
      const payload = { type, name, data, ttl } as DomainRecordPayload;

      const record = await digitalOcean.createDomainRecord(payload);
      expect(record).toMatchObject(mockCreatedRecord.domain_record);
    });

    it('should update a Domain Record', async () => {
      const endpoint = new RegExp('/v2/domains/eolabs.io/records/.*');
      mock.onPatch(endpoint).reply(200, mockUpdatedRecord);

      const {
        id: domainRecordId,
        type,
        name,
        data,
        ttl,
      } = mockUpdatedRecord.domain_record;
      const payload = { type, name, data, ttl } as DomainRecordPayload;

      const record = await digitalOcean.updateDomainRecord(
        domainRecordId,
        payload,
      );
      expect(record).toMatchObject(mockUpdatedRecord.domain_record);
    });

    it('should delete a Domain Record', async () => {
      const endpoint = new RegExp('/v2/domains/eolabs.io/records/.*');
      mock.onDelete(endpoint).reply(204);

      const { id: domainRecordId } = mockUpdatedRecord.domain_record;

      const success = await digitalOcean.deleteDomainRecord(domainRecordId);
      expect(success).toBeTruthy();
    });
  });
});

///////////////////////
// mocks
///////////////////////

const mockCreatedRecord = {
  domain_record: {
    id: 11111111,
    type: 'A',
    name: 'vpn',
    data: '1.2.3.4',
    priority: null,
    port: null,
    ttl: 30,
    weight: null,
    flags: null,
    tag: null,
  },
};

const mockUpdatedRecord = {
  domain_record: {
    id: 4444444,
    type: 'A',
    name: 'vpn',
    data: '4.3.2.1',
    priority: null,
    port: null,
    ttl: 30,
    weight: null,
    flags: null,
    tag: null,
  },
};

const mockRecords = {
  domain_records: [
    {
      id: 22222222,
      type: 'A',
      name: 'vpn',
      data: '1.2.3.4',
      priority: null,
      port: null,
      ttl: 30,
      weight: null,
      flags: null,
      tag: null,
    },
  ],
  links: {},
  meta: {
    total: 4,
  },
};
