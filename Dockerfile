FROM node:18 AS base

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

FROM python:3.10 AS train
WORKDIR /app
COPY ml/ ./ml/
COPY data/ ./data/
RUN pip install -r requirements.txt

FROM base AS runtime
EXPOSE 3000
CMD ["npm", "run", "dev"]
