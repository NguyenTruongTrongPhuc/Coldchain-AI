import { useState, useEffect } from 'react';

// Hook này giúp trì hoãn việc cập nhật giá trị (ví dụ: thanh tìm kiếm)
// cho đến khi người dùng ngừng gõ trong một khoảng thời gian nhất định.
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Hủy bỏ timeout nếu value thay đổi (người dùng lại gõ phím)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}