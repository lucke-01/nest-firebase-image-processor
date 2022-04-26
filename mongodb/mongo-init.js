print('Start #################################################################');
db.auth('root', 'password');

db = db.getSiblingDB('tasks');

db.createUser({
  user: 'root',
  pwd: 'password',
  roles: [{ role: 'readWrite', db: 'tasks' }],
});
print('End #################################################################');