import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function criarPdfExemplo(): Promise<void> {
  const pdfDoc = await PDFDocument.create();

  const nomes = ['MARCIA CARVALHO', 'JOSE DA SILVA', 'MARCOS ROBERTO'];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const nome of nomes) {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    page.drawText(`Boleto Condomínio Green Park`, {
      x: 50,
      y: height - 50,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Nome do Sacado: ${nome}`, {
      x: 50,
      y: height - 100,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Linha Digitável: 123456123456123456`, {
      x: 50,
      y: height - 130,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      `Valor: R$ ${nome === 'JOSE DA SILVA' ? '182,54' : nome === 'MARCOS ROBERTO' ? '178,20' : '128,00'}`,
      {
        x: 50,
        y: height - 160,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      },
    );
  }

  const dir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(dir, 'boletos_exemplo.pdf'), pdfBytes);
}

criarPdfExemplo().catch(console.error);
