import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateWhitelabelUseCase } from '../../core/whitelabel/application/use-cases/create-whitelabel/create-whitelabel.use-case';
import { DeleteWhitelabelUseCase } from '../../core/whitelabel/application/use-cases/delete-whitelabel/delete-whitelabel.use-case';
import { GetWhitelabelUseCase } from '../../core/whitelabel/application/use-cases/get-whitelabel/get-whitelabel.use-case';
import { ListWhitelabelsUseCase } from '../../core/whitelabel/application/use-cases/list-whitelabels/list-whitelabels.use-case';
import { UpdateWhitelabelUseCase } from '../../core/whitelabel/application/use-cases/update-whitelabel/update-whitelabel.use-case';
import { CreateWhitelabelDto } from './dto/create-whitelabel.dto';
import { SearchWhitelabelsDto } from './dto/search-whitelabels.dto';
import {
  PaginatedWhitelabelPresenter,
  WhitelabelPresenter,
} from './presenter/whitelabel.presenter';

@ApiTags('Whitelabels')
@Controller('whitelabels')
export class WhitelabelsController {
  @Inject(CreateWhitelabelUseCase)
  private readonly createWhitelabelUseCase: CreateWhitelabelUseCase;

  @Inject(UpdateWhitelabelUseCase)
  private readonly updateWhitelabelUseCase: UpdateWhitelabelUseCase;

  @Inject(DeleteWhitelabelUseCase)
  private readonly deleteWhitelabelUseCase: DeleteWhitelabelUseCase;

  @Inject(GetWhitelabelUseCase)
  private readonly getWhitelabelUseCase: GetWhitelabelUseCase;

  @Inject(ListWhitelabelsUseCase)
  private readonly listWhitelabelsUseCase: ListWhitelabelsUseCase;

  @ApiOperation({
    summary: 'Criar um Whitelabel',
    description: 'Cria um novo Whitelabel',
  })
  @ApiCreatedResponse({ type: WhitelabelPresenter })
  @ApiConflictResponse({ description: 'Whitelabel com nome já existente' })
  @Post()
  async createWhitelabel(
    @Body() dto: CreateWhitelabelDto,
  ): Promise<WhitelabelPresenter> {
    const whitelabel = await this.createWhitelabelUseCase.execute(dto);
    return new WhitelabelPresenter(whitelabel);
  }

  @ApiOperation({ summary: 'Buscar Whitelabels' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permite buscar Whitelabels com paginação',
    type: PaginatedWhitelabelPresenter,
  })
  @Get('search')
  async searchWhitelabels(@Query() searchDto: SearchWhitelabelsDto) {
    const whitelabelsPaginationResult =
      await this.listWhitelabelsUseCase.execute(searchDto);
    return PaginatedWhitelabelPresenter.toCollection(
      whitelabelsPaginationResult,
    );
  }

  @ApiOperation({ summary: 'Buscar um Whitelabel pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, type: WhitelabelPresenter })
  @ApiNotFoundResponse({ description: 'Whitelabel não encontrado' })
  @Get(':whitelabelId')
  async getWhitelabel(
    @Param('whitelabelId') whitelabelId: string,
  ): Promise<WhitelabelPresenter> {
    const whitelabel = await this.getWhitelabelUseCase.execute({
      whitelabelId,
    });
    return new WhitelabelPresenter(whitelabel);
  }

  @ApiOperation({ summary: 'Atualizar um Whitelabel' })
  @ApiResponse({ status: HttpStatus.OK, type: WhitelabelPresenter })
  @ApiNotFoundResponse({ description: 'Whitelabel não encontrado' })
  @Put(':whitelabelId')
  async updateWhitelabel(
    @Param('whitelabelId') whitelabelId: string,
    @Body() dto: CreateWhitelabelDto,
  ): Promise<WhitelabelPresenter> {
    const whitelabel = await this.updateWhitelabelUseCase.execute({
      ...dto,
      whitelabelId,
    });
    return new WhitelabelPresenter(whitelabel);
  }

  @ApiOperation({ summary: 'Deletar um Whitelabel' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiNotFoundResponse({ description: 'Whitelabel não encontrado' })
  @Delete(':whitelabelId')
  async deleteWhitelabel(
    @Param('whitelabelId') whitelabelId: string,
  ): Promise<void> {
    await this.deleteWhitelabelUseCase.execute({ whitelabelId });
  }
}
