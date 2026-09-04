import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Visit {
    id: ID!
    path: String!
    category: String!
    createdAt: String!
  }

  type Query {
    visits: [Visit!]!
  }
`;

const resolvers = {
  Query: {
    visits: () => {
      return [
        {
          id: "1",
          path: "/",
          category: "page_view",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          path: "/dashboard",
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