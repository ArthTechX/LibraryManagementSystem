package com.habeebcycle.lms.service.userservice.model;

import com.habeebcycle.lms.service.userservice.model.audit.DateAudit;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "books")
public class Book extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 150)
    private String author;

    @Size(max = 20)
    @Column(unique = true)
    private String isbn;

    @Size(max = 50)
    private String genre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Size(max = 500)
    private String coverImage;

    @NotNull
    private Integer totalCopies;

    @NotNull
    private Integer availableCopies;

    private Integer publishYear;

    public Book() {}

    public Book(String title, String author, String isbn, String genre, String description,
                String coverImage, Integer totalCopies, Integer availableCopies, Integer publishYear) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.description = description;
        this.coverImage = coverImage;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.publishYear = publishYear;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public Integer getTotalCopies() { return totalCopies; }
    public void setTotalCopies(Integer totalCopies) { this.totalCopies = totalCopies; }

    public Integer getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(Integer availableCopies) { this.availableCopies = availableCopies; }

    public Integer getPublishYear() { return publishYear; }
    public void setPublishYear(Integer publishYear) { this.publishYear = publishYear; }
}
