FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm install

# Copy server code
COPY . .

# If you use TypeScript, build the server:
# RUN npm run build

# Expose GraphQL / Apollo port (typically 4000)
EXPOSE 4000

CMD ["npm", "start"]