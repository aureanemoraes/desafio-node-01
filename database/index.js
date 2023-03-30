import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';

const dbPath = new URL('db.json', import.meta.url);

class Database {
    #database = {};

    constructor() {
        fs.readFile(dbPath, 'utf8')
            .then(data => { this.#database = JSON.parse(data) })
            .catch(() => this.#persist());
    }

    #persist() {
        fs.writeFile(
            dbPath,
            JSON.stringify(this.#database)    
        );
    }

    select(table) {
        return this.#database[table] || [];
    }

    insert(table, data) {
        const newData = {
            id: randomUUID(),
            created_at: new Date(),
            updated_at: new Date(),
            ...data
        }

        console.log(Array.isArray(this.#database[table]));

        if (!Array.isArray(this.#database[table]))
            this.#database[table] = [newData];
        else
            this.#database[table].push(newData);

        this.#persist();

        return newData;
    }

    update(table, id, data) {
        const index = this.#database[table].findIndex(item => item.id === id);

        if (index === -1) 
            return false;

        const updatedData = {
            ...this.#database[table][index],
            updated_at: new Date(),
            ...data
        };

        this.#database[table][index] = updatedData;

        this.#persist();

        return this.#database[table][index];
    }

    delete(table, id) {
        const index = this.#database[table].findIndex(item => item.id === id);

        if (index === -1) 
            return false;

        this.#database[table].splice(index, 1);

        this.#persist();

        return true;
    }
}

export default Database;