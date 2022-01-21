import React from "react";

import GlobalStyle from './styles/global';
import { Container, Content } from './styles';
import Upload from "./components/Upload";
import GlobalContext from "./hooks";

const App: React.FC = () => {
  return (
    <GlobalContext>
      <Container>
        <Content>
          <Upload />
        </Content>
        <GlobalStyle />
      </Container>
    </GlobalContext>
  );
};

export default App;