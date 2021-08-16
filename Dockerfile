FROM mhart/alpine-node:12
WORKDIR /app/emitter
ADD /emitter/package.json .
RUN npm install
ADD ./emitter .
ADD /frontend/stats/build ./public
WORKDIR /app/listener
ADD /listener/package.json .
RUN npm install
ADD /listener .
WORKDIR /app
ADD ./cmd.sh .
EXPOSE 3000
CMD sh ./cmd.sh

