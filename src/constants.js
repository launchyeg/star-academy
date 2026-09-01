// Shared constants for the attendance/quiz/final-exam/note record set kept on
// every subscription (one record set per month/subscription, since each
// subscription represents one monthly cycle).
export const RECORD_SLOTS = 8;

export function createEmptyMonthRecords() {
  return {
    attendance: Array(RECORD_SLOTS).fill(false),
    quizzes: Array(RECORD_SLOTS).fill(""),
    finalExam: "",
    note: "",
  };
}
