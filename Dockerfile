FROM registry.access.redhat.com/ubi8/nodejs-14-minimal

LABEL name="DCI APP"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ENV LANG en_US.UTF-8

COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm install --silent
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . ./

EXPOSE 8000
CMD ["npm", "start"]