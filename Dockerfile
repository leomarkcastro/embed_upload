#  Dockerfile for Node Express Backend api (development)

FROM node:18.19-alpine3.17

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

ARG NEXT_PUBLIC_BASEURL
ENV NEXT_PUBLIC_BASEURL=$NEXT_PUBLIC_BASEURL

RUN npm install

# Copy app source code
COPY . .

RUN npm run build

# Exports
EXPOSE 80

CMD [ "npm", "run", "start", "-p", "80" ]
