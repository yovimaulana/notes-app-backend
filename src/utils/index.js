const mapDBToModel = (
    {
        id,
        title,
        body,
        tags,
        created_at,
        updated_at,
        username
    }
) => ({
    id,
    title,
    body,
    tags,
    createdAt: created_at,
    updatedAt: updated_at,
    username
})

const mapUserDBToModel = (
    {
        id, username, password, fullname
    }
) => ({
    id, username, password, fullname: fullname
})

module.exports = { mapDBToModel, mapUserDBToModel }