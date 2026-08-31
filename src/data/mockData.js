// Initial mock data used to demonstrate the UI.
// Everything here lives only in memory (React state) — no backend involved.

let idCounter = 100

export function generateId() {
  idCounter += 1
  return idCounter
}

export const initialGroups = [
  {
    id: 1,
    name: 'مجموعة اللغة الإنجليزية - المستوى الأول',
    students: [
      {
        id: 1,
        name: 'أحمد محمد علي',
        phone: '01012345678',
        parentPhone: '01098765432',
        price: 350,
        subscriptions: [
          {
            id: 1,
            startDate: '2026-08-01',
            endDate: '2026-08-31',
            paymentMethod: 'كاش',
          },
        ],
      },
      {
        id: 2,
        name: 'سارة إبراهيم',
        phone: '01123456789',
        parentPhone: '01187654321',
        price: 350,
        subscriptions: [
          {
            id: 2,
            startDate: '2026-08-05',
            endDate: '2026-09-04',
            paymentMethod: 'إنستا باي',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'مجموعة الرياضيات - إعدادي',
    students: [
      {
        id: 3,
        name: 'يوسف عبد الله',
        phone: '01234567890',
        parentPhone: '01276543210',
        price: 300,
        subscriptions: [],
      },
    ],
  },
  {
    id: 3,
    name: 'مجموعة الفيزياء - ثانوي',
    students: [],
  },
]
