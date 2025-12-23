package com.example.backend.service;

import com.example.backend.dto.admin.UpgradeRequest.UpgradeRequestResponse;
import com.example.backend.entity.Role;
import com.example.backend.entity.UpgradeRequest;
import com.example.backend.entity.UpgradeRequestStatus;
import com.example.backend.entity.User;
import com.example.backend.mapper.UpgradeRequestMapper;
import com.example.backend.repository.UpgradeRequestRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UpgradeRequestService {
    private final UpgradeRequestRepository upgradeRequestRepository;
    private final UserRepository userRepository;
    private final UpgradeRequestMapper upgradeRequestMapper;
    private final UserService userService;

    public UpgradeRequestService(UpgradeRequestRepository upgradeRequestRepository, UserRepository userRepository, UpgradeRequestMapper upgradeRequestMapper, UserService userService) {
        this.upgradeRequestRepository = upgradeRequestRepository;
        this.userRepository = userRepository;
        this.upgradeRequestMapper = upgradeRequestMapper;
        this.userService = userService;
    }

    public Page<@NotNull UpgradeRequestResponse> findByUsername(String username, Pageable pageable) {
        Page<@NotNull UpgradeRequest> page = upgradeRequestRepository.findAllByUser_UsernameContainingIgnoreCase(username, pageable);
        List<UpgradeRequestResponse> result = page.getContent().stream()
                .map(upgradeRequestMapper::toResponse)
                .toList();

        return new PageImpl<>(result, pageable, page.getTotalElements());
    }

    public Page<@NotNull UpgradeRequestResponse> findAll(Pageable pageable) {
        Page<@NotNull UpgradeRequest> page = upgradeRequestRepository.findAll(pageable);
        List<UpgradeRequestResponse> result = page.getContent().stream()
                .map(upgradeRequestMapper::toResponse)
                .toList();

        return new PageImpl<>(result, pageable, page.getTotalElements());
    }

    public Page<@NotNull UpgradeRequestResponse> findAllPending(Pageable pageable) {
        Page<@NotNull UpgradeRequest> page = upgradeRequestRepository.findAllByTrangThai(UpgradeRequestStatus.PENDING,pageable);
        List<UpgradeRequestResponse> result = page.getContent().stream()
                .map(upgradeRequestMapper::toResponse)
                .toList();

        return new PageImpl<>(result, pageable, page.getTotalElements());
    }

    public Page<@NotNull UpgradeRequestResponse> findByUsernameAndPending(String username, Pageable pageable) {
        Page<@NotNull UpgradeRequest> page = upgradeRequestRepository.findAllByUser_UsernameContainingIgnoreCaseAndTrangThai(username, UpgradeRequestStatus.PENDING, pageable);
        List<UpgradeRequestResponse> result = page.getContent().stream()
                .map(upgradeRequestMapper::toResponse)
                .toList();

        return new PageImpl<>(result, pageable, page.getTotalElements());
    }

    @Transactional
    public void approveUpgradeRequest(Long id, Boolean approve){
        UpgradeRequest upgradeRequest = upgradeRequestRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Không tìm thầy yêu cầu nâng cấp Seller"));
        if(approve){
            userService.approveSeller(upgradeRequest.getUser().getUserid());
            upgradeRequest.setTrangThai(UpgradeRequestStatus.APPROVED);

        }
        else{
            upgradeRequest.setTrangThai(UpgradeRequestStatus.REJECTED);
        }
        upgradeRequestRepository.save(upgradeRequest);
    }

    @Transactional
    public void CreateRequest(UUID userid) {
        User user = userRepository.findById(userid)
                .orElseThrow(()->new EntityNotFoundException("Không tìm thấy user với id " + userid));

        if(user.getVaitro()== Role.SELLER && user.getThoiHanBanHang() != null &&LocalDateTime.now().isBefore(user.getThoiHanBanHang())){
            throw new AccessDeniedException("Quyền bán hàng của bạn chưa hết hạn");
        }

        UpgradeRequest  upgradeRequest = new UpgradeRequest();
        upgradeRequest.setUser(user);

        upgradeRequestRepository.save(upgradeRequest);
    }


}
