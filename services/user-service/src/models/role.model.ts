import {Entity, model, property, hasMany} from '@loopback/repository';
import {Permissions} from 'loopback4-authorization';
import {User} from './user.model';
import {UserRole} from './user-role.model';

@model()
export class Role extends Entity implements Permissions<string> {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  role: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];

  @hasMany(() => User, {
    through: {model: () => UserRole, keyFrom: 'roleId', keyTo: 'userId'},
  })
  users: User[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
