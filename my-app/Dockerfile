FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Next.js code
COPY . .

# Set build argument for Apollo client endpoint
ARG NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
ENV NEXT_PUBLIC_GRAPHQL_URL=$NEXT_PUBLIC_GRAPHQL_URL

# Build the Next.js production bundle
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]