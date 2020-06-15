/* Copyright (c) 2020 Jérôme Velociter <jerome@velociter.fr>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const {promisify} = require('util');
const {
    buildClientSchema,
    printSchema,
} = require('graphql');
const { getIntrospectionQuery } = require('graphql/utilities');

require('dotenv').config()

const writeFile = promisify(fs.writeFile);
const execute = promisify(exec);

const { PRISMIC_ENDPOINT } = process.env;

process.on('unhandledRejection', error => {
    console.error('Failed to get Graphql schema 🤦‍♂️️\n', error.message);
});

async function getPrismicMasterRef(id = 'master') {
    return fetch(`${PRISMIC_ENDPOINT}/api/v2`)
        .then(result => result.json())
        .then(json => json.refs)
        .then(refs => refs.find(ref => ref.id === id));
}

async function getRemoteSchema(endpoint, options) {
    let url = endpoint + `?query=${encodeURIComponent(getIntrospectionQuery())}`;
    return fetch(url, {
        method: 'GET',
        headers: options.headers,
    })
        .then(res => res.json())
        .then(json => buildClientSchema(json.data))
        .then(schema => printSchema(schema));
}

async function writeToFile(destination, schema) {
    const output = path.resolve(process.cwd(), destination);
    return writeFile(output, schema).then(() =>
        execute('./node_modules/.bin/prettier --write schema/schema.graphql ')
    );
}

(async () => {
    const master = await getPrismicMasterRef();
    const schema = await getRemoteSchema(`${PRISMIC_ENDPOINT}/graphql`, {
        headers: {
            'Prismic-Ref': master.ref,
        },
    });

    await writeToFile('./schema/schema.graphql', schema);
    console.log('Graphql schema updated 🤘');
})();
