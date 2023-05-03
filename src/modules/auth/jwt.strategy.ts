import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { RolePermissions, User } from '@packages/authorization';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AUTHORIZATION_SERVICE } from 'src/clients';
import { ClientProxy } from '@nestjs/microservices';
import { QueueResult } from '@packages/modules/common/classes/queue-result';
import { UserType } from './constants/auth.constant';
import authConfiguration from '@config/types/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfiguration.KEY)
    private authConfig: ConfigType<typeof authConfiguration>,
    @Inject(AUTHORIZATION_SERVICE)
    private readonly authorizationService: ClientProxy,
  ) {
    const authority = `https://cognito-idp.${authConfig.region}.amazonaws.com/${authConfig.userPoolId}`;
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authority}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<User> {
    const userId = payload.sub;
    const resp = await firstValueFrom(
      this.authorizationService.send<QueueResult<RolePermissions>>(
        'get-role-permissions',
        {
          target: 'current',
          userId,
          onlyGetRolePermissions: true,
        },
      ),
    );
    const userResponse = await lastValueFrom<QueueResult<User | null>>(
      this.authorizationService.send('get-user-by-id', {
        userId,
      }),
    );
    const { roles, permissions } = resp.data || {};

    return {
      userId,
      username: payload.username,
      roles,
      permissions,
      customerId: userResponse.data?.customerId || '',
      type: userResponse.data?.type || UserType.RAK,
    };
  }
}
