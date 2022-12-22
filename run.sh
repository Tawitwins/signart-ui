#!/bin/sh

# Substitute env vars
envsubst '${BACKEND_URL} ${PAIEMENT_URL} ${NOTIFICATION_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
#sed -i s#PAIEMENT_URL#$PAIEMENT_URL#g /usr/share/nginx/html/*.js
#sed -i s#BACKEND_URLl#$BACKEND_URL#g /usr/share/nginx/html/*.js
#sed -i s#NOTIFICATION_URL#$NOTIFICATION_URL#g /usr/share/nginx/html/*.js 
#echo "$(</etc/nginx/conf.d/default.conf)"
# Start server
nginx -g 'daemon off;'
