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
import { CreateUserUseCase } from '../../core/user/application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from '../../core/user/application/use-cases/delete-user/delete-user.use-case';
import { GetUserUseCase } from '../../core/user/application/use-cases/get-user/get-user.use-case';
import { ListUsersUseCase } from '../../core/user/application/use-cases/list-users/list-users.use-case';
import { UpdateUserUseCase } from '../../core/user/application/use-cases/update-user/update-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPresenter } from './presenter/user.presenter';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Inject(UpdateUserUseCase)
  private readonly updateUserUseCase: UpdateUserUseCase;

  @Inject(DeleteUserUseCase)
  private readonly deleteUserUseCase: DeleteUserUseCase;

  @Inject(GetUserUseCase)
  private readonly getUserUseCase: GetUserUseCase;

  @Inject(ListUsersUseCase)
  private readonly listUsersUseCase: ListUsersUseCase;

  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiCreatedResponse({ type: UserPresenter })
  @ApiConflictResponse({ description: 'Usuário com email ou CPF já existente' })
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserPresenter> {
    const user = await this.createUserUseCase.execute(dto);
    return new UserPresenter(user);
  }

  @ApiOperation({ summary: 'Listar usuários com filtros e paginação' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários paginada',
  })
  @Get('search')
  async searchUsers(@Query() searchDto: SearchUsersDto) {
    return await this.listUsersUseCase.execute(searchDto);
  }

  @ApiOperation({ summary: 'Buscar um usuário pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, type: UserPresenter })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<UserPresenter> {
    const user = await this.getUserUseCase.execute({ user_id: userId });
    return new UserPresenter(user);
  }

  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiResponse({ status: HttpStatus.OK, type: UserPresenter })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserPresenter> {
    const user = await this.updateUserUseCase.execute({
      user_id: userId,
      ...dto,
    });
    return new UserPresenter(user);
  }

  @ApiOperation({ summary: 'Deletar um usuário' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    await this.deleteUserUseCase.execute({ user_id: userId });
  }
}
