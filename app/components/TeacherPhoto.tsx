/* eslint-disable @next/next/no-img-element */
import type { SubjectLead } from "../../knowledge-base/teachers/subject-leads";
import { verifiedTeacherPhotos } from "../../knowledge-base/teachers/subject-leads";

export function TeacherPhoto({ lead }: { lead: SubjectLead }) {
  const photo = verifiedTeacherPhotos[lead.skillSlug];

  if (!photo) {
    return <span className="teacher-photo-fallback" aria-label={`Фото ${lead.teacher} пока не подтверждено`}>{lead.initials}</span>;
  }

  return <a className={`teacher-photo teacher-photo-${lead.slug}`} href={photo.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Официальный источник фотографии: ${lead.teacher}`}>
    <img src={photo.src} alt={photo.alt} width="640" height="420" loading="lazy" />
    <small>Фото с официального сайта ↗</small>
  </a>;
}
