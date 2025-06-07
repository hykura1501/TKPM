const { z } = require('zod');

const settingSchema = z.object({
  allowDomains: z.array(z.string()).optional(),
  allowPhones: z.array(z.object({ pattern: z.string() })).optional(),
});

module.exports = { settingSchema };
