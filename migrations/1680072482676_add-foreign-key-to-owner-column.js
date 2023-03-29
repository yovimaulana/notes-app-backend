/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // membuat user baru
    pgm.sql("insert into users (id, username, password, fullname) values ('old_notes' , 'old_notes' , 'old_notes' , 'old_notes')")

    // mengubah nilai owner pada note yang owner-nya bernilai NULL
    pgm.sql("update notes set owner = 'old_notes' where owner is null")

    // memberikan constraint foreign key pada owner terhadap kolom id dari table users
    pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')    
};

exports.down = pgm => {
    // menghapus constraint fk_notes.owner_users.id pada table notes
    pgm.dropConstraint('notes', 'fk_notes.owner_users.id')

    // mengubah nilai owner old_notes pada note menjadi NULL
    pgm.sql("update notes set owner = null where owner = 'old_notes'")

    //menghapus user baru
    pgm.sql("delete from users where id = 'old_notes'")
};
