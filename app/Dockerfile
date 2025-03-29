FROM amazon/aws-lambda-nodejs

COPY . .
RUN npm install
RUN npm run build

CMD ["dist/lambda-bootstrap.handler"]