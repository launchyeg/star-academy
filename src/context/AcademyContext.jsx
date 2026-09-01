import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AcademyContext = createContext(null)

// Nested select: one round trip fetches every group with its students and
// each student's subscriptions, mirroring the shape the UI already expects.
const GROUPS_SELECT = `
  id, name,
  students (
    id, name, phone, parent_phone, price,
    subscriptions (
      id, start_date, end_date, payment_method, attendance, quizzes, final_exam, note
    )
  )
`

// The DB uses snake_case columns; the UI (built against the old mock data)
// expects camelCase. These mappers keep that translation in one place so no
// component needs to know the database's column names.
function mapSubscription(row) {
  return {
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    paymentMethod: row.payment_method,
    attendance: row.attendance,
    quizzes: row.quizzes,
    finalExam: row.final_exam,
    note: row.note,
  }
}

function mapStudent(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    parentPhone: row.parent_phone,
    price: row.price,
    subscriptions: (row.subscriptions || []).map(mapSubscription),
  }
}

function mapGroup(row) {
  return {
    id: row.id,
    name: row.name,
    students: (row.students || []).map(mapStudent),
  }
}

/**
 * Holds all academy data (groups + students + subscriptions), backed by
 * Supabase (Postgres). Data is fetched on load and re-synced after every
 * mutation, so `groups` always reflects what's actually in the database.
 */
export function AcademyProvider({ children }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function refresh() {
    const { data, error: fetchError } = await supabase
      .from('groups')
      .select(GROUPS_SELECT)
      .order('created_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setError(null)
    setGroups((data || []).map(mapGroup))
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  async function addGroup(name) {
    const { data, error: insertError } = await supabase
      .from('groups')
      .insert({ name: name.trim() })
      .select()
      .single()
    if (insertError) throw insertError

    await refresh()
    return mapGroup({ ...data, students: [] })
  }

  function getGroup(groupId) {
    return groups.find((g) => String(g.id) === String(groupId))
  }

  async function updateGroup(groupId, name) {
    const { error: updateError } = await supabase
      .from('groups')
      .update({ name: name.trim() })
      .eq('id', groupId)
    if (updateError) throw updateError
    await refresh()
  }

  // Deletes only the group row. Its students (and their subscriptions) are
  // kept — the DB's ON DELETE SET NULL foreign key just ungroups them
  // instead of cascading the delete down to them.
  async function deleteGroup(groupId) {
    const { error: deleteError } = await supabase.from('groups').delete().eq('id', groupId)
    if (deleteError) throw deleteError
    await refresh()
  }

  async function addStudent(groupId, student) {
    const { error: insertError } = await supabase.from('students').insert({
      group_id: groupId,
      name: student.name,
      phone: student.phone,
      parent_phone: student.parentPhone,
      price: student.price,
    })
    if (insertError) throw insertError
    await refresh()
  }

  async function updateStudent(groupId, studentId, updatedFields) {
    const payload = {}
    if ('name' in updatedFields) payload.name = updatedFields.name
    if ('phone' in updatedFields) payload.phone = updatedFields.phone
    if ('parentPhone' in updatedFields) payload.parent_phone = updatedFields.parentPhone
    if ('price' in updatedFields) payload.price = updatedFields.price

    const { error: updateError } = await supabase
      .from('students')
      .update(payload)
      .eq('id', studentId)
    if (updateError) throw updateError
    await refresh()
  }

  async function deleteStudent(groupId, studentId) {
    const { error: deleteError } = await supabase.from('students').delete().eq('id', studentId)
    if (deleteError) throw deleteError
    await refresh()
  }

  // Returns the new subscription's id, so callers can e.g. auto-expand its
  // attendance/grades section right after creating it. The id is generated
  // client-side (instead of waiting on the DB's default) so it's available
  // as soon as the insert is confirmed, without a second round trip.
  async function addSubscription(groupId, studentId, subscription) {
    const newSubscriptionId = crypto.randomUUID()
    const { error: insertError } = await supabase.from('subscriptions').insert({
      id: newSubscriptionId,
      student_id: studentId,
      start_date: subscription.startDate,
      end_date: subscription.endDate,
      payment_method: subscription.paymentMethod,
    })
    if (insertError) throw insertError

    await refresh()
    return newSubscriptionId
  }

  async function deleteSubscription(groupId, studentId, subscriptionId) {
    const { error: deleteError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', subscriptionId)
    if (deleteError) throw deleteError
    await refresh()
  }

  // Commits attendance/quizzes/finalExam/note for one subscription (one month).
  async function updateSubscriptionRecords(groupId, studentId, subscriptionId, records) {
    const payload = {}
    if ('attendance' in records) payload.attendance = records.attendance
    if ('quizzes' in records) payload.quizzes = records.quizzes
    if ('finalExam' in records) payload.final_exam = records.finalExam
    if ('note' in records) payload.note = records.note

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(payload)
      .eq('id', subscriptionId)
    if (updateError) throw updateError
    await refresh()
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
    loading,
    error,
    totals,
    addGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    addStudent,
    updateStudent,
    deleteStudent,
    addSubscription,
    deleteSubscription,
    updateSubscriptionRecords,
    refresh,
  }

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>
}

export function useAcademy() {
  const ctx = useContext(AcademyContext)
  if (!ctx) throw new Error('useAcademy must be used within an AcademyProvider')
  return ctx
}
