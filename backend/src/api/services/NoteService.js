const Note = require('../models/Note');

class NoteService {
    async updateNote(noteId, content){
        try {
            const updatedNote = await Note.findByIdAndUpdate(
                noteId,
                { $set: {content} }, // Dùng $set để đảm bảo các trường hợp update được chỉ định
                { new: true, runValidators: true }
            );            return updatedNote;
        } catch (error) {
            throw new Error('Error updating note: ' + error.message);
        }
    }
    async deleteNote (noteId) {
        try {
            await Note.findByIdAndDelete(noteId);
        } catch (error) {
            throw new Error('Error deleting note: ' + error.message);
        }
    }
  
}

module.exports = new NoteService();