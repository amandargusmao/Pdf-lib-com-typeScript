import ToolbarListagem from "@/components/toolbars/ToolbarListagem";
import RootListLayout from "@/layouts/list-root/RootListLayout";
import RootLayout from "@/layouts/root/RootLayout";
import { UnidadeHospitalarListItem, Navegacao } from "@/lib/@core/domain/models";
import { UnidadeHospitalarServer } from "@/lib/@core/infra/server";
import { withSessionSsr } from "@/lib/config/session/with-session";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import NavTabs from "@/components/base/navigation/NavTabs";
import TabelaUnidadeHospitalar from "@/components/amb-defensavel/contato/hospitais/TebelaUnidadeHospitalar";
import { generatePDF } from './pdf-hospitais';

interface PageProps {
  hospitais: UnidadeHospitalarListItem[];
}
const UnidadeHospitalarListagem: NextPage<PageProps> = ({ hospitais }) => {
  const router = useRouter();

  function navToUnidadeHospitalarForm(undId?: string) {
    if (undId !== undefined) {
      router.replace(`hosp-form?id=${undId}`);
    } else {
      router.replace('hosp-form?id=novo');
    }
  }

  async function handleDownloadClick() {
    try {
      const pdfBytes = await generatePDF(hospitais);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'unidadesHospitalares.pdf';
      link.click();
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
    }
  }

  // TODO: IMPLEMENTAR BUSCA E FILTROS
  return (
    <>
      <RootLayout pageTitle="Plano de defesa > Contatos > Unidades hospitalares">
        <NavTabs tabs={Navegacao.AmbienteDefensavel.PlanoDefesa.contatos.abas} />
        <ToolbarListagem
          onNewClick={() => navToUnidadeHospitalarForm()}
          onDownloadClick={handleDownloadClick}
        />
        <RootListLayout>
          <TabelaUnidadeHospitalar
            itens={hospitais}
            onEdit={navToUnidadeHospitalarForm}
          />
        </RootListLayout>
      </RootLayout>
    </>
  );
}

export default UnidadeHospitalarListagem;

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

    const hospitais = await UnidadeHospitalarServer.getAll({ idUnidade: usuarioLogado.unidadeId });

    return {
      props: {
        hospitais: JSON.parse(JSON.stringify(hospitais))
      }
    };
  },
);