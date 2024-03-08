import { SetMetadata } from '@nestjs/common';

export const RightsDecorator = (...users: string[]) =>
  SetMetadata('rights', users);
