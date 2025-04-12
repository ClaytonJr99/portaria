import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { PDFDocument } from 'pdf-lib';
import { Boleto, Lote } from '@prisma/client';

interface BoletoCSV {
  nome: string;
  unidade: string;
  valor: string;
  linha_digitavel: string;
  [key: string]: string;
}

interface FiltrosBoleto {
  nome?: string;
  valor_inicial?: string;
  valor_final?: string;
  id_lote?: string;
  relatorio?: string;
}

@Injectable()
export class BoletosService {
  constructor(private prisma: PrismaService) {}

  async importarCsv(file: Express.Multer.File): Promise<Boleto[]> {
    const results: BoletoCSV[] = [];

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv({ separator: ';' }))
        .on('data', (data: BoletoCSV) => {
          results.push(data);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });

    const boletos = await Promise.all(
      results.map(async (row, index) => {
        let lote = await this.prisma.lote.findFirst({
          where: {
            nome: {
              contains: row.unidade.padStart(4, '0'),
            },
          },
        });

        if (!lote) {
          lote = await this.prisma.lote.create({
            data: {
              nome: row.unidade.padStart(4, '0'),
              ativo: true,
            },
          });
        }

        const valorNumerico = parseFloat(row.valor.replace(',', '.'));

        return this.prisma.boleto.create({
          data: {
            nome_sacado: row.nome,
            id_lote: lote.id,
            valor: valorNumerico,
            linha_digitavel: row.linha_digitavel,
          },
        });
      }),
    );

    fs.unlinkSync(file.path);

    return boletos;
  }

  async processarPdf(file: Express.Multer.File): Promise<{ message: string }> {
    const boletos = await this.prisma.boleto.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    if (boletos.length === 0) {
      throw new Error(
        'Nenhum boleto encontrado no banco de dados. Importe boletos via CSV primeiro.',
      );
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const uploadDir = path.join(process.cwd(), 'uploads/boletos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const totalPaginas = Math.min(pdfDoc.getPageCount(), boletos.length);

    for (let i = 0; i < totalPaginas; i++) {
      const boleto = boletos[i];
      const novoPdf = await PDFDocument.create();
      const copyPages = await novoPdf.copyPages(pdfDoc, [i]);
      const pagina = copyPages[0];
      novoPdf.addPage(pagina);

      const novoPdfBytes = await novoPdf.save();
      fs.writeFileSync(path.join(uploadDir, `${boleto.id}.pdf`), novoPdfBytes);
    }

    fs.unlinkSync(file.path);

    return { message: 'PDFs processados com sucesso' };
  }

  async listarBoletos(
    filtros: FiltrosBoleto,
  ): Promise<Array<Boleto & { lote: Lote }> | { base64: string }> {
    const { nome, valor_inicial, valor_final, id_lote, relatorio } = filtros;

    const where: Record<string, unknown> = {
      ativo: true,
    };

    if (nome) {
      where.nome_sacado = {
        contains: nome,
      };
    }

    if (id_lote) {
      where.id_lote = parseInt(id_lote);
    }

    if (valor_inicial || valor_final) {
      where.valor = {};

      if (valor_inicial) {
        (where.valor as Record<string, number>).gte = parseFloat(valor_inicial);
      }

      if (valor_final) {
        (where.valor as Record<string, number>).lte = parseFloat(valor_final);
      }
    }

    const boletos = await this.prisma.boleto.findMany({
      where,
      include: {
        lote: true,
      },
    });

    if (!relatorio || relatorio !== '1') {
      return boletos;
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const pageSize = page.getSize();
    const height = pageSize.height;

    let content = 'Relatório de Boletos\n\n';
    content += 'ID | Nome Sacado | ID Lote | Valor | Linha Digitável\n';
    content += '---------------------------------------------------\n';

    boletos.forEach((boleto) => {
      content += `${boleto.id} | ${boleto.nome_sacado} | ${boleto.id_lote} | ${String(boleto.valor)} | ${boleto.linha_digitavel}\n`;
    });

    page.drawText(content, {
      x: 50,
      y: height - 50,
      size: 12,
    });

    const pdfBytes = await pdfDoc.save();
    const base64 = Buffer.from(pdfBytes).toString('base64');

    return { base64 };
  }
}
