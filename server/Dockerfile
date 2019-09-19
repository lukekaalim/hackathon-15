FROM node:12

WORKDIR /opt/hackathon-server

COPY . ./

RUN npm ci install --production

EXPOSE 1243

ENTRYPOINT [ "node", "src" ]