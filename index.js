const knex = require('knex')({
  client: 'mysql',
  connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'toor',
      database: 'phonebook'
  }
});

const readLine = require('readline-sync');
const {table} = require('table')

const tableName = 'phoneRegister'

const phoneBook = {
  contacts: 'contacts',
  phoneNumber: 'phoneNumber'
};

const createPhoneBook = async () => {
  await knex.schema.createTableIfNotExists(tableName, table => {
      table.string(phoneBook.contacts);
      table.string(phoneBook.phoneNumber);
  });
};

const drawTable = async () => {
  const data = [
      [
          phoneBook.contacts,
          phoneBook.phoneNumber
      ]
  ];
  knex.select().from(tableName)
  .then((res) => {
    res.forEach(i =>
        data.push([
            i.contacts,
            i.phoneNumber
        ])
    );
    console.log(table(data));
});
};

const addNewContact = async () => {
  let newContact = readLine.question('Name: ');
  let newNumber = readLine.question('Phone number: ');
  await knex.insert([{contacts: newContact, phoneNumber: newNumber}]).into(tableName);
  drawTable();
}

const modifyNumber = async () => {
  const oldNumber = readLine.question('Number to change: ');
  const newNumber = readLine.question('New number: ');
  await knex(tableName)
  .where('phoneRegister.phoneNumber', oldNumber)
  .update({ 'phoneRegister.phoneNumber': newNumber });
};

const modifyContactName = async () => {
  const oldName = readLine.question('Name to change: ');
  const newName = readLine.question('New name: ');
  await knex(tableName)
  .where('phoneRegister.contacts', oldName)
  .update({ 'phoneRegister.contacts': newName });
}

const deleteContact = async () => {
  const deleteName = readLine.question('Name of the contact you would like to delete: ');
  await knex(tableName).where('phoneRegister.contacts', deleteName).del();
}

const searchContact = async () => {
  let search = readLine.question('Search: ');
      const data = [
        [
            phoneBook.contacts,
            phoneBook.phoneNumber
        ]
    ];
    knex.select().from(tableName).where('contacts', search)
    .then((res) => {
      res.forEach(i =>
          data.push([
              i.contacts,
              i.phoneNumber
          ])
      );
      console.log(table(data));
  });
}

const menuPoints = ['Show contacts', 'Search contacts', 'New contact', 'Modify number', 'Modify contact name', 'Delete contact']

const main = () => {
  createPhoneBook();
  console.clear();
  let menu = readLine.keyInSelect(menuPoints, 'What would you like to do?')
  switch (menu) {
    case 0:
      drawTable();
      break;
    case 1:
      searchContact();
    break;
    case 2:
      addNewContact();
    break;
    case 3:
      modifyNumber();
    break;
    case 4:
      modifyContactName();
    break;
    case 5:
      deleteContact();
    break;
    default:
      process.exit(0);
  }
}

const deleteTable = async () => {
await knex.schema.dropTableIfExists(tableName);
}

main();

//drawTable();