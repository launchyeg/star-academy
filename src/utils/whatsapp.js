/**
 * Normalizes an Egyptian local phone number (e.g. "01012345678") into the
 * international digits-only format WhatsApp's wa.me links expect
 * (e.g. "201012345678"), stripping any spaces/dashes along the way.
 */
function normalizeEgyptPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  return `20${digits}`;
}

/**
 * Builds a wa.me link that opens WhatsApp with a pre-filled payment receipt
 * message for a student's parent, based on the student and one
 * subscription/payment record.
 */
export function buildReceiptWhatsAppLink({
  studentName,
  groupName,
  price,
  startDate,
  endDate,
  paymentMethod,
  parentPhone,
}) {
  const message = `مرحبًا،

نود إعلامكم بأنه تم دفع اشتراك الطالب: ${studentName}

المجموعة: ${groupName}
قيمة الاشتراك: ${price} ج.م
فترة الاشتراك: من ${startDate} إلى ${endDate}
طريقة الدفع: ${paymentMethod}

شكرًا لكم،
Star Academy`;

  const phone = normalizeEgyptPhone(parentPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a wa.me link that opens WhatsApp with a pre-filled monthly report
 * for a student's parent, covering their subscription/payment history,
 * attendance, quiz grades, final exam grade and any note.
 */
export function buildMonthlyReportWhatsAppLink({
  studentName,
  groupName,
  subscriptions = [],
  attendance = [],
  quizzes = [],
  finalExam,
  note,
  parentPhone,
}) {
  const paymentsList = subscriptions.length
    ? subscriptions
        .map(
          (sub) =>
            `- من ${sub.startDate} إلى ${sub.endDate} (${sub.paymentMethod})`,
        )
        .join("\n")
    : "لا يوجد مدفوعات مسجلة";

  const attendanceCount = attendance.filter(Boolean).length;
  const attendanceList = attendance
    .map((present, index) => `الحصة ${index + 1}: ${present ? "حاضر" : "غائب"}`)
    .join("\n");

  const quizzesList = quizzes
    .map((grade, index) => `كويز ${index + 1}: ${grade || "-"}`)
    .join("\n");

  const message = `مرحبًا،

هذا هو التقرير الشهري الخاص بالطالب:

 اسم الطالب: ${studentName}
 المجموعة: ${groupName}

 سجل الاشتراكات والمدفوعات:

${paymentsList}

 الحضور:

عدد مرات الحضور: ${attendanceCount} من ${attendance.length}

${attendanceList}

 درجات الكويزات:

${quizzesList}

 الاختبار النهائي:

الدرجة: ${finalExam || "-"}

 ملاحظات:

${note || "-"}

شكرًا لكم،
Star Academy`;

  const phone = normalizeEgyptPhone(parentPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
