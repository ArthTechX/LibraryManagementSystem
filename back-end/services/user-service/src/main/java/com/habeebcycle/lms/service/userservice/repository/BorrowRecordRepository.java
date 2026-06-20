package com.habeebcycle.lms.service.userservice.repository;

import com.habeebcycle.lms.service.userservice.model.BorrowRecord;
import com.habeebcycle.lms.service.userservice.model.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByUserId(Long userId);

    List<BorrowRecord> findByUserIdAndStatus(Long userId, BorrowStatus status);

    List<BorrowRecord> findByBookId(Long bookId);

    List<BorrowRecord> findByStatus(BorrowStatus status);

    List<BorrowRecord> findByUserIdAndBookIdAndStatus(Long userId, Long bookId, BorrowStatus status);

    long countByUserIdAndStatus(Long userId, BorrowStatus status);
}
