const { nanoid } = require('nanoid')
const {Pool} = require('pg')
const InvariantError = require('../../exceptions/InvariantError')

class CollaborationsService {
    constructor() {
        this._pool = new Pool()
    }

    async addCollaboration(noteId, userId) {
        const id = `collab-${nanoid(16)}`
        const query = {
            text: 'insert into collaborations values($1, $2, $3) returning id',
            values: [id, noteId, userId]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length) throw new InvariantError('Kolaborasi gagal ditambahkan')

        return result.rows[0].id
    }

    async deleteCollaboration(noteId, userId) {
        const query = {
            text: 'delete from collaborations where user_id = $1 and note_id = $2 returning id',
            values: [userId, noteId]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length) throw new InvariantError('Kolaborasi gagal dihapus')
    }

    async verifyCollaborator(noteId, userId) {
        const query = {
            text: 'select * from collaborations where note_id = $1 and user_id = $2',
            values: [noteId, userId]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length) throw new InvariantError('Kolaborasi gagal diverifikasi')        
    }
}

module.exports = CollaborationsService