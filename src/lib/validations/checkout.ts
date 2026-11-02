import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  alternatePhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit alternate mobile number")
    .optional()
    .or(z.literal("")),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

export const checkoutFormSchema = addressSchema.extend({
  customerNotes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
  paymentMethod: z.enum(["UPI", "COD"]).default("UPI"),
});

export const utrSubmissionSchema = z.object({
  utr: z
    .string()
    .min(12, "UPI UTR / Reference number must be exactly 12 characters")
    .max(12, "UPI UTR / Reference number must be exactly 12 characters")
    .regex(/^[0-9A-Za-z]{12}$/, "UTR must be a 12-character alphanumeric bank reference"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type UtrSubmissionData = z.infer<typeof utrSubmissionSchema>;
