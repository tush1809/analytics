#!/bin/sh

# Replace placeholders in the static files
# Find all .js and .html files in the Nginx directory and replace placeholders
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|__VITE_AUTH_API_URL__|$VITE_AUTH_API_URL|g"
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|__VITE_ANALYTICS_API_URL__|$VITE_ANALYTICS_API_URL|g"
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|__VITE_UPLOAD_API_URL__|$VITE_UPLOAD_API_URL|g"

# Execute the main Nginx command
exec "$@"
