const { nanoid } = require('nanoid')
const {Pool} = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const { mapDBToModel } = require('../../utils')

class NotesService {
    constructor(collaborationsService, cacheService) {
        this._pool = new Pool()
        this._collaborationsService = collaborationsService
        this._cacheService = cacheService
    }

    async addNote({title, body, tags, credentialId}){        
        const id = nanoid(16)
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const query = {
            text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, body, tags, createdAt, updatedAt, credentialId]
        }

        const result = await this._pool.query(query)

        if(!result.rows[0].id) {
            throw new InvariantError('Catatan gagal ditambahkan')
        }


        const {owner} = result.rows[0]
        await this._cacheService.delete(`notes:${owner}`); // remove cache 
        return result.rows[0].id
    }

    async getNotes(owner) {
        try {
            const result = await this._cacheService.get(`notes:${owner}`)
            return JSON.parse(result)
        } catch (error) {
            const query = {
                text: `SELECT notes.* FROM notes 
                left join collaborations on collaborations.note_id = notes.id
                where notes.owner = $1 or collaborations.user_id = $1
                group by notes.id`,
                values: [owner]
            }
            const result = await this._pool.query(query)
            return result.rows.map(mapDBToModel)
        }
    }

    async getNoteById(id) {
        const query = {
            text: `SELECT notes.*, users.username FROM notes 
            left join users on users.id = notes.owner
            where notes.id = $1`,
            values: [id]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length) throw new NotFoundError('Catatan tidak ditemukan')

        return result.rows.map(mapDBToModel)[0]
    }

    async editNoteById(id, {title, body, tags}) {
        const updatedAt = new Date().toISOString()
        const query = {
            text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 where id = $5 RETURNING id',
            values: [title, body, tags, updatedAt, id]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length) throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')

        const {owner} = result.rows[0]
        await this._cacheService.delete(`notes:${owner}`);
    }

    async deleteNoteById(id) {
        const query = {
            text: 'DELETE FROM notes where id = $1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length) throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')

        const {owner} = result.rows[0]
        await this._cacheService.delete(`notes:${owner}`);
    }

    async verifyNoteOwner(id, owner) {
        const query = {
            text: 'select * from notes where id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)
        if(!result.rows.length) throw new NotFoundError('Catatan tidak ditemukan')

        const note  = result.rows[0]

        if(note.owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }

    async verifyNoteAccess(noteId, userId) {
        try {
            await this.verifyNoteOwner(noteId, userId)
        } catch (error) {
            if(error instanceof NotFoundError) throw error
            try {
                await this._collaborationsService.verifyCollaborator(noteId, userId)
            } catch (error) {
                // throw error
                throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
            }
        }        
    }


}

module.exports = NotesService