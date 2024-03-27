FROM python:3.9 AS server

WORKDIR /app/server

COPY server/ ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
