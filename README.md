# MySarpas-Backend

## Install Dependencies
```npm install```

## Setup Database
### .env
``` bash
DATABASE_URL="postgresql://username:password@localhost:5432/nama_db"
JWT_SECRET="your_jwt_secret"
```
### console
``` bash
npx prisma db pull
npx prisma generate
```
## Database GUI
``` bash
npx prisma studio
```
## Run Server
``` bash
npm start
```
