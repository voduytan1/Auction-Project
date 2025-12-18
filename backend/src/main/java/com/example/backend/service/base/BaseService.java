package com.example.backend.service.base;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Abstract base service providing common CRUD operations using Template Method pattern
 * @param <T> Entity type
 * @param <ID> Entity ID type
 * @param <CreateReq> Create request DTO type
 * @param <UpdateReq> Update request DTO type
 * @param <Response> Response DTO type
 */
public abstract class BaseService<T, ID, CreateReq, UpdateReq, Response> {

    // Abstract methods to be implemented by concrete services
    protected abstract JpaRepository<T, ID> getRepository();

    // Validation and mapping methods
    protected abstract void validateForCreation(CreateReq dto);
    protected abstract T mapToEntity(CreateReq dto);
    protected abstract Response mapToResponse(T entity);
    protected abstract void updateEntityFromDto(UpdateReq dto, T entity);
    // Business logic hooks
    protected abstract void beforeSave(T entity, CreateReq dto);
    protected abstract void beforeUpdate(T entity, UpdateReq dto);
    protected abstract void beforeDelete(ID id);

    // Cache management
    protected abstract void evictCaches();

    /**
     * Template method for creating a single entity
     */
    @Transactional
    public Response createOne(CreateReq dto) {
        // Step 1: Validate
        validateForCreation(dto);

        // Step 2: Map to entity
        T entity = mapToEntity(dto);

        // Step 3: Business logic before save
        beforeSave(entity, dto);

        // Step 4: Save and return response
        T savedEntity = getRepository().save(entity);
        evictCaches();
        return mapToResponse(savedEntity);
    }


    /**
     * Template method for updating an entity
     */
    @Transactional
    public Optional<Response> update(ID id, UpdateReq dto) {
        Optional<Response> result = getRepository().findById(id).map(entity -> {
            updateEntityFromDto(dto, entity);
            beforeUpdate(entity, dto);
            T savedEntity = getRepository().save(entity);
            return mapToResponse(savedEntity);
        });
        if (result.isPresent()) {
            evictCaches();
        }
        return result;
    }

    /**
     * Template method for deleting a single entity
     */
    @Transactional
    public boolean deleteOne(ID id) {
        beforeDelete(id);
        if (getRepository().existsById(id)) {
            getRepository().deleteById(id);
            evictCaches();
            return true;
        }
        return false;
    }

    /**
     * Template method for deleting multiple entities
     */
    @Transactional
    public void deleteMany(List<ID> ids) {
        if (ids == null || ids.isEmpty()) return;

        // Allow subclasses to handle dependencies
        beforeBatchDelete(ids);

        getRepository().deleteAllById(ids);
        evictCaches();
    }

    /**
     * Hook for handling dependencies before batch delete
     */

    protected void beforeBatchDelete(List<ID> ids) {
        // Default implementation does nothing
        // Override in subclasses if needed
    }

    /**
     * Common method for finding by ID
     */
    public Optional<T> findById(ID id) {
        return getRepository().findById(id);
    }

    /**
     * Common method for checking existence
     */
    public boolean existsById(ID id) {
        return getRepository().existsById(id);
    }
}
