// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash, compareSync} from 'bcryptjs';
import _ from 'lodash';
import { MyUserRepository } from '../repositories';
import { User } from '../models';
import * as jwt from 'jsonwebtoken';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 4,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,

    @repository(MyUserRepository)
    public myUserRepository : MyUserRepository,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {

    // const hashedPassword = await hash(credentials.password, 10);
    // ensure the user exists, and the password is correct
    const user = await this.myUserRepository.findOne({
      where: {email: credentials.email},
    });
    const matchpassword = user && compareSync(credentials.password, user.password!);
    if (!user || !matchpassword) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const userProfile = {
      [securityId]: user.id!.toString(),
      name: user.username,
      id: user.id,
      email: user.email,
    };

    // create a JSON Web Token based on the user profile
    // const token = await this.jwtService.generateToken(userProfile);
    const expiresIn = process.env.JWT_EXPIRATION || '3600';
    const audience = process.env.JWT_AUDIENCE;
    const issuer = process.env.JWT_ISSUER;
    const subject = user.username;
    const token = jwt.sign(userProfile, process.env.JWT_SECRET!, {
      expiresIn: parseInt(expiresIn),
      audience: audience,
      issuer: issuer,
      subject: subject
    } )
    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt(10));
    const savedUser = await this.myUserRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.myUserRepository.updateById(savedUser.id, {password})

    return savedUser;
  }
}