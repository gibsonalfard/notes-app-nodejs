const {nanoid} = require('nanoid')
const notes = require('./notes')

const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload

    const id = nanoid(16)
    const createAt = new Date().toISOString()
    const updateAt = createAt

    const newNote = {
        id, title, tags, body, createAt, updateAt
    }

    notes.push(newNote)

    const isSuccess = notes.filter((note) => note.id === id).length > 0

    if (isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id
            }
        })

        response.code(201)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan'
    })

    response.code(500)

    return response
}

const getAllNotesHandler = () => ({
    status: 'sucess',
    data: {
        notes
    }
})

const getNoteByIdHandler = (request, h) =>{
    const { id } = request.params
    const note = notes.filter((n) => n.id === id)[0]

    if(note !== undefined){
        return {
            status: 'success',
            data: {
                note
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Note tidak ditemukan',
    })

    response.code(404)

    return response
}

const editNoteByIdHandler = (request, h) => {
    const {id} = request.params

    const {title, tags, body} = request.payload
    const updateAt = new Date().toISOString()

    try{
        const note = notes.filter((n) => n.id === id)[0]
        note.title = title
        note.tag = tags
        note.body = body
        note.updateAt = updateAt

        console.log(note)

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui'
        })

        response.code(200)
        return response
    }catch(e){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui catatan. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
}

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params
    let response = undefined
    const index = notes.findIndex((note) => note.id === id)

    try{
        notes.splice(index, 1)
        response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        })
        response.code(200)
    }catch (e){
        response = h.response({
            status: 'fail',
            message: 'Catatan gagal dihapus. Id tidak ditemukan'
        })
        response.code(404)
    }

    return response
}

module.exports = {addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler}