import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

interface CancelActionProps {
  currentUserRole: "buyer" | "seller";
  onCancel: (reason: string) => void;
}

export function CancelAction({ currentUserRole, onCancel }: CancelActionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    if (!reason.trim()) {
      toast.error("Vui lÃ²ng nháº­p lÃ½ do há»§y");
      return;
    }
    onCancel(reason);
    setDialogOpen(false);
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">hoáº·c</span>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={() => setDialogOpen(true)}
        className="w-full"
      >
        <XCircle className="mr-2 h-4 w-4" />
        Há»§y giao dá»‹ch
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Há»§y giao dá»‹ch</AlertDialogTitle>
            <AlertDialogDescription>
              HÃ nh Ä‘á»™ng nÃ y khÃ´ng thá»ƒ hoÃ n tÃ¡c. NgÆ°á»i{" "}
              {currentUserRole === "seller" ? "mua" : "bÃ¡n"} sáº½ nháº­n Ä‘Ã¡nh giÃ¡ -1
              Ä‘iá»ƒm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cancelReason">LÃ½ do há»§y</Label>
            <Textarea
              id="cancelReason"
              placeholder="Nháº­p lÃ½ do há»§y giao dá»‹ch..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay láº¡i</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>
              XÃ¡c nháº­n há»§y
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
