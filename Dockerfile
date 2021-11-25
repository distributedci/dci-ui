FROM registry.access.redhat.com/ubi8/nodejs-14-minimal

LABEL name="DCI APP"
LABEL version="0.2.0"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ARG REACT_APP_BACKEND_HOST
ARG REACT_APP_SSO_URL
ARG REACT_APP_SSO_REALM
ARG REACT_APP_SSO_CLIENT_ID

ENV LANG en_US.UTF-8
COPY package.json package-lock.json /opt/app-root/src/
RUN npm install --production
COPY . /opt/app-root/src/

EXPOSE 8000

CMD npm start