import { TestBed } from '@angular/core/testing';

import { ServiceusersService} from "./service-users.service";

describe('ServiceUsersService', () => {
  let service: ServiceusersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceusersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
