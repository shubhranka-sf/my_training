// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject, intercept} from '@loopback/core';
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
import { UserRepository, UserRoleRepository } from '../repositories';
import { Role, User } from '../models';
import * as jwt from 'jsonwebtoken';
import { RoleRepository } from '../repositories';
import { UserRoleInterceptor } from '../interceptors';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;
  
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
    @repository(RoleRepository) protected roleRepository: RoleRepository,

    @repository(UserRepository)
    public myUserRepository : UserRepository,

    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
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

  @intercept(UserRoleInterceptor.BINDING_KEY)
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
            exclude: ['id'],
          }),
        },
      },
    })
    newUserRequest: Omit<NewUserRequest, 'id'>,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt(10));
    
    // Find the role first
    const role = await this.roleRepository.findOne({
      where: {role: newUserRequest.role}
    });

    if (!role) {
      throw new HttpErrors.NotFound(`Role ${newUserRequest.role} not found`);
    }

    // Create user without role property
    const userData = _.omit(newUserRequest, ['password', 'role']);
    const savedUser = await this.userRepository.create(userData);
    
    // Set the password
    await this.userRepository.updateById(savedUser.id, {password});

    // Create the user-role relationship
    await this.userRoleRepository.create({
      userId: savedUser.id,
      roleId: role.id
    });

    console.log('User created successfully', savedUser);

    return savedUser;
  }

  @post('/roles', {
    responses: {
      '200': {
        description: 'Role',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Role,
            },
          },
        },
      },
    },
  })
  async createRole(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRole',
            exclude: ['id'],
          }),
        },
      },
    })
    role: Omit<Role, 'id'>,
  ): Promise<Role> {
    return this.roleRepository.create(role);
  }
}