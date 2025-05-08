FROM ubuntu:22.04

# set up environment for frontend and backend development

RUN apt-get clean && apt-get update && apt-get install -y \
  sudo \
  wget \
  curl \
  git \
  nodejs \
  pip \
  make

# install npm and libraries
RUN curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
RUN sudo -E bash nodesource_setup.sh
RUN sudo apt-get install -y nodejs

# install python libraries
RUN pip install black antlr4-tools antlr4-python3-runtime

# Useful shortcuts
RUN echo 'alias kill3000="fuser -k -n tcp 3000"' >> /etc/bash.bashrc
RUN echo 'alias kill8080="fuser -k -n tcp 8080"' >> /etc/bash.bashrc
RUN echo 'alias killPython="pkill -9 python3"' >> /etc/bash.bashrc
