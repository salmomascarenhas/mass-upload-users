import {
  Controller,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadUsersService } from './upload-users.service';

@ApiTags('Users')
@Controller('users')
export class UploadUsersController {
  constructor(private readonly uploadUsersService: UploadUsersService) {}

  @ApiOperation({
    summary: 'Fazer upload de um arquivo CSV para criar usuários',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upload realizado com sucesso',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo CSV para upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileExt = extname(file.originalname);
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(
            new HttpException(
              'Apenas arquivos CSV são permitidos',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1024 }), // 1GB
          new FileTypeValidator({ fileType: 'text/csv' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file)
      throw new HttpException('Arquivo não enviado', HttpStatus.BAD_REQUEST);

    const result = await this.uploadUsersService.uploadUsers({
      filePath: file.path,
    });

    return {
      message: 'CSV import finalizado com sucesso!',
      ...result,
    };
  }
}
