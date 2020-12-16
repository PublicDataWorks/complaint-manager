export NODE_TLS_REJECT_UNAUTHORIZED=1

if [ -n "${CLOUD_SERVICES_DISABLED}" ]; then
    echo "Cloud services are disabled. Setting development flags. Be careful."
    export NODE_TLS_REJECT_UNAUTHORIZED=0
fi
