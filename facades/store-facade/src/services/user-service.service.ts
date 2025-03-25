import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {UserRestDsDataSource} from '../datasources';
import {User} from '@training/user-service/src/models/user.model';

export interface UserService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getUserById(id: string): Promise<User>;
  getUsers(): Promise<User[]>;
}

export class UserServiceProvider implements Provider<UserService> {
  constructor(
    // UserRestDS must match the name property in the datasource json file
    @inject('datasources.UserRestDS')
    protected dataSource: UserRestDsDataSource = new UserRestDsDataSource(),
  ) {}

  value(): Promise<UserService> {
    return getService(this.dataSource);
  }
}
