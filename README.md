# SingleStore Drizzle ORM driver demo
A simple example of the SingleStore Drizzle ORM usage with Next.js

### Prerequisites
- Node.js version >=22.5.x
- A SingleStore cluster running. [Sign up](https://www.singlestore.com/cloud-trial/) for a free SingleStore license.

## Tech Stack
- Next.js (latest)
- Drizzle ORM
- TailwindCSS
- TypeScript

## Getting started

Install project dependencies
```shell
npm install
# or
yarn
# or
pnpm install
```

Create a `.env` file with your Database credentials
```python
# You can get this information from https://portal.singlestore.com/
DB_URL=singlestore://<database-user>:<database-password>@<database-host>:<database-port>/<database-name>?ssl={}
```

Apply the database migrations
```shell
npm run migrate
# or
yarn migrate
# or
pnpm migrate
```

Run the development server
```shell
npm run dev
# or
yarn dev
# or
pnpm dev
```

Build for production
```shell
npm run build
# or
yarn build
# or
pnpm build
```

Start the production server
```shell
npm start
# or
yarn start
# or
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
