const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

// Formats as XXXX-XXXX for easy reading/typing.
export function generateVoucherCode(): string {
  // Cryptographic randomness: Math.random() is predictable. 32 letters divide
  // 256 exactly, so taking each byte modulo 32 introduces no bias.
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let raw = "";
  for (const b of bytes) raw += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}
