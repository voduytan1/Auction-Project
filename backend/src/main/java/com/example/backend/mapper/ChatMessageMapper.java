package com.example.backend.mapper;

import com.example.backend.dto.transaction.chat.ChatMessageResponse;
import com.example.backend.entity.ChatMessage;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ChatMessageMapper {

    @Mapping(source = "transaction.transactionid", target = "transactionid")
    @Mapping(source = "sender.userid", target = "senderid")
    @Mapping(source = "sender.hoVaTen", target = "senderName")
    @Mapping(source = "sender.anhDaiDien", target = "senderAvatar")
    @Mapping(target = "isSentByMe", ignore = true)
        // Set manually in service
    ChatMessageResponse toResponse(ChatMessage chatMessage);
}

