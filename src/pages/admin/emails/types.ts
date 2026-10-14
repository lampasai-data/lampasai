export interface EmailTemplate {
  id: string;
  category: string;
  name: string;
  subject: string;
  body: string;
  subject_en: string | null;
  body_en: string | null;
  created_at: string;
  updated_at: string;
  trashed_at: string | null;
}

export interface EmailCampaign {
  id: string;
  type: "service" | "promotion";
  subject: string;
  message: string;
  cta_label: string | null;
  cta_url: string | null;
  subject_en: string | null;
  message_en: string | null;
  cta_label_en: string | null;
  language_filter: string | null;
  segment: string;
  recipients: number;
  sent: number;
  failed: number;
  created_at: string;
  trashed_at: string | null;
}

export interface EmailsApi {
  templates: EmailTemplate[];
  campaigns: EmailCampaign[];
  trashedTemplates: EmailTemplate[];
  trashedCampaigns: EmailCampaign[];
  unsubscribed: { user_id: string; created_at: string }[];
  error: string | null;
  reload: () => Promise<void>;
}

// Texts the admin writes are plain text: blank line = new paragraph.
export const toParagraphs = (text: string) => text.split(/\n{2,}/).filter((p) => p.trim() !== "");
