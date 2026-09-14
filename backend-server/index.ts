import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";


interface Visit {
  id: string;
  path: string;
  category: string;
  createdAt: string;
}

interface CreateVisitArgs {
  path: string;
  category: string;
}

interface CategoryCount {
  category: string;
  count: number
}

interface VisitsArgs {
  category: string
}

interface VisitStat {
  totalVisits: number;
  visitsByCategory: CategoryCount[]
}

interface CategoryFilterArgs {
  category: string;
}


const typeDefs = `#graphql
  type Visit {
    id: ID!
    path: String!
    category: String!
    createdAt: String!
  }

  type Query {
    visits(category:String): [Visit! ]!
    stats(category:String) : VisitStats!
  }
  
  type CategoryCount {
    category: String!
    count: Int!
  }
  
  type Mutation {
    createVisit(path:String!, category:String!): Visit!
  }

  type VisitStats {
    totalVisits: Int!
    visitsByCategory: [CategoryCount!]!
  }
`;
const visitsDb: Visit[] = [
  {
    id: "1",
    path: "/",
    category: "page_view",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    path: "/",
    category: "docs",
    createdAt: new Date().toISOString(),
  }, {
    id: "3",
    path: "/",
    category: "dashboard",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    path: "/",
    category: "checkout",
    createdAt: new Date().toISOString(),
  },
];

const resolvers = {
  
  Query: {
    visits: (_: any, { category }: VisitsArgs) => {
      if (!category) {
        return visitsDb
      } else {
        return visitsDb.filter((v) => v.category === category);
      }
    },
    stats: (_: any, { category }: CategoryFilterArgs) => {
      const filteredVisits = category
        ? visitsDb.filter((v) => v.category === category)
        : visitsDb;
  
      const countsMap = filteredVisits.reduce<Record<string, number>>((acc, visit) => {
        acc[visit.category] = (acc[visit.category] || 0) + 1;
        return acc;
      }, {});
      const visitsByCategory: CategoryCount[] = Object.entries(countsMap).map(
        ([cat, count]) => ({
          category: cat,
          count,
        })
      )
      return {
        totalVisits: filteredVisits.length,
        visitsByCategory,
      };
    },
  },
  
  Mutation: {
    createVisit: (_: any, { path, category }: CreateVisitArgs) => {
      const newVisit: Visit = {
        id: String(visitsDb.length + 1),
        path,
        category,
        createdAt: new Date().toISOString(),
      };
      visitsDb.push(newVisit);
      return newVisit;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = Number(process.env.PORT) || 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port },
});
console.log(`🚀 Apollo Server running at ${url}`);