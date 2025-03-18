FROM redis:7.4-alpine

WORKDIR /redis

COPY ./redis.conf /usr/local/etc/redis/redis.conf

COPY ./init.sh ./

RUN chmod +x init.sh