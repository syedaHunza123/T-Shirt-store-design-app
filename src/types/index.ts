export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  created_at: string;
}

export interface Design {
  id: number;
  user_id: number;
  name: string;
  tshirt_color: string;
  text_content: string | null;
  text_color: string | null;
  text_font: string | null;
  text_position_x: number | null;
  text_position_y: number | null;
  image_url: string | null;
  image_position_x: number | null;
  image_position_y: number | null;
  image_scale: number | null;
  created_at: string;
  preview_url: string | null;
}

export interface CartItem {
  id: number;
  user_id: number;
  design_id: number;
  quantity: number;
  size: string;
  created_at: string;
  design?: Design;
}

// NextAuth types extension
declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}