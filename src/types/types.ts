export type Page =
  | 'front'
  | 'about'
  | 'classifieds'
  | 'editorial'
  | 'contact'
  | 'login'
  | 'admin'
  | 'admin-projects'
  | 'admin-blog'
  | 'admin-profile'
  | 'admin-skills'
  | 'admin-config'
  | 'not-found';

export interface NavigationLink {
  id: Page;
  label: string;
}

export interface SubHeader {
  left: string;
  center: string;
  right: string;
}
