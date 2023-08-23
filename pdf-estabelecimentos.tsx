import { EstabelecimentoListItem } from '@/lib/@core/domain/models/contatos/estabelecimento/estabelecimento.model';
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';

interface PDFData {
    nome: string;
    tipoEstabelecimento?: string;
    cidade: string;
  }

  export const generatePDF = async (estabelecimentos: EstabelecimentoListItem[]) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

page.drawText('Estabelecimentos cadastrados', {
    x: 50,
    y: 800,
    font,
    size: 18,
    color: rgb(0, 0, 0),
  });

  let y = 750;

  for (const estabelecimento of estabelecimentos) {
    const pdfData: PDFData = {
        nome: estabelecimento.nome,
        tipoEstabelecimento: estabelecimento.tipo.nome,
        cidade: estabelecimento.endereco.cidade,
    };

    page.drawText(`Descrição: ${pdfData.nome}`, {
        x: 50,
        y,
        font,
        size: 14,
        color: rgb(0, 0, 0),
      });
  
      page.drawText(`Tipo: ${pdfData.tipoEstabelecimento}`, {
        x: 50,
        y: y - 20,
        font,
        size: 14,
        color: rgb(0, 0, 0),
      });
  
      y -= 20;
  
      page.drawText(`Cidade: ${pdfData.cidade}`, {
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