const KEY = "my_booking_codes";

export const getMyCodes = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const addMyCode = (code: string) => {
  const codes = getMyCodes();
  if (!codes.includes(code)) {
    codes.push(code);
    localStorage.setItem(KEY, JSON.stringify(codes));
  }
};

export const removeMyCode = (code: string) => {
  const codes = getMyCodes().filter((c) => c !== code);
  localStorage.setItem(KEY, JSON.stringify(codes));
};