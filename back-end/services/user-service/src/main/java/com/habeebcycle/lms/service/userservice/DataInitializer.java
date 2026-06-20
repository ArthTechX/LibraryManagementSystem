package com.habeebcycle.lms.service.userservice;

import com.habeebcycle.lms.service.userservice.model.Book;
import com.habeebcycle.lms.service.userservice.model.Role;
import com.habeebcycle.lms.service.userservice.model.RoleName;
import com.habeebcycle.lms.service.userservice.model.User;
import com.habeebcycle.lms.service.userservice.repository.BookRepository;
import com.habeebcycle.lms.service.userservice.repository.RoleRepository;
import com.habeebcycle.lms.service.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger LOG = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed roles
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(RoleName.ROLE_USER));
            roleRepository.save(new Role(RoleName.ROLE_ADMIN));
            roleRepository.save(new Role(RoleName.ROLE_SUPER_USER));
            roleRepository.save(new Role(RoleName.ROLE_TECH));
            LOG.info("Roles seeded successfully.");
        }

        // Seed admin user
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("User role not found"));

            User admin = new User("Admin", "User", "admin", "admin@lms.com",
                    passwordEncoder.encode("admin123"));
            admin.setRoles(new HashSet<>(Arrays.asList(adminRole, userRole)));
            userRepository.save(admin);
            LOG.info("Admin user created: admin / admin123");
        }

        // Seed sample books
        if (bookRepository.count() == 0) {
            bookRepository.saveAll(Arrays.asList(
                new Book("To Kill a Mockingbird", "Harper Lee", "978-0061120084", "Fiction",
                    "A novel about the injustices of the deep South and the courage of one man to fight against them.",
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop", 5, 5, 1960),

                new Book("1984", "George Orwell", "978-0451524935", "Dystopian",
                    "A startling and haunting novel that creates an imaginary world that is completely convincing.",
                    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop", 3, 3, 1949),

                new Book("The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565", "Classic",
                    "The story of Jay Gatsby and his pursuit of the American Dream.",
                    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", 4, 4, 1925),

                new Book("Clean Code", "Robert C. Martin", "978-0132350884", "Technology",
                    "A handbook of agile software craftsmanship that teaches you the best practices for writing clean, maintainable code.",
                    "https://images.unsplash.com/photo-1515879218367-8466d910auj8?w=300&h=400&fit=crop", 6, 6, 2008),

                new Book("Design Patterns", "Gang of Four", "978-0201633610", "Technology",
                    "Elements of reusable object-oriented software — the definitive guide to design patterns.",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", 3, 3, 1994),

                new Book("The Pragmatic Programmer", "David Thomas & Andrew Hunt", "978-0135957059", "Technology",
                    "Your journey to mastery. A timeless collection of tips for becoming a better programmer.",
                    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop", 4, 4, 2019),

                new Book("Sapiens", "Yuval Noah Harari", "978-0062316097", "Non-Fiction",
                    "A brief history of humankind — from the Stone Age to the Silicon Age.",
                    "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop", 5, 5, 2011),

                new Book("The Alchemist", "Paulo Coelho", "978-0062315007", "Fiction",
                    "A mystical story about following your dreams and listening to your heart.",
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop", 4, 4, 1988),

                new Book("Atomic Habits", "James Clear", "978-0735211292", "Self-Help",
                    "An easy and proven way to build good habits and break bad ones.",
                    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=400&fit=crop", 7, 7, 2018),

                new Book("Dune", "Frank Herbert", "978-0441172719", "Science Fiction",
                    "A sweeping tale of politics, religion, and ecology set on the desert planet Arrakis.",
                    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop", 3, 3, 1965),

                new Book("Introduction to Algorithms", "Thomas H. Cormen", "978-0262033848", "Technology",
                    "The comprehensive textbook covering a broad range of algorithms and data structures.",
                    "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&h=400&fit=crop", 2, 2, 2009),

                new Book("Pride and Prejudice", "Jane Austen", "978-0141439518", "Classic",
                    "A romantic novel of manners that follows the emotional development of Elizabeth Bennet.",
                    "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop", 5, 5, 1813)
            ));
            LOG.info("12 sample books seeded successfully.");
        }
    }
}
