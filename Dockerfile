FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install pm2 -g

RUN useradd -m appuser && chown -R appuser /usr/src/app
USER appuser

EXPOSE 3001

CMD ["pm2-runtime", "ecosystem.config.js"]
