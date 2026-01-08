package com.example.backend.repository;

import com.example.backend.entity.ChatMessage;
import com.example.backend.entity.Transaction;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<@NotNull ChatMessage, @NotNull Long> {

    // Lấy tất cả tin nhắn của transaction (phân trang)
    Page<@NotNull ChatMessage> findByTransactionTransactionidOrderByCreatedAtAsc(
            Long transactionid, Pageable pageable
    );

    // Lấy tất cả tin nhắn (cho real-time load)
    List<ChatMessage> findByTransactionTransactionidOrderByCreatedAtAsc(
            Long transactionid
    );

    // Đếm tin nhắn chưa đọc
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
            "WHERE cm.transaction.transactionid = :transactionid " +
            "AND cm.sender.userid != :userid " +
            "AND cm.isRead = false")
    Long countUnreadMessages(@Param("transactionid") Long transactionid,
                             @Param("userid") UUID userid);

    // Đánh dấu tất cả tin nhắn là đã đọc
    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.isRead = true " +
            "WHERE cm.transaction.transactionid = :transactionid " +
            "AND cm.sender.userid != :userid " +
            "AND cm.isRead = false")
    void markAllAsRead(@Param("transactionid") Long transactionid,
                       @Param("userid") UUID userid);

    // Lấy tin nhắn cuối cùng của transaction
    @Query("SELECT cm FROM ChatMessage cm " +
            "WHERE cm.transaction.transactionid = :transactionid " +
            "ORDER BY cm.createdAt DESC LIMIT 1")
    ChatMessage findLastMessageByTransaction(@Param("transactionid") Long transactionid);

    // Lấy danh sách transactions có tin nhắn của user
    @Query("SELECT cm.transaction FROM ChatMessage cm " +
            "WHERE cm.transaction.buyer.userid = :userid " +
            "OR cm.transaction.seller.userid = :userid " +
            "GROUP BY cm.transaction " +
            "ORDER BY MAX(cm.createdAt) DESC")
    List<Transaction> findTransactionsWithMessagesByUser(@Param("userid") UUID userid);

    // Xóa tất cả tin nhắn của transaction
    void deleteByTransactionTransactionid(Long transactionid);
}
