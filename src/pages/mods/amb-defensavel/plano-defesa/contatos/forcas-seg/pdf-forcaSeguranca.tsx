import { ForcaSegurancaListItem } from '@/lib/@core/domain/models/contatos/forca-seguranca/forca-seguranca.model';
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';

interface PDFData {
  descricao: string;
  cidade: string;
  uf: string;
  telefonePrincipal: string;
}

export const generatePDF = async (forcasSeg: ForcaSegurancaListItem[]) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage(PageSizes.A4);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('Informações - Forças de Segurança', {
    x: 50,
    y: 800,
    font,
    size: 18,
    color: rgb(0, 0, 0),
  });

  let y = 750;
  for (const forcaSeg of forcasSeg) {
    const pdfData: PDFData = {
      descricao: forcaSeg.descricao,
      cidade: forcaSeg.cidade,
      uf: forcaSeg.uf,
      telefonePrincipal: forcaSeg.contato.telefonePrincipal,
    };

    page.drawText(`Descrição: ${pdfData.descricao}`, {
      x: 50,
      y,
      font,
      size: 14,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Cidade: ${pdfData.cidade}`, {
      x: 50,
      y: y - 20,
      font,
      size: 14,
      color: rgb(0, 0, 0),
    });

    y -= 20;

    page.drawText(`UF: ${pdfData.uf}`, {
      x: 50,
      y: y - 20,
      font,
      size: 14,
      color: rgb(0, 0, 0),
    });

    y -= 20;

    page.drawText(`Telefone: ${pdfData.telefonePrincipal}`, {
      x: 50,
      y: y - 20,
      font,
      size: 14,
      color: rgb(0, 0, 0),
    });

    y -= 60;
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};