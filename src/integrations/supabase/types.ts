export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      roles: {
        Row: { id: number; name: string; }
        Insert: { id?: number; name: string; }
        Update: { id?: number; name?: string; }
        Relationships: []
      }
      users: {
        Row: { id: string; email: string; full_name: string | null; role_id: number | null; is_active: boolean | null; created_at: string | null; }
        Insert: { id?: string; email: string; full_name?: string | null; role_id?: number | null; is_active?: boolean | null; created_at?: string | null; }
        Update: { id?: string; email?: string; full_name?: string | null; role_id?: number | null; is_active?: boolean | null; created_at?: string | null; }
        Relationships: [{ foreignKeyName: "users_role_id_fkey", columns: ["role_id"], isOneToOne: false, referencedRelation: "roles", referencedColumns: ["id"] }]
      }
      drivers: {
        Row: { id: string; user_id: string | null; license_number: string | null; license_type: string | null; license_expiry: string | null; phone: string | null; address: string | null; medical_certificate_expiry: string | null; status: string | null; created_at: string | null; }
        Insert: { id?: string; user_id?: string | null; license_number?: string | null; license_type?: string | null; license_expiry?: string | null; phone?: string | null; address?: string | null; medical_certificate_expiry?: string | null; status?: string | null; created_at?: string | null; }
        Update: { id?: string; user_id?: string | null; license_number?: string | null; license_type?: string | null; license_expiry?: string | null; phone?: string | null; address?: string | null; medical_certificate_expiry?: string | null; status?: string | null; created_at?: string | null; }
        Relationships: [{ foreignKeyName: "drivers_user_id_fkey", columns: ["user_id"], isOneToOne: false, referencedRelation: "users", referencedColumns: ["id"] }]
      }
      vehicles: {
        Row: { id: string; registration: string; vin: string | null; brand: string; model: string; year: number | null; category: string | null; fuel_type: string | null; tank_capacity: number | null; initial_mileage: number | null; current_mileage: number | null; status: string | null; purchase_date: string | null; purchase_price: number | null; photo_url: string | null; photo_url_2: string | null; photo_url_3: string | null; created_at: string | null; }
        Insert: { id?: string; registration: string; vin?: string | null; brand: string; model: string; year?: number | null; category?: string | null; fuel_type?: string | null; tank_capacity?: number | null; initial_mileage?: number | null; current_mileage?: number | null; status?: string | null; purchase_date?: string | null; purchase_price?: number | null; photo_url?: string | null; photo_url_2?: string | null; photo_url_3?: string | null; created_at?: string | null; }
        Update: { id?: string; registration?: string; vin?: string | null; brand?: string; model?: string; year?: number | null; category?: string | null; fuel_type?: string | null; tank_capacity?: number | null; initial_mileage?: number | null; current_mileage?: number | null; status?: string | null; purchase_date?: string | null; purchase_price?: number | null; photo_url?: string | null; photo_url_2?: string | null; photo_url_3?: string | null; created_at?: string | null; }
        Relationships: []
      }
      vehicle_documents: {
        Row: { id: string; vehicle_id: string | null; document_type: string | null; provider: string | null; contract_number: string | null; start_date: string | null; expiry_date: string | null; cost: number | null; file_url: string | null; created_at: string | null; }
        Insert: { id?: string; vehicle_id?: string | null; document_type?: string | null; provider?: string | null; contract_number?: string | null; start_date?: string | null; expiry_date?: string | null; cost?: number | null; file_url?: string | null; created_at?: string | null; }
        Update: { id?: string; vehicle_id?: string | null; document_type?: string | null; provider?: string | null; contract_number?: string | null; start_date?: string | null; expiry_date?: string | null; cost?: number | null; file_url?: string | null; created_at?: string | null; }
        Relationships: [{ foreignKeyName: "vehicle_documents_vehicle_id_fkey", columns: ["vehicle_id"], isOneToOne: false, referencedRelation: "vehicles", referencedColumns: ["id"] }]
      }
      assignments: {
        Row: { id: string; vehicle_id: string | null; driver_id: string | null; start_date: string; end_date: string | null; purpose: string | null; destination: string | null; starting_mileage: number | null; ending_mileage: number | null; status: string | null; created_at: string | null; }
        Insert: { id?: string; vehicle_id?: string | null; driver_id?: string | null; start_date: string; end_date?: string | null; purpose?: string | null; destination?: string | null; starting_mileage?: number | null; ending_mileage?: number | null; status?: string | null; created_at?: string | null; }
        Update: { id?: string; vehicle_id?: string | null; driver_id?: string | null; start_date?: string; end_date?: string | null; purpose?: string | null; destination?: string | null; starting_mileage?: number | null; ending_mileage?: number | null; status?: string | null; created_at?: string | null; }
        Relationships: [
          { foreignKeyName: "assignments_driver_id_fkey", columns: ["driver_id"], isOneToOne: false, referencedRelation: "drivers", referencedColumns: ["id"] },
          { foreignKeyName: "assignments_vehicle_id_fkey", columns: ["vehicle_id"], isOneToOne: false, referencedRelation: "vehicles", referencedColumns: ["id"] }
        ]
      }
      fuel_logs: {
        Row: { id: string; vehicle_id: string | null; driver_id: string | null; date: string; liters: number; cost: number; mileage: number; station: string | null; fuel_card_used: boolean | null; receipt_url: string | null; created_at: string | null; }
        Insert: { id?: string; vehicle_id?: string | null; driver_id?: string | null; date: string; liters: number; cost: number; mileage: number; station?: string | null; fuel_card_used?: boolean | null; receipt_url?: string | null; created_at?: string | null; }
        Update: { id?: string; vehicle_id?: string | null; driver_id?: string | null; date?: string; liters?: number; cost?: number; mileage?: number; station?: string | null; fuel_card_used?: boolean | null; receipt_url?: string | null; created_at?: string | null; }
        Relationships: [
          { foreignKeyName: "fuel_logs_driver_id_fkey", columns: ["driver_id"], isOneToOne: false, referencedRelation: "drivers", referencedColumns: ["id"] },
          { foreignKeyName: "fuel_logs_vehicle_id_fkey", columns: ["vehicle_id"], isOneToOne: false, referencedRelation: "vehicles", referencedColumns: ["id"] }
        ]
      }
      maintenance_logs: {
        Row: { id: string; vehicle_id: string | null; type: string | null; description: string | null; mileage_at_service: number | null; cost: number | null; garage_name: string | null; scheduled_date: string | null; completed_date: string | null; next_service_date: string | null; next_service_mileage: number | null; status: string | null; invoice_url: string | null; created_at: string | null; }
        Insert: { id?: string; vehicle_id?: string | null; type?: string | null; description?: string | null; mileage_at_service?: number | null; cost?: number | null; garage_name?: string | null; scheduled_date?: string | null; completed_date?: string | null; next_service_date?: string | null; next_service_mileage?: number | null; status?: string | null; invoice_url?: string | null; created_at?: string | null; }
        Update: { id?: string; vehicle_id?: string | null; type?: string | null; description?: string | null; mileage_at_service?: number | null; cost?: number | null; garage_name?: string | null; scheduled_date?: string | null; completed_date?: string | null; next_service_date?: string | null; next_service_mileage?: number | null; status?: string | null; invoice_url?: string | null; created_at?: string | null; }
        Relationships: [{ foreignKeyName: "maintenance_logs_vehicle_id_fkey", columns: ["vehicle_id"], isOneToOne: false, referencedRelation: "vehicles", referencedColumns: ["id"] }]
      }
      incidents: {
        Row: { id: string; vehicle_id: string | null; driver_id: string | null; reported_date: string; severity: string | null; description: string; photos_urls: Json | null; status: string | null; resolution_notes: string | null; repair_cost: number | null; created_at: string | null; }
        Insert: { id?: string; vehicle_id?: string | null; driver_id?: string | null; reported_date: string; severity?: string | null; description: string; photos_urls?: Json | null; status?: string | null; resolution_notes?: string | null; repair_cost?: number | null; created_at?: string | null; }
        Update: { id?: string; vehicle_id?: string | null; driver_id?: string | null; reported_date?: string; severity?: string | null; description?: string; photos_urls?: Json | null; status?: string | null; resolution_notes?: string | null; repair_cost?: number | null; created_at?: string | null; }
        Relationships: [
          { foreignKeyName: "incidents_driver_id_fkey", columns: ["driver_id"], isOneToOne: false, referencedRelation: "drivers", referencedColumns: ["id"] },
          { foreignKeyName: "incidents_vehicle_id_fkey", columns: ["vehicle_id"], isOneToOne: false, referencedRelation: "vehicles", referencedColumns: ["id"] }
        ]
      }
      infractions: {
        Row: { id: string; vehicle_id: string | null; driver_id: string | null; infraction_date: string; type: string | null; location: string | null; amount: number | null; points_deducted: number | null; is_paid: boolean | null; document_url: string | null; created_at: string | null; }
        Insert: { id?: string; vehicle_id?: string | null; driver_id?: string | null; infraction_date: string; type?: string | null; location?: string | null; amount?: number | null; points_deducted?: number | null; is_paid?: boolean | null; document_url?: string | null; created_at?: string | null; }
        Update: { id?: string; vehicle_id?: string | null; driver_id?: string | null; infraction_date?: string; type?: string | null; location?: string | null; amount?: number | null; points_deducted?: number | null; is_paid?: boolean | null; document_url?: string | null; created_at?: string | null; }
        Relationships: [
          { foreignKeyName: "infractions_driver_id_fkey", columns: ["driver_id"], isOneToOne: false, referencedRelation: "drivers", referencedColumns: ["id"] },
          { foreignKeyName: "infractions_vehicle_id_fkey", columns: ["vehicle_id"], isOneToOne: false, referencedRelation: "vehicles", referencedColumns: ["id"] }
        ]
      }
      daily_inspections: {
        Row: { id: string; vehicle_id: string | null; driver_id: string | null; inspection_date: string; mileage: number | null; tires_condition: boolean | null; lights_condition: boolean | null; bodywork_condition: boolean | null; fluids_checked: boolean | null; notes: string | null; is_vehicle_safe: boolean | null; }
        Insert: { id?: string; vehicle_id?: string | null; driver_id?: string | null; inspection_date?: string; mileage?: number | null; tires_condition?: boolean | null; lights_condition?: boolean | null; bodywork_condition?: boolean | null; fluids_checked?: boolean | null; notes?: string | null; is_vehicle_safe?: boolean | null; }
        Update: { id?: string; vehicle_id?: string | null; driver_id?: string | null; inspection_date?: string; mileage?: number | null; tires_condition?: boolean | null; lights_condition?: boolean | null; bodywork_condition?: boolean | null; fluids_checked?: boolean | null; notes?: string | null; is_vehicle_safe?: boolean | null; }
        Relationships: [
          { foreignKeyName: "daily_inspections_driver_id_fkey", columns: ["driver_id"], isOneToOne: false, referencedRelation: "drivers", referencedColumns: ["id"] },
          { foreignKeyName: "daily_inspections_vehicle_id_fkey", columns: ["vehicle_id"], isOneToOne: false, referencedRelation: "vehicles", referencedColumns: ["id"] }
        ]
      }
      system_alerts: {
        Row: { id: string; vehicle_id: string | null; type: string | null; message: string; priority: string | null; due_date: string | null; is_read: boolean | null; created_at: string | null; }
        Insert: { id?: string; vehicle_id?: string | null; type?: string | null; message: string; priority?: string | null; due_date?: string | null; is_read?: boolean | null; created_at?: string | null; }
        Update: { id?: string; vehicle_id?: string | null; type?: string | null; message?: string; priority?: string | null; due_date?: string | null; is_read?: boolean | null; created_at?: string | null; }
        Relationships: [{ foreignKeyName: "system_alerts_vehicle_id_fkey", columns: ["vehicle_id"], isOneToOne: false, referencedRelation: "vehicles", referencedColumns: ["id"] }]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
