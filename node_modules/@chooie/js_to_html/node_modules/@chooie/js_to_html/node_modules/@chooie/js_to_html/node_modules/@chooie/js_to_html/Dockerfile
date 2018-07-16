FROM node:9.4

# Install Google Chrome
RUN wget -q -O - \
    https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c \
       "echo \
       'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' \
       >> /etc/apt/sources.list.d/google.list" \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean \
    && mkdir -p /usr/src/app

WORKDIR /usr/src/app
RUN chmod -R g+rw /usr/src/app

ENTRYPOINT ["/bin/bash", "-c", "./tasks.sh \"$@\"", "--"]
