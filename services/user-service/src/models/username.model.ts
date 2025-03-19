import {Entity, model, property} from '@loopback/repository';
import { Role } from './role.enum';
import { FormattedDate } from '../decorators/foramt-date.decorator';

@model()
export class Username extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;
  
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Role)
    }
  })
  role?: string;

  @property({
    type: 'date',
  })
  @FormattedDate()
  createdOn?: string;
  
  @FormattedDate()
  @property({
    type: 'date',
  })
  modifiedOn?: string;

  constructor(data?: Partial<Username>) {
    super(data);
  }
}

export interface UsernameRelations {
  // describe navigational properties here
}

export type UsernameWithRelations = Username & UsernameRelations;
