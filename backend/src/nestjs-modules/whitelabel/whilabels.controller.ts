import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Whitelabels')
@Controller('whitelabels')
export class WhitelabelsController {}
