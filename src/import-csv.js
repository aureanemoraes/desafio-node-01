import { parse } from 'csv';
import fs from 'node:fs';

(async () => {
    const csvFilePath = new URL('../storage/Arquivo - Desafio 01 - Ignite - NodeJS - Página1.csv', import.meta.url);

    const parsedFile = fs.createReadStream(csvFilePath).pipe(parse());

    let currentLine = 1;

    for await (const chunk of parsedFile) {
        if (currentLine !== 1) {
            const [ title, description ] = chunk;
    
            fetch('http://localhost:3333/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description
                })
            }).then(response => response.json()) 
            .then(json => console.log(json));
        }

        currentLine++;
    }
})();


