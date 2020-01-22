import { DataStore } from 'notarealdb';

const store = new DataStore('./data');

export const messages = store.collection('messages');
export const users = store.collection('users');
