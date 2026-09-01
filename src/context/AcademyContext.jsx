import { createContext, useContext, useMemo, useState } from 'react'
import { initialGroups, generateId } from '../data/mockData'
import { createEmptyMonthRecords } from '../constants'

const AcademyContext = createContext(null)

/**
 * Holds all academy data (groups + students) in React state.
 * This is a frontend-only in-memory store: refreshing the page resets it.
 * The API surface here is intentionally shaped so it can later be swapped
 * for real network calls without touching the components that consume it.
 */
export function AcademyProvider({ children }) {
  const [groups, setGroups] = useState(initialGroups)

  function addGroup(name) {
    const newGroup = { id: generateId(), name: name.trim(), students: [] }
    setGroups((prev) => [...prev, newGroup])
    return newGroup
  }

  function getGroup(groupId) {
    return groups.find((g) => String(g.id) === String(groupId))
  }

  function addStudent(groupId, student) {
    setGroups((prev) =>
      prev.map((g) =>
        String(g.id) === String(groupId)
          ? { ...g, students: [...g.students, { id: generateId(), ...student }] }
          : g
      )
    )
  }

  function updateStudent(groupId, studentId, updatedFields) {
    setGroups((prev) =>
      prev.map((g) =>
        String(g.id) === String(groupId)
          ? {
              ...g,
              students: g.students.map((s) =>
                String(s.id) === String(studentId) ? { ...s, ...updatedFields } : s
              ),
            }
          : g
      )
    )
  }

  function deleteStudent(groupId, studentId) {
    setGroups((prev) =>
      prev.map((g) =>
        String(g.id) === String(groupId)
          ? { ...g, students: g.students.filter((s) => String(s.id) !== String(studentId)) }
          : g
      )
    )
  }

  // Returns the new subscription's id synchronously, so callers can e.g.
  // auto-expand its attendance/grades section right after creating it.
  function addSubscription(groupId, studentId, subscription) {
    const newSubscriptionId = generateId()
    setGroups((prev) =>
      prev.map((g) =>
        String(g.id) === String(groupId)
          ? {
              ...g,
              students: g.students.map((s) =>
                String(s.id) === String(studentId)
                  ? {
                      ...s,
                      subscriptions: [
                        ...(s.subscriptions || []),
                        { id: newSubscriptionId, ...subscription, ...createEmptyMonthRecords() },
                      ],
                    }
                  : s
              ),
            }
          : g
      )
    )
    return newSubscriptionId
  }

  function deleteSubscription(groupId, studentId, subscriptionId) {
    setGroups((prev) =>
      prev.map((g) =>
        String(g.id) === String(groupId)
          ? {
              ...g,
              students: g.students.map((s) =>
                String(s.id) === String(studentId)
                  ? {
                      ...s,
                      subscriptions: (s.subscriptions || []).filter(
                        (sub) => String(sub.id) !== String(subscriptionId)
                      ),
                    }
                  : s
              ),
            }
          : g
      )
    )
  }

  // Commits attendance/quizzes/finalExam for one subscription (one month).
  function updateSubscriptionRecords(groupId, studentId, subscriptionId, records) {
    setGroups((prev) =>
      prev.map((g) =>
        String(g.id) === String(groupId)
          ? {
              ...g,
              students: g.students.map((s) =>
                String(s.id) === String(studentId)
                  ? {
                      ...s,
                      subscriptions: (s.subscriptions || []).map((sub) =>
                        String(sub.id) === String(subscriptionId) ? { ...sub, ...records } : sub
                      ),
                    }
                  : s
              ),
            }
          : g
      )
    )
  }

  const totals = useMemo(() => {
    const totalGroups = groups.length
    const totalStudents = groups.reduce((sum, g) => sum + g.students.length, 0)
    const totalRevenue = groups.reduce(
      (sum, g) => sum + g.students.reduce((s, student) => s + Number(student.price || 0), 0),
      0
    )
    return { totalGroups, totalStudents, totalRevenue }
  }, [groups])

  const value = {
    groups,
    totals,
    addGroup,
    getGroup,
    addStudent,
    updateStudent,
    deleteStudent,
    addSubscription,
    deleteSubscription,
    updateSubscriptionRecords,
  }

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>
}

export function useAcademy() {
  const ctx = useContext(AcademyContext)
  if (!ctx) throw new Error('useAcademy must be used within an AcademyProvider')
  return ctx
}
