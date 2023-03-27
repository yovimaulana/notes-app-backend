const mapDBToModel = (
    {id,
    title,
    body,
    tags,
    created_at,
    updated_at}
) => ({
    id,
    title,
    body,
    tags,
    createdAt: created_at,
    updatedAt: updated_at
})

const mapUserDBToModel = (
    {
        id, username, password, fullName
    }
) => ({
    id, username, password, fullname: fullName
})

module.exports = { mapDBToModel, mapUserDBToModel }