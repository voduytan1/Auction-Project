import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Star, CheckCircle } from "lucide-react";
import type { ProductQuestion } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface QASectionProps {
  questions: ProductQuestion[];
  onAskQuestion?: (question: string) => void;
}

export function QASection({ questions, onAskQuestion }: QASectionProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const handleSubmit = () => {
    if (!newQuestion.trim()) return;

    setIsAsking(true);
    // Simulate API call
    setTimeout(() => {
      onAskQuestion?.(newQuestion);
      setNewQuestion("");
      setIsAsking(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Câu hỏi & Trả lời ({questions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ask Question Form */}
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

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((qa) => (
            <div
              key={qa.id}
              className="space-y-4 border-b pb-6 last:border-0 last:pb-0"
            >
              {/* Question */}
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                    {qa.askerName.charAt(0)}
                  </div>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{qa.askerName}</span>
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{qa.askerRating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(qa.askedAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-sm">
                    {qa.question}
                  </div>
                </div>
              </div>

              {/* Answer */}
              {qa.answer ? (
                <div className="ml-13 flex gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="gap-1 bg-primary/10 text-primary"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Người bán đã trả lời
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {qa.answeredAt &&
                          formatDistanceToNow(new Date(qa.answeredAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                      </span>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-3 text-sm">
                      {qa.answer}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ml-13">
                  <Badge variant="secondary" className="text-xs">
                    Chờ người bán trả lời...
                  </Badge>
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
