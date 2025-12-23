package com.example.backend.dto.admin.UpgradeRequest;

import com.example.backend.entity.UpgradeRequestStatus;
import com.example.backend.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpgradeRequestResponse {

    Long requestid;

    String userid;

    String username;

    UpgradeRequestStatus trangThai;

    String lyDo;

    String approvedByAdmin;

    String ghiChuAdmin;
}
