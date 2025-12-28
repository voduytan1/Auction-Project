import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Star, CheckCircle, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import {
  questionAPI,
  type ProductQuestionResponse,
} from "@/services/question.api";
import { PageLoader } from "@/components/PageLoader";
import { useAppSelector } from "@/hooks/use-redux";

interface QASectionProps {
  productId: number;
  sellerId: string;
}

export function QASection({ productId, sellerId }: QASectionProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [questions, setQuestions] = useState<ProductQuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const isSeller =
    isAuthenticated && user && String(user.userid) === String(sellerId);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await questionAPI.getByProduct({
          productId,
          size: 20,
          sortBy: "thoiGianHoi",
          sortOrder: "desc",
        });
        const data = Array.isArray(response.data) ? response.data : [];
        console.log("Questions data:", data);
        if (data.length > 0) {
          console.log("First question keys:", Object.keys(data[0]));
          console.log("First question questionId:", data[0].questionId);
        }
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Không thể tải danh sách câu hỏi");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [productId]);

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;

    try {
      setIsAsking(true);
      await questionAPI.create({
        productId,
        noiDungCauHoi: newQuestion.trim(),
      });

      toast.success("Đã gửi câu hỏi thành công!");
      setNewQuestion("");

      // Refresh questions list
      const response = await questionAPI.getByProduct({
        productId,
        size: 20,
        sortBy: "thoiGianHoi",
        sortOrder: "desc",
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setQuestions(data);
    } catch (error) {
      console.error("Error asking question:", error);
      toast.error("Không thể gửi câu hỏi. Vui lòng thử lại!");
    } finally {
      setIsAsking(false);
    }
  };

  const handleReply = async (questionId: number) => {
    if (!replyText.trim()) return;

    try {
      setIsReplying(true);
      await questionAPI.answer({
        productId,
        questionId,
        noiDungTraLoi: replyText.trim(),
      });

      toast.success("Đã trả lời câu hỏi thành công!");
      setReplyText("");
      setReplyingTo(null);

      // Refresh questions list
      const response = await questionAPI.getByProduct({
        productId,
        size: 20,
        sortBy: "thoiGianHoi",
        sortOrder: "desc",
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setQuestions(data);
    } catch (error) {
      console.error("Error replying to question:", error);
      toast.error("Không thể trả lời câu hỏi. Vui lòng thử lại!");
    } finally {
      setIsReplying(false);
    }
  };

  if (loading) {
    return <PageLoader message="Đang tải câu hỏi..." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Câu hỏi & Trả lời ({questions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ask Question Form - Only show for non-sellers */}
        {!isSeller && (
          <div className="space-y-3">
            <div className="text-sm font-semibold">Hỏi người bán</div>
            <Textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Nhập câu hỏi của bạn về sản phẩm..."
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={handleSubmit}
              disabled={!newQuestion.trim() || isAsking}
              className="w-full sm:w-auto"
            >
              <Send className="mr-2 h-4 w-4" />
              {isAsking ? "Đang gửi..." : "Gửi câu hỏi"}
            </Button>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((qa) => (
            <div
              key={qa.questionId}
              className="space-y-4 border-b pb-6 last:border-0 last:pb-0"
            >
              {/* Question */}
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  {qa.anhDaiDienNguoiHoi ? (
                    <AvatarImage
                      src={qa.anhDaiDienNguoiHoi}
                      alt={qa.tenNguoiHoi}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {qa.tenNguoiHoi.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{qa.tenNguoiHoi}</span>
                    {qa.diemDanhGiaNguoiHoi != null && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{qa.diemDanhGiaNguoiHoi.toFixed(1)}</span>
                      </div>
                    )}
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(qa.thoiGianHoi), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-sm">
                    {qa.noiDungCauHoi}
                  </div>
                </div>
              </div>

              {/* Answer */}
              {qa.noiDungTraLoi ? (
                <div className="ml-8 md:ml-13 flex gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="gap-1 bg-primary/10 text-primary"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Người bán đã trả lời
                      </Badge>
                      {qa.thoiGianTraLoi && (
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(qa.thoiGianTraLoi), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      )}
                    </div>
                    <div className="rounded-lg bg-primary/5 p-3 text-sm">
                      {qa.noiDungTraLoi}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ml-13">
                  {isSeller ? (
                    replyingTo === qa.questionId ? (
                      <div className="space-y-3">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Nhập câu trả lời của bạn..."
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleReply(qa.questionId)}
                            disabled={!replyText.trim() || isReplying}
                            size="sm"
                          >
                            <Send className="mr-2 h-4 w-4" />
                            {isReplying ? "Đang gửi..." : "Gửi trả lời"}
                          </Button>
                          <Button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            variant="outline"
                            size="sm"
                            disabled={isReplying}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setReplyingTo(qa.questionId)}
                        variant="outline"
                        size="sm"
                      >
                        <Reply className="mr-2 h-4 w-4" />
                        Trả lời
                      </Button>
                    )
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Chờ người bán trả lời...
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
