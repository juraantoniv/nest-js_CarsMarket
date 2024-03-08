import { SetMetadata } from '@nestjs/common';

import { SKIP_AUTH } from '../costants/costants';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
