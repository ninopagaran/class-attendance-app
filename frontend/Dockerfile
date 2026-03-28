FROM node:20-alpine

WORKDIR /app

ENV NEXT_PUBLIC_BACKEND_URL=http://backend:5000

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
