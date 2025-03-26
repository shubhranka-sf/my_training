import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Component} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {Request, RestApplication} from '@loopback/rest';
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
import { NodemailerBindings, NodemailerProvider } from 'loopback4-notifications/nodemailer';
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
    this.bind(NotificationBindings.Config).to({
      sendToMultipleReceivers: false,
      senderEmail: 'shubhranka.varma@sourcefuse.com',
    });
    this.bind(NodemailerBindings.Config).to({
      pool: true,
      maxConnections: 100,
      url: '',
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'shubhranka.varma@sourcefuse.com',
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
    this.bind(NotificationBindings.EmailProvider).toProvider(
      NodemailerProvider,
    );
    
    const rateLimitKeyGen = (req: Request) => {
      const token =
        (req.headers &&
          req.headers.authorization &&
          req.headers.authorization.replace(/bearer /i, '')) ||
        '';
      return token;
    };

    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'memoryClient',
      type: "MemcachedStore",
      max:1,
      windowMs: 30 * 1000, // 30 seconds
      keyGenerator: rateLimitKeyGen,
      enabledByDefault: true
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
