#  Dockerfile for Node Express Backend api (development)

FROM node:18.19-alpine3.17

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install install

# Copy app source code
COPY . .

RUN npm run build

# Exports
EXPOSE 3000

CMD [ "npm", "run", "start" ]
