import React from "react";

import GlobalStyle from './styles/global';
import { Container, Content } from './styles';
import Upload from "./components/Upload";

const App: React.FC = () => {
  return (
    <Container>
      <Content>
        <Upload />
      </Content>

      <GlobalStyle />
    </Container>
  );
};

export default App;