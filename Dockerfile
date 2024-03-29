FROM python:3.9-slim AS server

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    unzip \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN pip install kaggle gunicorn

ENV KAGGLE_USERNAME=""
ENV KAGGLE_KEY=""
ENV MODEL_NAME="Arihant.v1"

RUN mkdir -p /root/.kaggle \
    && echo "{'username': '$KAGGLE_USERNAME', 'key': '$KAGGLE_KEY'}" > /root/.kaggle/kaggle.json \
    && echo "Kaggle file written"

RUN ln -s /usr/local/bin/kaggle /usr/bin/kaggle \
    && ln -s /usr/local/bin/gunicorn /usr/bin/gunicorn

RUN which kaggle
RUN which gunicorn

WORKDIR /app/server
COPY server/ ./

RUN mkdir -p /app/server/learning_handler/datasets \
    && cd /app/server/learning_handler/datasets \
    && kaggle datasets download vipoooool/new-plant-diseases-dataset \
    && unzip new-plant-diseases-dataset.zip \
    && rm new-plant-diseases-dataset.zip

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["gunicorn", "app:app"]
