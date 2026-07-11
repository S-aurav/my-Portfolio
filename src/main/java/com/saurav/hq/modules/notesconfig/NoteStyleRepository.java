package com.saurav.hq.modules.notesconfig;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteStyleRepository extends JpaRepository<NoteStyle, String> {
}
