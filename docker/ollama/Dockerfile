FROM ollama/ollama

RUN apt-get update && apt-get install -y curl

COPY bootstrap.sh /root/bootstrap.sh

RUN chmod +x /root/bootstrap.sh

ENTRYPOINT ["/bin/bash", "/root/bootstrap.sh"]
