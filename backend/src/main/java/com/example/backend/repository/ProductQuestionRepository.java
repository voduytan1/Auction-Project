package com.example.backend.repository;

import com.example.backend.entity.ProductQuestion;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductQuestionRepository extends JpaRepository<@NotNull ProductQuestion, @NotNull Long> {
    Page<@NotNull ProductQuestion> findByProduct_Productid(Long productid, Pageable pageable);

}
