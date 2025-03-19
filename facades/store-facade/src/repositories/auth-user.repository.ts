import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AuthUser, AuthUserRelations} from '../models';

export class AuthUserRepository extends DefaultCrudRepository<
  AuthUser,
  typeof AuthUser.prototype.id,
  AuthUserRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(AuthUser, dataSource);
  }
}
