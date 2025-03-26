import {
  /* inject, */
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: UserRoleInterceptor.BINDING_KEY}})
export class UserRoleInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${UserRoleInterceptor.name}`;

  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      const methodName = invocationCtx.methodName;
      if (methodName === 'createUser') {
        const args = invocationCtx.args;
        const data = args[0];
        console.log(data)
        if (
          !data.role
        ) {
          throw new HttpErrors.BadRequest(
            'User creation requires at least one role.',
          );
        }
      }
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
