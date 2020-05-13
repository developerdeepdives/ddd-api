// use developerdeepdives
db.createUser({
  user: 'apiUser',
  pwd: 'superStrongPassw0rd!',
  roles: [
    {
      role: 'readWrite',
      db: 'developerdeepdives',
    },
  ],
});
