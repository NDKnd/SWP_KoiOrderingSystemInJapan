import "@testing-library/jest-dom"; // Import tiện ích của jest-dom
import { beforeAll, vi } from "vitest"; // Import trước khi tất cả các test bắt đầu

// Mock `window.matchMedia` để tránh lỗi khi thử nghiệm với Ant Design
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => {
      return {
        matches: false,  // Giá trị mặc định của matchMedia
        media: query,
        onchange: null,
        addListener: vi.fn(),  // Mô phỏng hàm addListener
        removeListener: vi.fn(),  // Mô phỏng hàm removeListener
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });
});
