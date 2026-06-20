package com.habeebcycle.lms.service.userservice.service;

import com.habeebcycle.lms.service.userservice.model.*;
import com.habeebcycle.lms.service.userservice.repository.BookRepository;
import com.habeebcycle.lms.service.userservice.repository.BorrowRecordRepository;
import com.habeebcycle.lms.service.userservice.repository.UserRepository;
import com.habeebcycle.lms.service.userservice.util.exception.BadRequestException;
import com.habeebcycle.lms.service.userservice.util.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Autowired
    public BorrowService(BorrowRecordRepository borrowRecordRepository,
                         BookRepository bookRepository,
                         UserRepository userRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BorrowRecord borrowBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User", "id", userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Book", "id", bookId));

        // Check if user already has this book borrowed
        List<BorrowRecord> activeBorrows = borrowRecordRepository
                .findByUserIdAndBookIdAndStatus(userId, bookId, BorrowStatus.BORROWED);
        if (!activeBorrows.isEmpty()) {
            throw new BadRequestException("You already have this book borrowed.");
        }

        // Check availability
        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No copies of this book are currently available.");
        }

        // Check borrow limit (max 5 active borrows)
        long activeCount = borrowRecordRepository.countByUserIdAndStatus(userId, BorrowStatus.BORROWED);
        if (activeCount >= 5) {
            throw new BadRequestException("You have reached the maximum borrow limit of 5 books.");
        }

        // Decrement available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Create borrow record (14-day loan period)
        BorrowRecord record = new BorrowRecord(
                user, book,
                LocalDate.now(),
                LocalDate.now().plusDays(14),
                BorrowStatus.BORROWED
        );

        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord returnBook(Long borrowId, Long userId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() -> new NotFoundException("BorrowRecord", "id", borrowId));

        // Verify ownership
        if (!record.getUser().getId().equals(userId)) {
            throw new BadRequestException("This borrow record does not belong to you.");
        }

        if (record.getStatus() == BorrowStatus.RETURNED) {
            throw new BadRequestException("This book has already been returned.");
        }

        // Increment available copies
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // Update borrow record
        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowStatus.RETURNED);

        return borrowRecordRepository.save(record);
    }

    public List<BorrowRecord> getUserBorrows(Long userId) {
        return borrowRecordRepository.findByUserId(userId);
    }

    public List<BorrowRecord> getUserActiveBorrows(Long userId) {
        return borrowRecordRepository.findByUserIdAndStatus(userId, BorrowStatus.BORROWED);
    }

    public List<BorrowRecord> getAllBorrows() {
        return borrowRecordRepository.findAll();
    }

    public List<BorrowRecord> getAllActiveBorrows() {
        return borrowRecordRepository.findByStatus(BorrowStatus.BORROWED);
    }
}
