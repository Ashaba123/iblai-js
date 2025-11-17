export const getUserName = (): string => {
  return JSON.parse(localStorage.getItem("userData")!)?.user_nicename;
};
