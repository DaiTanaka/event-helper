export type UserProfile = {
  id: string
  organization: string | null
  industry: string | null
  role: string | null
  prefecture: string | null
  events_per_year: string | null
  created_at: string
  updated_at: string
}

export type Event = {
  id: string
  user_id: string | null
  title: string
  event_date: string | null
  end_date: string | null
  setup_date: string | null
  teardown_date: string | null
  venue_name: string | null
  venue_address: string | null
  venue_access: string | null
  organizer: string | null
  co_organizers: string | null
  expected_visitors: number | null
  target_audience: string | null
  overview: string | null
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  notes: string | null
  total_budget: number | null
  event_type: string | null
  target_age: string[] | null
  venue_type: string | null
  prefecture: string | null
  venue_map_url: string | null
  venue_meeting_place: string | null
  venue_meeting_time: string | null
  venue_entry: string | null
  staff_dress_code: string | null
  created_at: string
  updated_at: string
}

export type EventBudgetItem = {
  id: string
  event_id: string
  category: string
  name: string
  quantity: number
  unit_price: number
  actual_price: number | null
  notes: string | null
  sort_order: number
  created_at: string
}

export type EventReport = {
  id: string
  event_id: string
  actual_visitors: number | null
  total_revenue: number | null
  total_expense: number | null
  summary: string | null
  highlights: string | null
  improvements: string | null
  next_actions: string | null
  satisfaction_score: number | null
  weather: string | null
  report_date: string | null
  content_score: number | null
  venue_score: number | null
  operation_score: number | null
  attendance_rate: number | null
  created_at: string
  updated_at: string
}

export type EventSchedule = {
  id: string
  event_id: string
  day_number: number
  schedule_type: string | null
  start_time: string | null
  end_time: string | null
  content: string
  location: string | null
  responsible_person: string | null
  notes: string | null
  sort_order: number
  created_at: string
}

export type EventEquipment = {
  id: string
  event_id: string
  category: string | null
  name: string
  quantity: number
  unit: string
  supplier: string | null
  notes: string | null
  checked: boolean
  sort_order: number
  created_at: string
}

export type EventContact = {
  id: string
  event_id: string
  name: string
  role: string | null
  company: string | null
  phone: string | null
  email: string | null
  notes: string | null
  sort_order: number
  created_at: string
}

export type EventQA = {
  id: string
  event_id: string
  question: string
  answer: string
  sort_order: number
  created_at: string
}

export type EventTask = {
  id: string
  event_id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'high' | 'medium' | 'low'
  assignee: string | null
  start_date: string | null
  due_date: string | null
  sort_order: number
  template_task_id: string | null
  created_at: string
}

export type EventContent = {
  id: string
  event_id: string
  catalog_id: string | null
  title: string
  category: string | null
  company_name: string | null
  estimated_cost: number | null
  actual_cost: number | null
  status: 'considering' | 'confirmed' | 'cancelled'
  cancel_reason: string | null
  notes: string | null
  url: string | null
  og_image_url: string | null
  sort_order: number
  created_at: string
}

export type CatalogView = {
  id: string
  user_id: string | null
  catalog_id: string
  event_id: string | null
  viewed_at: string
}

export type EventMember = {
  id: string
  event_id: string
  user_id: string
  role: 'editor' | 'viewer'
  invited_by: string | null
  created_at: string
  // joined from user profiles / auth
  email?: string
}

export type EventInvitation = {
  id: string
  event_id: string
  label: string | null
  role: 'editor' | 'viewer'
  invited_by: string
  token: string
  expires_at: string
  accepted_at: string | null
  accepted_by: string | null
  created_at: string
}
