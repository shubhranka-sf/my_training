import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Component} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
// import {AuthenticationServiceComponent, Otp} from '@sourceloop/authentication-service';
// import {AuthServiceBindings} from '@sourceloop/authentication-service';
import { RateLimiterComponent, RateLimitSecurityBindings } from 'loopback4-ratelimiter';
import { ChatServiceBindings, ChatServiceComponent } from '@sourceloop/chat-service';
// import { AuthenticationBindings, AuthenticationComponent } from 'loopback4-authentication';
import { AuthenticationComponent } from 'loopback4-authentication'
import { NotificationBindings, NotificationsComponent } from 'loopback4-notifications';
import { NodemailerProvider } from 'loopback4-notifications/nodemailer';
import { User } from './models';
import {Strategies} from 'loopback4-authentication';
import * as dotenv from 'dotenv';
import { BearerTokenVerifyProvider } from './providers/bearer-token-provider';
import { JWTAuthenticationComponent } from '@loopback/authentication-jwt';
import { AuthorizationBindings, AuthorizationComponent } from 'loopback4-authorization';
dotenv.config();

export {ApplicationConfig};

export class StoreFacadeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    
    // Set up the custom sequence
    this.sequence(MySequence);
    
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(RateLimiterComponent);
    // this.component(ChatServiceComponent as any);
    this.component(NotificationsComponent);
    this.bind(NotificationBindings.EmailProvider).toProvider(
      NodemailerProvider,
    );
    
    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'memoryClient',
      type: "MemcachedStore"
    });
      

    // Add authentication component
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    // Customize authentication verify handlers
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);
    
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
