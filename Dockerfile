FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN npm install 
COPY ./ ./

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]