FROM node:22-alpine

# Set the working directory
WORKDIR /frontend

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]