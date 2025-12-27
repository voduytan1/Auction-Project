import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./store";
import { router } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { PageLoader } from "./components/PageLoader";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthRestoreWrapper } from "./components/AuthRestoreWrapper";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthRestoreWrapper>
        <WebSocketProvider>
          <NotificationProvider>
            <ThemeProvider defaultTheme="light" storageKey="auction-theme">
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
            </ThemeProvider>
          </NotificationProvider>
        </WebSocketProvider>
      </AuthRestoreWrapper>
    </Provider>
  </StrictMode>
);
