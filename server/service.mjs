// @ts-check

/**
 * @typedef Location
 * @type {'Budapest'|'Szeged'|'Debrecen'}
 */

/**
 * @typedef Contact
 * @type {object}
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {Location} location
 * @property {string} introduction
 */

/**
 * @typedef ContactDO
 * @type {object}
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {string} introduction
 * @property {Location} location
 */

import fs from 'fs';
import faker from 'faker';

const DB_FILE = './server/db.json';

/**
 * @returns {Array.<Contact>}
 */
const createContacts = () => {
  const contacts = [];

  for (let i = 0; i < 123; i++) {
    contacts.push({
      id: i + 1,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      /** @type {Location} */
      location: faker.random.arrayElement(['Budapest', 'Debrecen', 'Szeged']),
      introduction: faker.lorem.paragraph(),
    });
  }

  return contacts;
};

/**
 * @typedef ContactCollection
 * @type {object}
 * @property {number} lastId
 * @property {Array.<Contact>} data
 * @returns {ContactCollection}
 */
export const getAllContacts = () => {
  if (!fs.existsSync(DB_FILE)) {
    const data = createContacts();
    const lastId = data.length;

    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({
        lastId,
        data,
      })
    );
  }

  /** @type {string} */
  // @ts-ignore
  const rawData = fs.readFileSync(DB_FILE);
  const contacts = JSON.parse(rawData);

  return contacts;
};

/**
 * @param {number} id
 */
export const getContact = (id) => {
  const { data } = getAllContacts();

  return data.find((el) => el.id === id);
};

/**
 * @param {number} id
 * @returns {boolean}
 */
export const removeContact = (id) => {
  const { data, lastId } = getAllContacts();
  const elToRemove = data.findIndex((el) => el.id === id);
  const newData = data.filter((el) => el.id !== id);

  if (elToRemove === -1) {
    return false;
  }

  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({
      data: newData,
      lastId,
    })
  );

  return true;
};

/**
 * @param {ContactDO} contact
 * @returns {number}
 */
export const addContact = (contact) => {
  const { data, lastId } = getAllContacts();
  const nextId = lastId + 1;
  const newContact = { id: nextId, ...contact };
  const newData = [...data, newContact];

  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({
      lastId: nextId,
      data: newData,
    })
  );

  return nextId;
};

/**
 * @param {number} id
 * @param {ContactDO} contact
 */
export const editContact = (id, contact) => {
  const { data, lastId } = getAllContacts();
  const elToEdit = data.findIndex((el) => el.id === id);

  if (elToEdit === -1) {
    return false;
  }

  const newData = data.map((el) => {
    if (el.id === id) {
      return {
        id,
        ...contact,
      };
    }

    return el;
  });

  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({
      lastId,
      data: newData,
    })
  );

  return true;
};
