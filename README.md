Install the dependencies:

```
npm install
```

Fire up the database:

```
sudo docker-compose up
```

Delete the `Payments` table if already created:

```
ts-node src/utils/deleteTable.ts
```

Initialise the `Payments` table:

```
ts-node src/utils/createTable.ts
```

Run the server:

```
ts-node src/sever.ts
```

Perform your requests!