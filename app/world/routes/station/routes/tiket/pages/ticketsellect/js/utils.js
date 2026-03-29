export const Util = {
  fmtWon(n) {
    if (!Number.isFinite(n)) return "-";
    return n.toLocaleString("ko-KR") + "원";
  },
  clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  },
};
