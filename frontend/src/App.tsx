import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { router } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="auction-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
