/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('notes', {
        owner: {
            type: 'varchar(200)'
        }
    })
};

exports.down = pgm => {
    pgm.dropColumn('notes', 'owner')
};
