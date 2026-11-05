import type { SiteSettings } from '@/lib/site-settings-types';

export type AdminSectionKey =
  | 'overview'
  | 'verifications'
  | 'plates'
  | 'auctions'
  | 'live'
  | 'cms'
  | 'settings'
  | 'identities'
  | 'users'
  | 'registrations'
  | 'bids'
  | 'deposits'
  | 'payments'
  | 'settlements'
  | 'reports'
  | 'messages'
  | 'notifications'
  | 'audit';

export interface AdminViewerInfo {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  mfaVerified: boolean;
  mfaFactorId: string | null;
}

export interface AdminLetterRef {
  id: number;
  arabic: string;
  latin: string;
  sort_order: number;
  active: boolean;
}

export interface AdminPlateTypeRef {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  active: boolean;
  sort_order: number;
}

export interface AdminRegionRef {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
}

export interface AdminCityRef {
  id: string;
  region_id: string;
  name_ar: string;
  name_en: string;
  active: boolean;
}

export interface AdminPlateDocument {
  id: string;
  plate_id: string;
  document_type: string;
  mime_type: string;
  size_bytes: number;
  object_path: string;
  created_at: string;
}

export interface AdminVerificationEvent {
  id: string;
  plate_id: string;
  actor_id: string;
  previous_status: string;
  status: string;
  reason: string;
  created_at: string;
}

export interface AdminPlateRecord {
  id: string;
  slug: string;
  owner_id: string;
  owner_name: string;
  owner_phone: string | null;
  owner_kyc: string;
  type_id: string;
  type_name: string;
  type_code: string;
  city_id: string | null;
  city_name: string;
  letter_1_id: number;
  letter_2_id: number;
  letter_3_id: number;
  letters_ar: string[];
  letters_en: string[];
  digits: string;
  description: string;
  verification_status: string;
  listing_status: string;
  sale_mode: string;
  asking_price_minor: string | null;
  featured: boolean;
  views_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
  submission_note: string | null;
  submitted_at: string | null;
  documents: AdminPlateDocument[];
  events: AdminVerificationEvent[];
  active_auction_id: string | null;
  active_auction_status: string | null;
}

export interface AdminAuctionRecord {
  id: string;
  slug: string;
  plate_id: string;
  plate_slug: string;
  letters_ar: string[];
  letters_en: string[];
  digits: string;
  plate_type: string;
  city_name: string;
  status: string;
  starting_price: string;
  current_price: string;
  reserve_price: string | null;
  minimum_increment: string;
  deposit_type: string;
  deposit_amount: string | null;
  require_kyc: boolean;
  registration_start_at: string;
  registration_end_at: string;
  start_at: string;
  scheduled_end_at: string;
  effective_end_at: string;
  anti_sniping_enabled: boolean;
  extension_window_seconds: number | null;
  extension_duration_seconds: number | null;
  max_extensions: number | null;
  extension_count: number;
  sequence_no: number;
  commission_type: string;
  commission_value: string | null;
  winner_id: string | null;
  winning_amount: string | null;
  paused_from_status: string | null;
  cancellation_reason: string | null;
  registrations_count: number;
  bids_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminRegistrationRecord {
  id: string;
  auction_id: string;
  plate_label: string;
  user_id: string;
  user_name: string;
  user_phone: string | null;
  user_kyc: string;
  status: string;
  bidder_alias: string;
  required_deposit_minor: string;
  qualified_at: string | null;
  created_at: string;
}

export interface AdminBidRecord {
  id: string;
  auction_id: string;
  plate_label: string;
  user_id: string;
  user_name: string;
  amount_minor: string;
  sequence_no: number;
  accepted_at: string;
}

export interface AdminUserRecord {
  id: string;
  display_name: string;
  phone: string | null;
  status: string;
  kyc_status: string;
  roles: string[];
  plates_count: number;
  bids_count: number;
  created_at: string;
}

export interface AdminIdentityRecord {
  id: string;
  full_name: string;
  national_id: string;
  birth_date: string;
  phone: string;
  email: string;
  city: string;
  status: string;
  submitted_at: string;
  review_reason: string | null;
}

export interface AdminDepositRecord {
  id: string;
  user_id: string;
  user_name: string;
  auction_id: string;
  plate_label: string;
  provider: string;
  amount_minor: string;
  captured_amount_minor: string;
  refunded_amount_minor: string;
  status: string;
  expires_at: string | null;
  created_at: string;
}

export interface AdminPaymentTxRecord {
  id: string;
  authorization_id: string;
  operation: string;
  amount_minor: string;
  status: string;
  reason: string | null;
  provider_transaction_id: string | null;
  error_code: string | null;
  created_at: string;
}

export interface AdminSettlementRecord {
  id: string;
  auction_id: string;
  plate_label: string;
  seller_id: string;
  seller_name: string;
  winner_id: string;
  winner_name: string;
  winning_amount_minor: string;
  commission_minor: string;
  remaining_amount_minor: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AdminAuctionResultRecord {
  id: string;
  auction_id: string;
  plate_label: string;
  outcome: string;
  winner_id: string | null;
  winner_name: string | null;
  winning_amount_minor: string | null;
  final_sequence: number;
  finalized_at: string;
}

export interface AdminCmsPageRecord {
  slug: string;
  title_ar: string;
  body_ar: string;
  published: boolean;
  updated_at: string;
}

export interface AdminFaqRecord {
  id: string;
  question_ar: string;
  answer_ar: string;
  question_en: string | null;
  sort_order: number;
  published: boolean;
}

export interface AdminFeatureFlagRecord {
  key: string;
  enabled: boolean;
  description: string;
  updated_at: string;
}

export interface AdminContactMessageRecord {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface AdminNotificationRecord {
  id: string;
  user_id: string;
  user_name: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read_at: string | null;
  created_at: string;
}

export interface AdminAuditLogRecord {
  id: string;
  actor_id: string | null;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  reason: string | null;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminBadgeCounts {
  pendingVerifications: number;
  liveAuctions: number;
  pendingIdentities: number;
  newMessages: number;
  activeSettlements: number;
}

export interface AdminDashboardData {
  activeSection: AdminSectionKey;
  viewer: AdminViewerInfo;
  badges: AdminBadgeCounts;
  letters: AdminLetterRef[];
  plateTypes: AdminPlateTypeRef[];
  regions: AdminRegionRef[];
  cities: AdminCityRef[];
  plates: AdminPlateRecord[];
  auctions: AdminAuctionRecord[];
  registrations: AdminRegistrationRecord[];
  bids: AdminBidRecord[];
  users: AdminUserRecord[];
  identities: AdminIdentityRecord[];
  deposits: AdminDepositRecord[];
  payments: AdminPaymentTxRecord[];
  settlements: AdminSettlementRecord[];
  reports: AdminAuctionResultRecord[];
  cmsPages: AdminCmsPageRecord[];
  faqs: AdminFaqRecord[];
  siteSettings: SiteSettings;
  featureFlags: AdminFeatureFlagRecord[];
  messages: AdminContactMessageRecord[];
  notifications: AdminNotificationRecord[];
  auditLogs: AdminAuditLogRecord[];
}
