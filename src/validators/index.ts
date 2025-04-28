import z from "zod";

export const createUser = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" })
    .max(32, { message: "First name cannot exceed 32 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" })
    .max(32, { message: "Last name cannot exceed 32 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(32, { message: "Username cannot exceed 32 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const loginUser = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(32, { message: "Username cannot exceed 32 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const senderRecipient = z.object({
  sender: z.string().uuid({ message: "Sender must be a valid UUID" }),
  recipient: z.string().uuid({ message: "Recipient must be a valid UUID" }),
});

export const uuid = z.string().uuid({ message: "Must be a valid UUID" });

export const name = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(32, { message: "Username cannot exceed 32 characters" });

export const createMessage = z.object({
  sender: z.string().uuid({ message: "Sender must be a valid UUID" }),
  recipient: z.string().uuid({ message: "Recipient must be a valid UUID" }),
  friendship: z.string().uuid({ message: "Friendship must be a valid UUID" }),
  images: z.string().array().default([]),
  files: z.string().array().default([]),
  content: z.string(),
});

export const message = z.object({
  type: z.string(),
  sender: z.string().uuid({ message: "Sender must be a valid UUID" }),
  recipient: z.string().uuid({ message: "Recipient must be a valid UUID" }),
  content: z.string(),
  date: z.string().default(new Date().toISOString()),
  images: z.string().array().default([]),
  files: z.string().array().default([]),
});

export const liveMessage = z.object({
  type: z.string(),
  sender: z.string().uuid({ message: "Sender must be a valid UUID" }),
  liveId: z.string().uuid({ message: "LiveId must be a valid UUID" }),
  content: z.string(),
});

export const videoCallInvitationRequest = z.object({
  type: z.string(),
  room: z.string().uuid({ message: "Room must be a valid UUID" }),
  sender: z.string().uuid({ message: "Sender must be a valid UUID" }),
  recipient: z.string().uuid({ message: "Recipient must be a valid UUID" }),
});

export const createNotification = z.object({
  sender: z.string().uuid({ message: "Sender must be a valid UUID" }),
  recipient: z.string().uuid({ message: "Recipient must be a valid UUID" }),
  content: z.string().min(1, { message: "Invalid content size" }),
  seen: z.boolean().default(false),
  type: z.string(),
});

export const updateProfilePublicInformation = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" })
    .max(32, { message: "First name cannot exceed 32 characters" })
    .optional(),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" })
    .max(32, { message: "Last name cannot exceed 32 characters" })
    .optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(32, { message: "Username cannot exceed 32 characters" })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

export const url = z.string().url();

export const createPublication = z.object({
  publisherId: z
    .string()
    .uuid({ message: "Publisher ID must be a valid UUID" }),
  description: z.string().default(""),
  images: z
    .array(z.string())
    .min(1, { message: "At least one image must be provided" }),
  publicationStatus: z.enum(["draft", "published"]),
});

export const updatePublication = z.object({
  content: z.string().default("").optional(),
  images: z.array(z.string()).optional(),
  publicationStatus: z.enum(["draft", "published"]).optional(),
});

export const createStory = z.object({
  userId: z.string().uuid(),
  videoUrl: z.string(),
  description: z.string().default(""),
});

export const createGroup = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string().default(""),
  imageUrl: z.string(),
});
