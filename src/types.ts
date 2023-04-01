import { z } from 'zod';

const VehicleSchema = z.object({
  vin: z.string().min(17).max(17).regex(/^[A-Za-z0-9]+$/, 'Characters must be alphanumeric'),
  year: z
    .string()
    .regex(/^(19|20)\d{2}$/, 'Years must start with 19 or 20.')
    .refine(
      (value) => parseInt(value, 10) <= new Date().getFullYear(),
      { message: `Year must be >= to ${new Date().getFullYear()}.` }
    ),
  make: z.string().min(1),
  model: z.string().min(1),
});

const vehicleApplicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthMonth: z.string().regex(/^(0?[1-9]|1[0-2])$/, 'Months must be 1 - 12.'),
  birthDate: z.string().regex(/^(0?[1-9]|[12]\d|3[01])$/, 'Days must be 1 - 31'),
  birthYear: z
    .string()
    .regex(/^\d{4}$/, 'Four digit years only.')
    .refine(
      value => {
        const currentYear = new Date().getFullYear();
        return currentYear - parseInt(value) >= 16;
      },
      { message: 'Must be at least 16 years from today.' }
    ),
  vehicle: z.array(VehicleSchema),
});

export type VehicleType = z.infer<typeof VehicleSchema>;
export type ValidationSchemaType = z.infer<typeof vehicleApplicationSchema>;
export {vehicleApplicationSchema}
