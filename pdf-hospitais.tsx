import { UnidadeHospitalarListItem } from '@/lib/@core/domain/models/contatos/unidade-hospitalar/unidade-hospitalar.model';
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';

interface PDFData {
    descricao: string;
    tipoAtendimento: string;
    telefonePrincipal: string;
  }

  export const generatePDF = async (unidadeHospitalares: UnidadeHospitalarListItem[]) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawText('Unidades Hospitalares', {
    x: 50,
    y: 800,
    font,
    size: 18,
    color: rgb(0, 0, 0),
  });

  let y = 750;
  
  for (const unidadeHospitalar of unidadeHospitalares) {
    const pdfData: PDFData = {
      descricao: unidadeHospitalar.descricao,
      tipoAtendimento: unidadeHospitalar.tipoAtendimento,
      telefonePrincipal: unidadeHospitalar.telefonePrincipal,
    };

    page.drawText(`Descrição: ${pdfData.descricao}`, {
        x: 50,
        y,
        font,
        size: 14,
        color: rgb(0, 0, 0),
      });
  
      page.drawText(`Tipo de atendimento: ${pdfData.tipoAtendimento}`, {
        x: 50,
        y: y - 20,
        font,
        size: 14,
        color: rgb(0, 0, 0),
      });
  
      y -= 20;
  
      page.drawText(`Telefone principal: ${pdfData.telefonePrincipal}`, {
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