import "@testing-library/jest-dom"; // Import tiện ích của jest-dom
import { afterAll, afterEach, beforeAll, vi } from "vitest"; // Import trước khi tất cả các test bắt đầu

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

afterEach(() => {
    // Dọn dẹp các mock sau mỗi test case
    vi.clearAllMocks();
});

afterAll(() => {
    // Khôi phục lại trạng thái ban đầu sau tất cả các test
    vi.restoreAllMocks();
});
