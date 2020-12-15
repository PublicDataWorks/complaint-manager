unset NODE_AUTH_DISABLED
unset REACT_APP_AUTH_DISABLED
export NODE_TLS_REJECT_UNAUTHORIZED=1

if [ -n "${CLOUD_SERVICES_DISABLED}" ]; then
    echo "Cloud services are disabled. Setting development flags. Be careful."
    export NODE_TLS_REJECT_UNAUTHORIZED=0
    export NODE_AUTH_DISABLED=true
    export REACT_APP_AUTH_DISABLED=true 
fi
