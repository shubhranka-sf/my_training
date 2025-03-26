import {MiddlewareSequence, SequenceHandler} from '@loopback/rest';
import { SequenceActions, FindRoute, ParseParams, InvokeMethod, Send, Reject } from '@loopback/rest';
import { RequestContext } from '@loopback/rest';
import { inject } from '@loopback/core';
import { User } from './models';
import { BearerTokenVerifyProvider } from './providers/bearer-token-provider';
import {Strategies} from 'loopback4-authentication';
import { AuthenticationBindings } from 'loopback4-authentication';
import { AuthenticateFn } from 'loopback4-authentication';
import { RateLimitAction, RateLimitSecurityBindings } from 'loopback4-ratelimiter';
// export class MySequence extends MiddlewareSequence {}

export class MySequence implements SequenceHandler {
    constructor(
      @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
      @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
      @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
      @inject(SequenceActions.SEND) public send: Send,
      @inject(SequenceActions.REJECT) public reject: Reject,
      @inject(AuthenticationBindings.USER_AUTH_ACTION)
      protected authenticateRequest: AuthenticateFn<User>,
      // @inject(Strategies.Passport.BEARER_TOKEN_VERIFIER)
      // protected bearerTokenVerifyProvider: BearerTokenVerifyProvider,
      @inject(RateLimitSecurityBindings.RATELIMIT_SECURITY_ACTION)
      protected rateLimitAction: RateLimitAction,
    ) {}
  
    async handle(context: RequestContext) {
      try {
        const {request, response} = context;
  
        const route = this.findRoute(request);
        const args = await this.parseParams(request, route);
        request.body = args[args.length - 1];
        const authUser: any = await this.authenticateRequest(request, response);
        // rate limit Action here
        await this.rateLimitAction(request, response);
        const result = await this.invoke(route, args);
        this.send(response, result);
      } catch (err) {
        this.reject(context, err);
      }
    }
  }