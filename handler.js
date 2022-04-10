const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const bookId = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = { 
      bookId, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt ,updatedAt 
  };

    if (name === undefined) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400);
    return response;
}
    if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    })
    response.code(400);
    return response;
}
    books.push(newBook);
    const isSuccess = books.filter((books) => books.bookId === bookId).length > 0;
    if (isSuccess) {
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: bookId,
        },
})   
response.code(201);
return response;  
}

    else {
        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan'
        })
        response.code(500);
        return response;
    }
};
const getAllBookHandler = (request, h) => {
    const {name, reading, finished} = request.query;
    if (!name && !reading && !finished) {
        const response = h.response({
          status: 'success',
          data: {
            books: books.map((book) => ({
              id: book.bookId,
              name: book.name,
              publisher: book.publisher
            })),
          },
        });
        
        response.code(200);
        return response;
    }
    
};
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((book) => book.bookId === bookId)[0];
    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,     
            }
        });
        response.code(200);
        return response;
    }    
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
        response.code(404);
        return response;
    };
const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage,finished, reading } = request.payload;
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.bookId === bookId);
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,year,author,summary,publisher,pageCount,readPage,finished,reading,updatedAt
        };
        const response = h.response({
                status: 'success',
                message: "Buku berhasil diperbarui"
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
    };
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((books) => books.bookId === bookId);
    if (index !== -1) { // utk memastikan nilainya tidak -1 bila hendak menghapus 
        books.splice(index, 1);
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
    const response = h.response({ // Bila index bernilai -1, maka kembalikan handler dengan respons gagal.
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};