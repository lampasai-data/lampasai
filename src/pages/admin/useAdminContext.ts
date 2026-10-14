import { useOutletContext } from "react-router-dom";
import type { AdminAlert } from "../../lib/adminAlerts";
import type { AdminData } from "../../lib/adminData";

export interface AdminContextValue {
  data: AdminData;
  alerts: AdminAlert[];
  loading: boolean;
  reload: () => Promise<void>;
}

export function useAdminContext() {
  return useOutletContext<AdminContextValue>();
}
