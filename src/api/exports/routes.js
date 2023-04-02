const routes = (handler) => [
    {
        method: 'POST',
        path: '/exports/notes',
        handler: handler.postExportsNotesHandler,
        options: {
            auth: 'notesapp_jwt'
        }
    }
]

module.exports = routes