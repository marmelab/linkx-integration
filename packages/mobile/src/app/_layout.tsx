import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { primary } from "@/style-constants";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack backgroundColor={primary[50]}>
        <Stack.Header hidden />
      </Stack>
    </QueryClientProvider>
  );
}
