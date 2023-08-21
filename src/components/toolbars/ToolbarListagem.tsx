import React from 'react';
import ResponsiveIconButton from '../common/buttons/ResponsiveIconButton';
import SearchField from '../common/inputs/SearchField';

interface SearchProps {
  exibir?: boolean;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

interface TFProps {
  exibirBtnNovo?: boolean;
  exibirBtnFiltrar?: boolean;
  exibirBtnDownload?: boolean; // Adicione essa propriedade
  textoBtnNovo?: string;
  exibirCampoBusca?: boolean;
  onNewClick?: () => void;
  onFilterClick?: () => void;
  onDownloadClick?: () => void; // Adicione essa propriedade
  searchProps?: SearchProps;
}

const ToolbarListagem: React.FC<TFProps> = ({
  exibirBtnNovo = true,
  exibirBtnFiltrar = true,
  exibirBtnDownload = true, // Defina como verdadeiro para mostrar o botão de download
  textoBtnNovo = 'Novo',
  onNewClick,
  onFilterClick,
  onDownloadClick, // Passe a função de clique do download
  searchProps = {
    exibir: true,
    onChange: (value: string) => {},
    onClear: () => {},
    value: '',
  },
}) => {
  return (
    <>
      <div className="d-flex flex-row align-items-center justify-content-between p-2 rounded shadow bg-light">
        <div className="d-flex flex-row align-items-center">
          {exibirBtnFiltrar && (
            <ResponsiveIconButton
              icone="bi bi-funnel"
              texto="Filtrar"
              styleClass="me-1 me-lg-2"
              onClick={onFilterClick}
            />
          )}
          {searchProps.exibir === true && <SearchField size="sm" {...searchProps} />}
        </div>

        <div> 
          <div className="flex-row"> 
            {exibirBtnDownload && (
              <ResponsiveIconButton
                icone="bi bi-download" // Ícone de download página Contatos
                styleClass="ms-2"
                texto="Download PDF" // Texto do botão
                onClick={onDownloadClick} // Chamar a função de clique do download
              />
            )}

            {exibirBtnNovo && (
              <ResponsiveIconButton
                buttonClass="btn-primary-light"
                icone="bi bi-plus-square"
                styleClass="ms-2"
                texto={textoBtnNovo}
                onClick={onNewClick}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolbarListagem;