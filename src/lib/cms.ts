import cmsData from '@/data/cms_db.json';

export type CmsData = typeof cmsData;

export function getCms(): CmsData {
  return cmsData;
}
