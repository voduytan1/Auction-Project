package com.example.backend.repository;

import com.example.backend.entity.OTP;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OTPRepository extends CrudRepository<OTP, String> {
    // CrudRepository đã có sẵn save, findById, deleteById
}
