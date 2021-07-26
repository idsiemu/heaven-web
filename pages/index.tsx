import React from "react";
import { DocumentNode, gql } from "@apollo/client";
import gqlQueryInstance from "src/apollo/gqlQueryInstance";
import { Wrapper, Header, Main, Footer, Cards } from "@components";
import GlobalStyle from "@styles/globalStyles";
import { useCookie } from "next-cookie";
import { REFRESH_TOKEN, TOKEN } from "src/assets/utils/ENV";
import AbstractComponent from "@components/abstract";

export const getServerSideProps = async (ctx: any) => {
  const cookie = await useCookie(ctx as any);
  const heavenToken = await cookie.get(TOKEN);
  const refreshToken = await cookie.get(REFRESH_TOKEN);
  return {
    props: {
      query: ctx?.query,
      params: {},
    },
  };
};

export const ALL_PLAYERS_QUERY: DocumentNode = gql`
  query dummy {
    dummy {
      status
      text
    }
  }
`;

const Home: React.FC = () => {
  // const cookie = useCookie();
  // const response = gqlQueryInstance(ALL_PLAYERS_QUERY, cookie);
  return (
    <AbstractComponent>
      <Wrapper>
        <GlobalStyle />
        <Header />
        <Main />
        <Cards />
        <Footer />
      </Wrapper>
    </AbstractComponent>
  );
};
export default Home;
