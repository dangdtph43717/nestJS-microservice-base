import { IsNotEmpty, IsString } from 'class-validator';

export class AuthConfig {
  @IsString()
  @IsNotEmpty()
  userPoolId: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  region: string;
}
