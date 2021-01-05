FROM node:12-slim as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
RUN npm install -g @angular/cli

COPY . .

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN ng build

#use nginx as production server
FROM nginx
#Expose is nothing more than a note locally but in deployment it lets
#elastic beanstock know which port to expose ie: -p 80:80
EXPOSE 4200
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
#copy the built app
COPY --from=builder /app/dist/python-angular-app /usr/share/nginx/html