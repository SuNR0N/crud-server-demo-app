FROM node:10.5.0-alpine

ARG DESTINATION_DIR=/home/app

COPY nodemon.json \
    package.json \
    tsconfig.json \
    yarn.lock \
    ${DESTINATION_DIR}/
WORKDIR ${DESTINATION_DIR}/
RUN yarn

COPY src ${DESTINATION_DIR}/src/
COPY swagger ${DESTINATION_DIR}/swagger/

CMD yarn start