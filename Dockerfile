#stage 1
FROM node:14-alpine as node
WORKDIR /app
COPY / ./
RUN npm install
RUN npm run build --prod
#stage 2
FROM nginx:alpine as dist
ENV BACKEND_URL=http://10.42.1.131:8080
ENV NOTIFICATION_URL=http://10.42.1.131:8087
ENV PAIEMENT_URL=http://10.42.1.131:8023
COPY --from=node /app/run.sh /
COPY --from=node /app/dist/signart/browser /usr/share/nginx/html
COPY --from=node /app/nginx.conf /etc/nginx/conf.d/nginx.conf.template
CMD ["/bin/sh", "/run.sh"]
#ENTRYPOINT ["/bin/sh", "/run.sh"]