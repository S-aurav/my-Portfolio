package com.saurav.hq.modules.note;

import com.saurav.hq.common.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, String> {
    List<Note> findByVisibilityOrderByCreatedAtDesc(Visibility visibility);
}
