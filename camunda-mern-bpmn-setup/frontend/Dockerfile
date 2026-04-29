FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

ENV HOST=0.0.0.0
ENV PORT=5196
ENV WDS_SOCKET_PORT=5196
ENV BROWSER=none
ENV PUBLIC_URL=/camunda-bpmn
ENV REACT_APP_API_BASE=/camunda-bpmn/api

EXPOSE 5196

CMD ["npm", "start"]
