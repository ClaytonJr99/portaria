import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoletosService } from './boletos.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('boletos')
export class BoletosController {
  private readonly logger = new Logger(BoletosController.name);

  constructor(private readonly boletosService: BoletosService) {
    // Garantir que o diretório de uploads existe
    const tempDir = path.join(process.cwd(), 'uploads/temp');
    if (!fs.existsSync(tempDir)) {
      this.logger.log(`Criando diretório: ${tempDir}`);
      fs.mkdirSync(tempDir, { recursive: true });
    }
  }

  @Post('importar-csv')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: '/tmp',
    }),
  )
  async importarCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo CSV foi enviado');
    }

    this.logger.log(`Arquivo recebido: ${file.originalname}`);

    try {
      const resultado = await this.boletosService.importarCsv(file);
      return resultado;
    } catch (error) {
      this.logger.error(`Erro ao importar arquivo CSV: ${error.message}`);
      throw new BadRequestException(
        `Erro ao processar o arquivo: ${error.message}`,
      );
    }
  }

  @Post('importar-pdf')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: '/tmp',
    }),
  )
  async importarPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo PDF foi enviado');
    }

    return this.boletosService.processarPdf(file);
  }

  @Get()
  async listarBoletos(
    @Query('nome') nome?: string,
    @Query('valor_inicial') valorInicial?: string,
    @Query('valor_final') valorFinal?: string,
    @Query('id_lote') idLote?: string,
    @Query('relatorio') relatorio?: string,
  ) {
    return this.boletosService.listarBoletos({
      nome,
      valor_inicial: valorInicial,
      valor_final: valorFinal,
      id_lote: idLote,
      relatorio,
    });
  }
}
