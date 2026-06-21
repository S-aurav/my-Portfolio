package com.saurav.hq.modules.note;

import com.saurav.hq.common.Visibility;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NoteService {

    private final NoteRepository repository;

    public NoteService(NoteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Note> getPublicNotes() {
        return repository.findByVisibilityOrderByCreatedAtDesc(Visibility.PUBLIC);
    }

    @Transactional(readOnly = true)
    public List<Note> getAllNotes() {
        return repository.findAll();
    }

    public Note createNote(NoteRequest req) {
        Note note = new Note();
        updateEntityFromRequest(note, req);
        return repository.save(note);
    }

    public Note updateNote(String id, NoteRequest req) {
        Note note = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + id));
        updateEntityFromRequest(note, req);
        return repository.save(note);
    }

    public void deleteNote(String id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Note not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void updateEntityFromRequest(Note entity, NoteRequest req) {
        if (req.title() == null || req.title().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (req.content() == null || req.content().isBlank()) {
            throw new IllegalArgumentException("Content is required");
        }
        if (req.category() == null || req.category().isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }

        entity.setTitle(req.title().trim());
        entity.setContent(req.content().trim());
        entity.setCategory(req.category().trim());
        entity.setVisibility(req.visibility() != null ? req.visibility() : Visibility.PUBLIC);
    }
}
