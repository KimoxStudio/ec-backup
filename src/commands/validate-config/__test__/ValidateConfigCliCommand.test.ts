import { program } from 'commander';

import { ValidateConfigCliCommand } from '../ValidateConfigCliCommand';

test('must validate mongo backup engine params', async () => {
  const command = new ValidateConfigCliCommand(program);

  await command.validateEngine({
    type: 'mongo',
    databaseHost: 'localhost',
    databaseName: 'test'
  });
});

test('must validate file backup engine params', async () => {
  const command = new ValidateConfigCliCommand(program);

  await command.validateEngine({
    type: 'file',
    path: 'foo'
  });
});
