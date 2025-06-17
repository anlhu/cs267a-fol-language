FROM ubuntu:22.04

# set up environment for frontend and backend development

RUN apt-get clean && apt-get update && apt-get install -y \
  sudo \
  wget \
  curl \
  git \
  nodejs \
  pip \
  make \
  openjdk-17-jdk

# install npm and libraries
RUN curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
RUN sudo -E bash nodesource_setup.sh
RUN sudo apt-get install -y nodejs

# install python libraries
RUN pip install black antlr4-tools antlr4-python3-runtime ortools

# Useful shortcuts
RUN echo 'alias kill3000="fuser -k -n tcp 3000"' >> /etc/bash.bashrc
RUN echo 'alias kill8080="fuser -k -n tcp 8080"' >> /etc/bash.bashrc
RUN echo 'alias killPython="pkill -9 python3"' >> /etc/bash.bashrc

# java env vars 
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# antlr set up
RUN curl -o /usr/local/lib/antlr-4.13.2-complete.jar -O https://www.antlr.org/download/antlr-4.13.2-complete.jar
ENV CLASSPATH=".:/usr/local/lib/antlr-4.13.2-complete.jar:$CLASSPATH"
RUN echo "alias antlr4='java -Xmx500M -cp /usr/local/lib/antlr-4.13.2-complete.jar:\$CLASSPATH org.antlr.v4.Tool'" >> /etc/bash.bashrc
RUN echo "alias grun='java -Xmx500M -cp /usr/local/lib/antlr-4.13.2-complete.jar:\$CLASSPATH org.antlr.v4.gui.TestRig'" >> /etc/bash.bashrc
