import { IsNotEmpty } from 'class-validator';

export class MicroserviceConfig {
  @IsNotEmpty()
  uris: string[];

  @IsNotEmpty()
  queue: string;

  autoAck: boolean;
}
