import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Hello {
    id: ID!
    path: String!
    category: String!
    createdAt: String!
  }

  type Query {
    hello: [Hello!]!
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return [
        {
          id: "1",
          path: "/",
          category: "page_view",
          createdAt: new Date().toISOString(),
        },
      ];
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`🚀 Apollo Server running at ${url}`);