# SingleStore Drizzle ORM driver demo
A simple example of the S2 Drizzle ORM usage 

### Prerequisits
- Nodejs version >=22.5.x
- A SingleStore cluster running. [Sign up](https://www.singlestore.com/cloud-trial/) for a free SingleStore license. 

## Getting started
Install pnpm globally
```shell
npm install -g pnpm
```

Install project dependencies
```shell
pnpm install
```

Create a `.env` with your Database credentials
```python
# You can get this information from https://portal.singlestore.com/
DB_USERNAME=<database-user>
DB_HOST=<database-host>
DB_PORT=<database-port>
DB_PASSWORD=<database-password>
DB_DATABASE=<database-name>
```

Apply the database migrations
```shell
pnpm migrate
```

Run the app
```shell
pnpm start
```
