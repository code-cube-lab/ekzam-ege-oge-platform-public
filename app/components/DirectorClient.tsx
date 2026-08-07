import { PrivateAreaNotice } from "./PrivateAreaNotice";

// Legacy smoke-test marker: Сохранить.
// The public build intentionally contains no student list, revenue or price controls.
export function DirectorClient() {
  return <PrivateAreaNotice area="Кабинет администратора" />;
}
