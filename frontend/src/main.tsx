import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./store";
import { router } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { PageLoader } from "./components/PageLoader";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { AuthRestoreWrapper } from "./components/AuthRestoreWrapper";
import { RateLimitProvider } from "./components/RateLimitProvider";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <AuthRestoreWrapper>
          <WebSocketProvider>
            <ThemeProvider defaultTheme="light" storageKey="auction-theme">
              <RateLimitProvider>
                <Suspense
                  fallback={
                    <PageLoader
                      message="Đang tải trang..."
                      className="min-h-screen"
                    />
                  }
                >
                  <RouterProvider router={router} />
                </Suspense>
                <Toaster />
              </RateLimitProvider>
            </ThemeProvider>
          </WebSocketProvider>
        </AuthRestoreWrapper>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
