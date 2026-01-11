import { useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Question {
  id: string;
  nguoiHoi: {
    username: string;
    hoVaTen: string;
  };
  cauHoi: string;
  cauTraLoi?: string;
  thoiGianHoi: string;
  thoiGianTraLoi?: string;
}

interface QuestionFormData {
  question: string;
}

interface AskSellerProps {
  productId: string;
  sellerId: string;
}

export function AskSeller({ productId, sellerId }: AskSellerProps) {
  const [questions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuestionFormData>();

  // TODO: Fetch questions from API
  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     const data = await questionApi.getProductQuestions(productId);
  //     setQuestions(data);
  //   };
  //   fetchQuestions();
  // }, [productId]);

  const onSubmit = async (data: QuestionFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Call API to send question
      // await questionApi.askQuestion(productId, data.question);

      console.log("Sending question:", {
        productId,
        sellerId,
        question: data.question,
      });

      toast.success("Câu hỏi đã được gửi thành công!");
      reset();
      // Refresh questions list
    } catch (error) {
      console.error("Error sending question:", error);
      toast.error("Không thể gửi câu hỏi. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Hỏi người bán
        </CardTitle>
        <CardDescription>
          Đặt câu hỏi về sản phẩm và nhận câu trả lời từ người bán
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="question">
              Câu hỏi của bạn <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="question"
              {...register("question", {
                required: "Vui lòng nhập câu hỏi",
                minLength: {
                  value: 10,
                  message: "Câu hỏi phải có ít nhất 10 ký tự",
                },
                maxLength: {
                  value: 500,
                  message: "Câu hỏi không được vượt quá 500 ký tự",
                },
              })}
              placeholder="Nhập câu hỏi của bạn về sản phẩm..."
              rows={4}
            />
            {errors.question && (
              <p className="text-sm text-destructive">
                {errors.question.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Đang gửi..." : "Gửi câu hỏi"}
          </Button>
        </form>

        {/* Questions List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">
            Câu hỏi & Trả lời ({questions.length})
          </h3>
          {questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có câu hỏi nào</p>
              <p className="text-sm">Hãy là người đầu tiên đặt câu hỏi!</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="border rounded-lg p-4 space-y-3 bg-muted/30"
                  >
                    {/* Question */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {q.nguoiHoi.hoVaTen}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(q.thoiGianHoi)}
                        </span>
                      </div>
                      <p className="text-sm">{q.cauHoi}</p>
                    </div>

                    {/* Answer */}
                    {q.cauTraLoi ? (
                      <div className="bg-background rounded-lg p-3 space-y-1 border-l-4 border-primary">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-primary">
                            Người bán
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {q.thoiGianTraLoi &&
                              formatDateTime(q.thoiGianTraLoi)}
                          </span>
                        </div>
                        <p className="text-sm">{q.cauTraLoi}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Chưa có câu trả lời
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
