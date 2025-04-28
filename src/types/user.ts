export interface Schema {
  id: string;
  email: string;
  picture: string;
  username: string;
  password: string;
  bio: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}

export interface Payload {
  id: string;
  email: string;
  picture: string;
  username: string;
}

export interface GetByUsername {
  id: string;
  username: string;
  password: string;
  email: string;
  picture: string;
}
