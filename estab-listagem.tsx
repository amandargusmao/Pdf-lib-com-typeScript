import React from "react";
import { generatePDF } from './pdf-estabelecimentos';
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Navegacao, EstabelecimentoListItem } from "@/lib/@core/domain/models";
import { EstabelecimentoServer } from "@/lib/@core/infra/server";
import { withSessionSsr } from "@/lib/config/session/with-session";
import ToolbarListagem from "@/components/toolbars/ToolbarListagem";
import RootListLayout from "@/layouts/list-root/RootListLayout";
import NavTabs from "@/components/base/navigation/NavTabs";
import RootLayout from "@/layouts/root/RootLayout";
import TabelaAlvos from "@/components/amb-defensavel/estabelecimento/TabelaAlvos";

interface PageProps {
  estabelecimentos: EstabelecimentoListItem[];
}
const EstabListagem: NextPage<PageProps> = ({ estabelecimentos }) => {
  const router = useRouter();

  function navToEstabForm(estabId?: string) {
    if (estabId !== undefined) {
      router.replace(`estab-form?id=${estabId}`);
    } else {
      router.replace('estab-form?id=novo');
    }
  }

  async function handleDownloadClick() {
    try {
      const pdfBytes = await generatePDF(estabelecimentos);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'estabelecimentos.pdf';
      link.click();
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
    }
  }

  return (
    <>
      <RootLayout pageTitle="Ambiente defensável > Contatos > Estabelecimentos">
        <NavTabs tabs={Navegacao.AmbienteDefensavel.PlanoDefesa.contatos.abas} />
        <ToolbarListagem
          textoBtnNovo="Novo"
          onNewClick={() => navToEstabForm()}
          onDownloadClick={handleDownloadClick}
        />

        <RootListLayout>
          <TabelaAlvos
            alvos={estabelecimentos}
            onEditItem={(id) => navToEstabForm(id)}
          />
        </RootListLayout>
      </RootLayout>
      {/* É possível incluir um footer nessa região */}
    </>
  );
};

export default EstabListagem;

export const getServerSideProps = withSessionSsr(
  async function getStaticProps({ req }) {
    const usuarioLogado = req.session.usuario;
    if (usuarioLogado === undefined) {
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      };
    }

    let estabelecimentos;
    try {
      estabelecimentos = await EstabelecimentoServer.getAll({ idUnidade: usuarioLogado.unidadeId, possivelAlvo: false });
    } catch (error) {
      console.error(error);
      return {
        redirect: {
          permanent: false,
          destination: "erros/erro"
        }
      };
    }

    return {
      props: {
        estabelecimentos: JSON.parse(JSON.stringify(estabelecimentos))
      }
    };
  },
);