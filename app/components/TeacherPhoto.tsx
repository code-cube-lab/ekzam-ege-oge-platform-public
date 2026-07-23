/* eslint-disable @next/next/no-img-element */
import type { SubjectLead } from "../../knowledge-base/teachers/subject-leads";
import { generatedTeacherVisuals, verifiedTeacherPhotos } from "../../knowledge-base/teachers/subject-leads";

export function TeacherPhoto({ lead }: { lead: SubjectLead }) {
  const photo = verifiedTeacherPhotos[lead.skillSlug];
  const generatedVisual = generatedTeacherVisuals[lead.skillSlug];

  if (photo) {
    return <a className={`teacher-photo teacher-photo-${lead.slug}`} href={photo.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Официальный источник фотографии: ${lead.teacher}`}>
      <img src={photo.src} alt={photo.alt} width="640" height="420" loading="lazy" />
      <small>Официальное фото ↗</small>
    </a>;
  }

  if (generatedVisual) {
    return <figure className={`teacher-photo teacher-photo-ai teacher-photo-${lead.slug}`} aria-label={`${generatedVisual.alt}. Не изображает конкретного преподавателя`}>
      <img src={generatedVisual.src} alt={generatedVisual.alt} width="900" height="900" loading="lazy" />
      <small>AI-визуал</small>
    </figure>;
  }

  return <span className="teacher-photo-fallback" aria-label={`Фото ${lead.teacher} пока не подтверждено`}>{lead.initials}</span>;
}
