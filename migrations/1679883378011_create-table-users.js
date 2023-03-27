/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: {
            type: 'varchar(200)',
            primaryKey: true
        },
        username: {
            type: 'varchar(255)',
            notNull: true,
            unique: true
        },
        password: {
            type: 'varchar(255)',
            notNull: true
        },
        fullName: {
            type: 'TEXT',
            notNull: true
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('users')
};
