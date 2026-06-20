package com.habeebcycle.lms.service.userservice.controller;

import com.habeebcycle.lms.service.userservice.model.BorrowRecord;
import com.habeebcycle.lms.service.userservice.payload.BorrowResponse;
import com.habeebcycle.lms.service.userservice.security.CurrentUser;
import com.habeebcycle.lms.service.userservice.security.UserPrincipal;
import com.habeebcycle.lms.service.userservice.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final BorrowService borrowService;

    @Autowired
    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    // Borrow a book
    @PostMapping("/{bookId}")
    public ResponseEntity<BorrowResponse> borrowBook(@CurrentUser UserPrincipal currentUser,
                                                      @PathVariable Long bookId) {
        BorrowRecord record = borrowService.borrowBook(currentUser.getId(), bookId);
        return ResponseEntity.status(HttpStatus.CREATED).body(toBorrowResponse(record));
    }

    // Return a book
    @PutMapping("/return/{borrowId}")
    public ResponseEntity<BorrowResponse> returnBook(@CurrentUser UserPrincipal currentUser,
                                                      @PathVariable Long borrowId) {
        BorrowRecord record = borrowService.returnBook(borrowId, currentUser.getId());
        return ResponseEntity.ok(toBorrowResponse(record));
    }

    // Get current user's borrows
    @GetMapping("/my")
    public ResponseEntity<List<BorrowResponse>> getMyBorrows(@CurrentUser UserPrincipal currentUser) {
        List<BorrowRecord> records = borrowService.getUserBorrows(currentUser.getId());
        return ResponseEntity.ok(records.stream().map(this::toBorrowResponse).collect(Collectors.toList()));
    }

    // Get current user's active borrows
    @GetMapping("/my/active")
    public ResponseEntity<List<BorrowResponse>> getMyActiveBorrows(@CurrentUser UserPrincipal currentUser) {
        List<BorrowRecord> records = borrowService.getUserActiveBorrows(currentUser.getId());
        return ResponseEntity.ok(records.stream().map(this::toBorrowResponse).collect(Collectors.toList()));
    }

    // Get all borrows (admin only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BorrowResponse>> getAllBorrows() {
        List<BorrowRecord> records = borrowService.getAllBorrows();
        return ResponseEntity.ok(records.stream().map(this::toBorrowResponse).collect(Collectors.toList()));
    }

    // Get all active borrows (admin only)
    @GetMapping("/all/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BorrowResponse>> getAllActiveBorrows() {
        List<BorrowRecord> records = borrowService.getAllActiveBorrows();
        return ResponseEntity.ok(records.stream().map(this::toBorrowResponse).collect(Collectors.toList()));
    }

    private BorrowResponse toBorrowResponse(BorrowRecord record) {
        BorrowResponse response = new BorrowResponse();
        response.setId(record.getId());
        response.setBookId(record.getBook().getId());
        response.setBookTitle(record.getBook().getTitle());
        response.setBookAuthor(record.getBook().getAuthor());
        response.setBookCoverImage(record.getBook().getCoverImage());
        response.setUserId(record.getUser().getId());
        response.setUsername(record.getUser().getUsername());
        response.setUserFullName(record.getUser().getFirstName() + " " + record.getUser().getLastName());
        response.setBorrowDate(record.getBorrowDate());
        response.setDueDate(record.getDueDate());
        response.setReturnDate(record.getReturnDate());
        response.setStatus(record.getStatus().name());
        return response;
    }
}
