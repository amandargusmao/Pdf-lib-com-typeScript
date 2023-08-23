import React, { useState } from 'react';
import { generatePDF } from './pdf-forcaSeguranca';
import ToolbarListagem from '@/components/toolbars/ToolbarListagem';
import RootListLayout from '@/layouts/list-root/RootListLayout';
import RootLayout from '@/layouts/root/RootLayout';
import { ForcaSegurancaListItem, Navegacao } from '@/lib/@core/domain/models';
import { withSessionSsr } from '@/lib/config/session/with-session';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import NavTabs from '@/components/base/navigation/NavTabs';
import TabelaForcaSeguranca from '@/components/amb-defensavel/contato/forcas-seguranca/TebelaForcasSeguranca';
import { ForcaSegurancaServer } from '@/lib/@core/infra/server/contatos/forcas-seguranca.prisma';

interface PageProps {
  forcasSeg: ForcaSegurancaListItem[];
}

const ForcaSegurancaListagem: NextPage<PageProps> = ({ forcasSeg }) => {
  const router = useRouter();

  function navToForcaSegurancaForm(autId?: string) {
    if (autId !== undefined) {
      router.replace(`forca-seg-form?id=${autId}`);
    } else {
      router.replace("forca-seg-form?id=novo");
    }
  }

  async function handleDownloadClick() {
    try {
      const pdfBytes = await generatePDF(forcasSeg); // Gera o PDF com os dados existentes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "forcasSeguranca.pdf";
      link.click();
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
    }
  }

  return (
    <>
      <RootLayout pageTitle="Plano de defesa > Contatos > Forças de segurança">
        <NavTabs tabs={Navegacao.AmbienteDefensavel.PlanoDefesa.contatos.abas} />
        <ToolbarListagem
          textoBtnNovo="Nova"
          onNewClick={() => navToForcaSegurancaForm()}
          onDownloadClick={handleDownloadClick} // Adicionar a chamada para a função de download
        />
        <RootListLayout>
          <TabelaForcaSeguranca
            forcasSegurancaList={forcasSeg}
            onEdit={navToForcaSegurancaForm}
          />
        </RootListLayout>
      </RootLayout>
    </>
  );
};

export default ForcaSegurancaListagem;

export const getServerSideProps = withSessionSsr(
  async function getStaticProps({ req }) {
    const usuarioLogado = req.session.usuario;
    if (usuarioLogado === undefined) {
      return {
        redirect: {
          permanent: false,
          destination: "erros/erro"
        }
      };
    }

    const forcasSeg = await ForcaSegurancaServer.getAll({ idUnidade: usuarioLogado.unidadeId });

    return {
      props: {
        forcasSeg: JSON.parse(JSON.stringify(forcasSeg.itens))
      }
    };
  })